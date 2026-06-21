import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarClock,
  FileText,
  UserRound,
} from "lucide-react";
import { auth } from "@/auth";
import { getCaseStatusLabel } from "@/components/cases/case-status";
import { getTaskPriorityLabel, getTaskStatusLabel } from "@/components/tasks/task-options";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPrisma } from "@/lib/prisma";

type CaseDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) {
    return "Sem prazo";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const session = await auth();

  if (!session?.user?.officeId) {
    redirect("/login");
  }

  const { id } = await params;
  const legalCase = await getPrisma().case.findFirst({
    where: {
      id,
      officeId: session.user.officeId,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          phone: true,
          document: true,
        },
      },
      tasks: {
        orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
        include: {
          client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      documents: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!legalCase) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/processos"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Voltar para processos
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <BriefcaseBusiness className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-2xl font-semibold tracking-normal">{legalCase.title}</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Cliente vinculado, prazos, tarefas e documentos do processo.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo do processo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{getCaseStatusLabel(legalCase.status)}</Badge>
              {legalCase.type ? <Badge variant="secondary">{legalCase.type}</Badge> : null}
            </div>
            <div className="grid gap-2 text-muted-foreground">
              <p>Numero: {legalCase.number ?? "Nao informado"}</p>
              <p>Vara/Tribunal: {legalCase.court ?? "Nao informado"}</p>
              <p>Proximo prazo: {formatDate(legalCase.nextDeadlineAt)}</p>
            </div>
            <Link
              href={`/dashboard/clientes/${legalCase.client.id}`}
              className="flex items-center gap-2 rounded-md border bg-secondary/30 p-3 hover:bg-accent"
            >
              <UserRound className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>
                <span className="block font-medium">{legalCase.client.name}</span>
                <span className="text-muted-foreground">
                  {legalCase.client.phone ?? legalCase.client.document ?? "Sem contato informado"}
                </span>
              </span>
            </Link>
            {legalCase.description ? (
              <p className="rounded-md border bg-secondary/40 p-3 leading-6 text-muted-foreground">
                {legalCase.description}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarClock className="h-5 w-5 text-primary" />
                Tarefas vinculadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {legalCase.tasks.length ? (
                legalCase.tasks.map((task) => (
                  <div key={task.id} className="rounded-md border p-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{task.title}</p>
                      <Badge variant="outline">{getTaskStatusLabel(task.status)}</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      Prazo: {formatDate(task.dueAt)}
                      {task.client ? ` · Cliente: ${task.client.name}` : ""}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {getTaskPriorityLabel(task.priority)}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma tarefa vinculada.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {legalCase.documents.length ? (
                legalCase.documents.map((document) => (
                  <div key={document.id} className="rounded-md border p-3 text-sm">
                    <p className="font-medium">{document.name}</p>
                    <p className="mt-1 text-muted-foreground">{document.type}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Estrutura preparada para documentos futuros.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarClock,
  KeyRound,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { auth } from "@/auth";
import { getCaseStatusLabel } from "@/components/cases/case-status";
import { CopySenhaGovButton } from "@/components/clients/copy-senha-gov-button";
import { getTaskPriorityLabel, getTaskStatusLabel } from "@/components/tasks/task-options";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPrisma } from "@/lib/prisma";

type ClientDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) {
    return "Nao informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const session = await auth();

  if (!session?.user?.officeId) {
    redirect("/login");
  }

  const { id } = await params;
  const client = await getPrisma().client.findFirst({
    where: {
      id,
      officeId: session.user.officeId,
    },
    include: {
      cases: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              tasks: true,
              documents: true,
            },
          },
        },
      },
      tasks: {
        orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
        include: {
          case: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/clientes"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Voltar para clientes
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <UserRound className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-2xl font-semibold tracking-normal">{client.name}</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Dados, processos e tarefas vinculadas ao cliente.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados principais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-3 text-muted-foreground">
              <p>CPF/documento: {client.document ?? "Nao informado"}</p>
              <p>Data de nascimento: {formatDate(client.birthDate)}</p>
              {client.phone ? (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {client.phone}
                </p>
              ) : null}
              {client.address ? (
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4" aria-hidden="true" />
                  {client.address}
                </p>
              ) : null}
              <p>Beneficio: {client.benefitType ?? "Nao informado"}</p>
              <p>Situacao: {client.benefitStatus ?? "Nao informado"}</p>
            </div>
            {client.senhaGov ? (
              <div className="rounded-md border bg-secondary/30 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-2 font-medium">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    Senha Gov.br: {client.senhaGov}
                  </span>
                  <CopySenhaGovButton senhaGov={client.senhaGov} />
                </div>
              </div>
            ) : null}
            {client.notes ? (
              <p className="rounded-md border bg-secondary/40 p-3 leading-6 text-muted-foreground">
                {client.notes}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BriefcaseBusiness className="h-5 w-5 text-primary" />
                Processos vinculados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.cases.length ? (
                client.cases.map((legalCase) => (
                  <Link
                    key={legalCase.id}
                    href={`/dashboard/processos/${legalCase.id}`}
                    className="block rounded-md border p-3 text-sm transition-colors hover:bg-accent"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{legalCase.title}</p>
                      <Badge variant="outline">
                        {getCaseStatusLabel(legalCase.status)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      {legalCase._count.tasks} tarefas · {legalCase._count.documents} documentos
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum processo vinculado.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarClock className="h-5 w-5 text-primary" />
                Tarefas vinculadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.tasks.length ? (
                client.tasks.map((task) => (
                  <div key={task.id} className="rounded-md border p-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{task.title}</p>
                      <Badge variant="outline">{getTaskStatusLabel(task.status)}</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      {task.case ? `Processo: ${task.case.title}` : "Sem processo"} · Prazo:{" "}
                      {formatDate(task.dueAt)}
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
        </div>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Users,
} from "lucide-react";
import { auth } from "@/auth";
import { getCaseStatusLabel } from "@/components/cases/case-status";
import {
  getTaskPriorityLabel,
  getTaskStatusLabel,
} from "@/components/tasks/task-options";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNextSevenDaysEnd, getTodayStart } from "@/lib/deadlines";
import { getPrisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

function getTodayEnd() {
  const today = getTodayStart();
  today.setHours(23, 59, 59, 999);
  return today;
}

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

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.officeId) {
    redirect("/login");
  }

  const officeId = session.user.officeId;
  const today = getTodayStart();
  const todayEnd = getTodayEnd();
  const nextSevenDays = getNextSevenDaysEnd();

  const [
    totalClients,
    totalCases,
    pendingTasksCount,
    overdueTasksCount,
    pendingTasks,
    overdueTasks,
    todayTasks,
    upcomingTasks,
    recentCases,
    recentClients,
  ] = await Promise.all([
    getPrisma().client.count({ where: { officeId } }),
    getPrisma().case.count({ where: { officeId } }),
    getPrisma().task.count({
      where: {
        officeId,
        status: {
          notIn: ["DONE", "CANCELED"],
        },
      },
    }),
    getPrisma().task.count({
      where: {
        officeId,
        dueAt: {
          lt: today,
        },
        status: {
          notIn: ["DONE", "CANCELED"],
        },
      },
    }),
    getPrisma().task.findMany({
      where: {
        officeId,
        status: {
          notIn: ["DONE", "CANCELED"],
        },
      },
      include: {
        client: { select: { id: true, name: true } },
        case: { select: { id: true, title: true } },
      },
      orderBy: [{ dueAt: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
    getPrisma().task.findMany({
      where: {
        officeId,
        dueAt: {
          lt: today,
        },
        status: {
          notIn: ["DONE", "CANCELED"],
        },
      },
      include: {
        client: { select: { id: true, name: true } },
        case: { select: { id: true, title: true } },
      },
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
      take: 5,
    }),
    getPrisma().task.findMany({
      where: {
        officeId,
        dueAt: {
          gte: today,
          lte: todayEnd,
        },
        status: {
          notIn: ["DONE", "CANCELED"],
        },
      },
      include: {
        client: { select: { id: true, name: true } },
        case: { select: { id: true, title: true } },
      },
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
      take: 5,
    }),
    getPrisma().task.findMany({
      where: {
        officeId,
        dueAt: {
          gte: today,
          lte: nextSevenDays,
        },
        status: {
          notIn: ["DONE", "CANCELED"],
        },
      },
      include: {
        client: { select: { id: true, name: true } },
        case: { select: { id: true, title: true } },
      },
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
      take: 6,
    }),
    getPrisma().case.findMany({
      where: { officeId },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    getPrisma().client.findMany({
      where: { officeId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Total de clientes", value: totalClients, icon: Users },
    { label: "Total de processos", value: totalCases, icon: BriefcaseBusiness },
    { label: "Tarefas pendentes", value: pendingTasksCount, icon: CalendarClock },
    { label: "Tarefas vencidas", value: overdueTasksCount, icon: AlertTriangle },
  ];

  const taskBlocks = [
    {
      title: "Tarefas pendentes",
      href: "/dashboard/tarefas?filtro=pendentes",
      tasks: pendingTasks,
      icon: CalendarClock,
    },
    {
      title: "Vencidas",
      href: "/dashboard/tarefas?filtro=vencidas",
      tasks: overdueTasks,
      icon: AlertTriangle,
      danger: true,
    },
    {
      title: "Para hoje",
      href: "/dashboard/tarefas?filtro=hoje",
      tasks: todayTasks,
      icon: CheckCircle2,
    },
    {
      title: "Proximos prazos",
      href: "/dashboard/tarefas?filtro=proximas",
      tasks: upcomingTasks,
      icon: CalendarClock,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">Central de trabalho</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Priorize prazos, tarefas e movimentacoes recentes do escritorio.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={cn(stat.label === "Tarefas vencidas" && stat.value > 0 && "border-destructive/70")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {taskBlocks.map((block) => (
          <Card key={block.title} className={cn(block.danger && "border-destructive/70")}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <block.icon
                  className={cn("h-5 w-5 text-primary", block.danger && "text-destructive")}
                  aria-hidden="true"
                />
                {block.title}
              </CardTitle>
              <Link href={block.href} className="text-sm text-muted-foreground hover:text-foreground">
                Ver todas
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {block.tasks.length ? (
                block.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-md border bg-secondary/30 p-3 text-sm"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="mt-1 text-muted-foreground">
                          {task.client?.name ?? task.case?.title ?? "Sem vinculo"}
                        </p>
                      </div>
                      <Badge variant={block.danger ? "destructive" : "secondary"}>
                        {formatDate(task.dueAt)}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">{getTaskStatusLabel(task.status)}</Badge>
                      <Badge variant="outline">
                        {getTaskPriorityLabel(task.priority)}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nada pendente aqui.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Processos recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCases.length ? (
              recentCases.map((legalCase) => (
                <Link
                  key={legalCase.id}
                  href={`/dashboard/processos/${legalCase.id}`}
                  className="block rounded-md border p-3 text-sm transition-colors hover:bg-accent"
                >
                  <p className="font-medium">{legalCase.title}</p>
                  <p className="mt-1 text-muted-foreground">
                    {legalCase.client.name} · {getCaseStatusLabel(legalCase.status)}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum processo cadastrado.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clientes recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentClients.length ? (
              recentClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/dashboard/clientes/${client.id}`}
                  className="block rounded-md border p-3 text-sm transition-colors hover:bg-accent"
                >
                  <p className="font-medium">{client.name}</p>
                  <p className="mt-1 text-muted-foreground">
                    {client.phone ?? client.document ?? "Sem contato informado"}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

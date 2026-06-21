import { redirect } from "next/navigation";
import Link from "next/link";
import { TaskStatus } from "@prisma/client";
import { AlertTriangle, CalendarClock, CheckCircle2, Search } from "lucide-react";
import { auth } from "@/auth";
import { TaskManager } from "@/components/tasks/task-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getTodayStart, getNextSevenDaysEnd } from "@/lib/deadlines";
import { getPrisma } from "@/lib/prisma";

type TasksPageProps = {
  searchParams: Promise<{
    q?: string;
    filtro?: string;
  }>;
};

const filters = [
  { label: "Todas", value: "" },
  { label: "Pendentes", value: "pendentes" },
  { label: "Concluidas", value: "concluidas" },
  { label: "Vencidas", value: "vencidas" },
  { label: "Hoje", value: "hoje" },
  { label: "Proximas", value: "proximas" },
];

function getTodayEnd() {
  const today = getTodayStart();
  today.setHours(23, 59, 59, 999);
  return today;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const session = await auth();

  if (!session?.user?.officeId) {
    redirect("/login");
  }

  const officeId = session.user.officeId;
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const activeFilter = params.filtro ?? "";
  const today = getTodayStart();
  const todayEnd = getTodayEnd();
  const nextSevenDays = getNextSevenDaysEnd();
  const openStatuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS];

  const filterWhere =
    activeFilter === "pendentes"
      ? { status: { in: openStatuses } }
      : activeFilter === "concluidas"
        ? { status: TaskStatus.DONE }
        : activeFilter === "vencidas"
          ? {
              dueAt: { lt: today },
              status: { in: openStatuses },
            }
          : activeFilter === "hoje"
            ? {
                dueAt: { gte: today, lte: todayEnd },
                status: { in: openStatuses },
              }
            : activeFilter === "proximas"
              ? {
                  dueAt: { gte: today, lte: nextSevenDays },
                  status: { in: openStatuses },
                }
              : {};

  const searchWhere = query
    ? {
        OR: [
          { title: { contains: query, mode: "insensitive" as const } },
          { type: { contains: query, mode: "insensitive" as const } },
          { client: { name: { contains: query, mode: "insensitive" as const } } },
          { case: { title: { contains: query, mode: "insensitive" as const } } },
          { case: { number: { contains: query, mode: "insensitive" as const } } },
          {
            case: {
              client: { name: { contains: query, mode: "insensitive" as const } },
            },
          },
        ],
      }
    : {};

  const [clients, cases, users, tasks, overdueCount, dueSoonCount] = await Promise.all([
    getPrisma().client.findMany({
      where: {
        officeId,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
    getPrisma().case.findMany({
      where: {
        officeId,
      },
      orderBy: {
        title: "asc",
      },
      select: {
        id: true,
        title: true,
        number: true,
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    getPrisma().user.findMany({
      where: {
        officeId,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    }),
    getPrisma().task.findMany({
      where: {
        officeId,
        ...filterWhere,
        ...searchWhere,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        case: {
          select: {
            id: true,
            title: true,
            number: true,
            client: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        assignee: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        {
          status: "asc",
        },
        {
          dueAt: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
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
    getPrisma().task.count({
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
    }),
  ]);

  const openTasks = tasks.filter(
    (task) => task.status !== "DONE" && task.status !== "CANCELED",
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-2xl font-semibold tracking-normal">Tarefas e prazos</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Controle tarefas vinculadas aos processos e acompanhe prazos criticos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Abertas
            </CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{openTasks}</div>
          </CardContent>
        </Card>
        <Card className={overdueCount > 0 ? "border-destructive/70" : undefined}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vencidas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{overdueCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Proximos 7 dias
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{dueSoonCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.label}
              asChild
              variant={activeFilter === filter.value ? "default" : "outline"}
              size="sm"
            >
              <Link
                href={{
                  pathname: "/dashboard/tarefas",
                  query: {
                    ...(filter.value ? { filtro: filter.value } : {}),
                    ...(query ? { q: query } : {}),
                  },
                }}
              >
                {filter.label}
              </Link>
            </Button>
          ))}
        </div>
        <form className="flex w-full gap-2 lg:max-w-md">
          {activeFilter ? (
            <input type="hidden" name="filtro" value={activeFilter} />
          ) : null}
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Buscar por tarefa, cliente ou processo"
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="outline">
            Buscar
          </Button>
        </form>
      </div>

      <TaskManager
        tasks={tasks}
        clients={clients}
        cases={cases}
        users={users}
        query={query || activeFilter}
      />
    </div>
  );
}

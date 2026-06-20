import { redirect } from "next/navigation";
import { AlertTriangle, CalendarClock, CheckCircle2, Plus } from "lucide-react";
import { auth } from "@/auth";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { TasksList } from "@/components/tasks/tasks-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTodayStart, getNextSevenDaysEnd } from "@/lib/deadlines";
import { getPrisma } from "@/lib/prisma";

export default async function TasksPage() {
  const session = await auth();

  if (!session?.user?.officeId) {
    redirect("/login");
  }

  const officeId = session.user.officeId;
  const today = getTodayStart();
  const nextSevenDays = getNextSevenDaysEnd();

  const [cases, users, tasks, overdueCount, dueSoonCount] = await Promise.all([
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
      },
      include: {
        case: {
          select: {
            title: true,
            number: true,
            client: {
              select: {
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-5 w-5 text-primary" aria-hidden="true" />
            Nova tarefa
          </CardTitle>
          <CardDescription>
            As datas de vencimento ficam estruturadas para futuras notificacoes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTaskForm cases={cases} users={users} />
        </CardContent>
      </Card>

      <TasksList tasks={tasks} cases={cases} users={users} />
    </div>
  );
}

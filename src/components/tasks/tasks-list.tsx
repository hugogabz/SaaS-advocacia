import type { TaskPriority, TaskStatus } from "@prisma/client";
import { AlertTriangle, BriefcaseBusiness, CalendarClock, Search, UserRound } from "lucide-react";
import { EditTaskForm } from "@/components/tasks/edit-task-form";
import {
  getTaskPriorityLabel,
  getTaskStatusLabel,
} from "@/components/tasks/task-options";
import { TaskActions } from "@/components/tasks/task-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDueSoon, isOverdue } from "@/lib/deadlines";
import { cn } from "@/lib/utils";

type TaskItem = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: Date | null;
  caseId: string | null;
  assigneeId: string | null;
  case: {
    title: string;
    number: string | null;
    client: {
      name: string;
    };
  } | null;
  assignee: {
    name: string;
    email: string;
  } | null;
};

type TasksListProps = {
  tasks: TaskItem[];
  cases: React.ComponentProps<typeof EditTaskForm>["cases"];
  users: React.ComponentProps<typeof EditTaskForm>["users"];
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getDueLabel(task: TaskItem) {
  if (!task.dueAt) {
    return null;
  }

  if (isOverdue(task.dueAt, task.status)) {
    return `Vencida em ${formatDate(task.dueAt)}`;
  }

  if (isDueSoon(task.dueAt, task.status)) {
    return `Vence ate ${formatDate(task.dueAt)}`;
  }

  return `Prazo: ${formatDate(task.dueAt)}`;
}

export function TasksList({ tasks, cases, users }: TasksListProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
          <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-medium">Nenhuma tarefa cadastrada</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie tarefas vinculadas aos processos para acompanhar prazos do escritorio.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => {
        const overdue = isOverdue(task.dueAt, task.status);
        const dueSoon = isDueSoon(task.dueAt, task.status);
        const dueLabel = getDueLabel(task);

        return (
          <Card
            key={task.id}
            className={cn(
              overdue && "border-destructive/70",
              !overdue && dueSoon && "border-primary/50",
            )}
          >
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarClock
                    className={cn(
                      "h-5 w-5 text-primary",
                      overdue && "text-destructive",
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{task.title}</span>
                </CardTitle>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  {task.case ? (
                    <span className="flex items-center gap-1.5">
                      <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
                      {task.case.title} - {task.case.client.name}
                    </span>
                  ) : null}
                  {task.assignee ? (
                    <span className="flex items-center gap-1.5">
                      <UserRound className="h-4 w-4" aria-hidden="true" />
                      {task.assignee.name || task.assignee.email}
                    </span>
                  ) : null}
                  <span>Status: {getTaskStatusLabel(task.status)}</span>
                  <span>Prioridade: {getTaskPriorityLabel(task.priority)}</span>
                  {dueLabel ? (
                    <span
                      className={cn(
                        "flex items-center gap-1.5",
                        overdue && "font-medium text-destructive",
                        !overdue && dueSoon && "font-medium text-primary",
                      )}
                    >
                      {overdue ? (
                        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                      ) : null}
                      {dueLabel}
                    </span>
                  ) : null}
                </div>
              </div>
              <TaskActions taskId={task.id} isDone={task.status === "DONE"} />
            </CardHeader>
            <CardContent className="space-y-5">
              {task.description ? (
                <p className="rounded-md border bg-secondary/40 p-3 text-sm leading-6 text-muted-foreground">
                  {task.description}
                </p>
              ) : null}
              <details className="group rounded-md border p-4">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors group-open:text-foreground">
                  Editar tarefa
                </summary>
                <div className="mt-4">
                  <EditTaskForm cases={cases} users={users} task={task} />
                </div>
              </details>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

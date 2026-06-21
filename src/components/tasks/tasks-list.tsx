"use client";

import type { Task, TaskPriority, TaskStatus } from "@prisma/client";
import Link from "next/link";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarClock,
  Edit,
  Search,
  UserRound,
} from "lucide-react";
import {
  getTaskPriorityLabel,
  getTaskStatusLabel,
} from "@/components/tasks/task-options";
import { TaskActions } from "@/components/tasks/task-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDueSoon, isOverdue } from "@/lib/deadlines";
import { cn } from "@/lib/utils";

type TaskItem = Task & {
  client: {
    id: string;
    name: string;
  } | null;
  case: {
    id: string;
    title: string;
    number: string | null;
    client: {
      id: string;
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
  query: string;
  onEdit: (task: TaskItem) => void;
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

function getPriorityVariant(priority: TaskPriority) {
  if (priority === "URGENT") {
    return "destructive";
  }

  if (priority === "HIGH") {
    return "default";
  }

  return "secondary";
}

function getStatusVariant(status: TaskStatus) {
  if (status === "DONE") {
    return "default";
  }

  if (status === "CANCELED") {
    return "outline";
  }

  return "secondary";
}

function TaskCard({
  task,
  onEdit,
}: {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
}) {
  const overdue = isOverdue(task.dueAt, task.status);
  const dueSoon = isDueSoon(task.dueAt, task.status);
  const dueLabel = getDueLabel(task);
  const linkedClient = task.client ?? task.case?.client ?? null;

  return (
    <Card
      className={cn(
        overdue && "border-destructive/70",
        !overdue && dueSoon && "border-primary/50",
      )}
    >
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarClock
              className={cn("h-5 w-5 text-primary", overdue && "text-destructive")}
              aria-hidden="true"
            />
            <span className="truncate">{task.title}</span>
          </CardTitle>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
            <Badge variant={getStatusVariant(task.status)}>
              {getTaskStatusLabel(task.status)}
            </Badge>
            <Badge variant={getPriorityVariant(task.priority)}>
              {getTaskPriorityLabel(task.priority)}
            </Badge>
            {task.type ? <Badge variant="outline">{task.type}</Badge> : null}
            {linkedClient ? (
              <Link
                href={`/dashboard/clientes/${linkedClient.id}`}
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <UserRound className="h-4 w-4" aria-hidden="true" />
                {linkedClient.name}
              </Link>
            ) : null}
            {task.case ? (
              <Link
                href={`/dashboard/processos/${task.case.id}`}
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
                {task.case.title}
              </Link>
            ) : null}
            {task.assignee ? (
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                {task.assignee.name || task.assignee.email}
              </span>
            ) : null}
            {dueLabel ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5",
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
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onEdit(task)}>
            <Edit className="h-4 w-4" aria-hidden="true" />
            Editar
          </Button>
          <TaskActions taskId={task.id} isDone={task.status === "DONE"} />
        </div>
      </CardHeader>
      {task.description ? (
        <CardContent>
          <p className="rounded-md border bg-secondary/40 p-3 text-sm leading-6 text-muted-foreground">
            {task.description}
          </p>
        </CardContent>
      ) : null}
    </Card>
  );
}

const taskGroups: Array<{ title: string; statuses: TaskStatus[] }> = [
  { title: "Pendentes", statuses: ["TODO"] },
  { title: "Em andamento", statuses: ["IN_PROGRESS"] },
  { title: "Concluidas", statuses: ["DONE"] },
  { title: "Canceladas", statuses: ["CANCELED"] },
];

export function TasksList({ tasks, query, onEdit }: TasksListProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
          <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-medium">Nenhuma tarefa cadastrada</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query
                ? "Tente outro filtro ou busca."
                : "Crie tarefas livres ou vinculadas a clientes e processos."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {taskGroups.map((group) => {
        const groupTasks = tasks.filter((task) => group.statuses.includes(task.status));

        if (groupTasks.length === 0) {
          return null;
        }

        return (
          <section key={group.title} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">{group.title}</h3>
              <Badge variant="outline">{groupTasks.length}</Badge>
            </div>
            <div className="grid gap-4">
              {groupTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEdit} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

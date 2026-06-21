"use client";

import type { Client, Task } from "@prisma/client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { TasksList } from "@/components/tasks/tasks-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TaskWithRelations = Task & {
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

type TaskManagerProps = {
  tasks: TaskWithRelations[];
  clients: Pick<Client, "id" | "name">[];
  cases: React.ComponentProps<typeof CreateTaskForm>["cases"];
  users: React.ComponentProps<typeof CreateTaskForm>["users"];
  query: string;
};

export function TaskManager({
  tasks,
  clients,
  cases,
  users,
  query,
}: TaskManagerProps) {
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(null);

  function cancelEdit() {
    setEditingTask(null);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-5 w-5 text-primary" aria-hidden="true" />
            {editingTask ? "Editar tarefa" : "Nova tarefa"}
          </CardTitle>
          <CardDescription>
            {editingTask
              ? "Altere os dados no formulario abaixo e salve para voltar ao cadastro."
              : "Crie tarefas livres ou vinculadas a cliente, processo ou ambos."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTaskForm
            key={editingTask?.id ?? "create-task"}
            clients={clients}
            cases={cases}
            users={users}
            editingTask={editingTask}
            onCancelEdit={cancelEdit}
          />
        </CardContent>
      </Card>

      <TasksList tasks={tasks} query={query} onEdit={setEditingTask} />
    </>
  );
}

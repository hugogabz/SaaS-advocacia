"use client";

import type { TaskPriority, TaskStatus } from "@prisma/client";
import { useActionState } from "react";
import { SubmitButton } from "@/components/tasks/submit-button";
import { TaskFormFields } from "@/components/tasks/task-form-fields";
import {
  updateTaskAction,
  type TaskActionState,
} from "@/server/actions/tasks";

type EditTaskFormProps = {
  cases: React.ComponentProps<typeof TaskFormFields>["cases"];
  users: React.ComponentProps<typeof TaskFormFields>["users"];
  task: {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueAt: Date | null;
    caseId: string | null;
    assigneeId: string | null;
  };
};

const initialState: TaskActionState = {
  ok: false,
  message: "",
};

export function EditTaskForm({ cases, users, task }: EditTaskFormProps) {
  const updateAction = updateTaskAction.bind(null, task.id);
  const [state, formAction] = useActionState(updateAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <TaskFormFields
        idPrefix={`edit-task-${task.id}`}
        cases={cases}
        users={users}
        defaultValues={task}
        errors={state.errors}
      />
      {state.message ? (
        <p
          className={
            state.ok ? "text-sm text-muted-foreground" : "text-sm text-destructive"
          }
        >
          {state.message}
        </p>
      ) : null}
      <SubmitButton size="sm">Salvar alteracoes</SubmitButton>
    </form>
  );
}

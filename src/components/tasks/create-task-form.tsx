"use client";

import type { Task } from "@prisma/client";
import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/tasks/submit-button";
import { TaskFormFields } from "@/components/tasks/task-form-fields";
import {
  saveTaskAction,
  type TaskActionState,
} from "@/server/actions/tasks";

type CreateTaskFormProps = {
  clients: React.ComponentProps<typeof TaskFormFields>["clients"];
  cases: React.ComponentProps<typeof TaskFormFields>["cases"];
  users: React.ComponentProps<typeof TaskFormFields>["users"];
  editingTask: Task | null;
  onCancelEdit: () => void;
};

const initialState: TaskActionState = {
  ok: false,
  message: "",
};

export function CreateTaskForm({
  clients,
  cases,
  users,
  editingTask,
  onCancelEdit,
}: CreateTaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(saveTaskAction, initialState);
  const isEditing = Boolean(editingTask);
  const formKey = editingTask?.id ?? "create-task";

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      onCancelEdit();
    }
  }, [onCancelEdit, state.ok]);

  return (
    <form key={formKey} ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="taskId" value={editingTask?.id ?? ""} />
      <TaskFormFields
        idPrefix={isEditing ? `edit-task-${editingTask?.id}` : "create-task"}
        clients={clients}
        cases={cases}
        users={users}
        defaultValues={editingTask ?? undefined}
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
      <div className="flex flex-col gap-2 sm:flex-row">
        <SubmitButton className="w-full sm:w-auto">
          {isEditing ? "Salvar alteracoes" : "Criar tarefa"}
        </SubmitButton>
        {isEditing ? (
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onCancelEdit}
          >
            Cancelar edicao
          </Button>
        ) : null}
      </div>
    </form>
  );
}

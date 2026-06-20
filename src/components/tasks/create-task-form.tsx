"use client";

import { useActionState, useEffect, useRef } from "react";
import { SubmitButton } from "@/components/tasks/submit-button";
import { TaskFormFields } from "@/components/tasks/task-form-fields";
import {
  createTaskAction,
  type TaskActionState,
} from "@/server/actions/tasks";

type CreateTaskFormProps = {
  cases: React.ComponentProps<typeof TaskFormFields>["cases"];
  users: React.ComponentProps<typeof TaskFormFields>["users"];
};

const initialState: TaskActionState = {
  ok: false,
  message: "",
};

export function CreateTaskForm({ cases, users }: CreateTaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createTaskAction, initialState);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <TaskFormFields
        idPrefix="create-task"
        cases={cases}
        users={users}
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
      <SubmitButton className="w-full sm:w-auto">Criar tarefa</SubmitButton>
    </form>
  );
}

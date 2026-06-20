"use client";

import { useActionState, useEffect, useRef } from "react";
import { CaseFormFields } from "@/components/cases/case-form-fields";
import { SubmitButton } from "@/components/cases/submit-button";
import {
  createCaseAction,
  type CaseActionState,
} from "@/server/actions/cases";

type CreateCaseFormProps = {
  clients: Array<{
    id: string;
    name: string;
  }>;
};

const initialState: CaseActionState = {
  ok: false,
  message: "",
};

export function CreateCaseForm({ clients }: CreateCaseFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createCaseAction, initialState);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <CaseFormFields
        idPrefix="create-case"
        clients={clients}
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
      <SubmitButton className="w-full sm:w-auto">Criar processo</SubmitButton>
    </form>
  );
}

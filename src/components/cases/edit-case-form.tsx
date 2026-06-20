"use client";

import type { CaseStatus } from "@prisma/client";
import { useActionState } from "react";
import { CaseFormFields } from "@/components/cases/case-form-fields";
import { SubmitButton } from "@/components/cases/submit-button";
import {
  updateCaseAction,
  type CaseActionState,
} from "@/server/actions/cases";

type EditCaseFormProps = {
  clients: Array<{
    id: string;
    name: string;
  }>;
  legalCase: {
    id: string;
    title: string;
    number: string | null;
    type: string | null;
    court: string | null;
    status: CaseStatus;
    clientId: string;
    description: string | null;
  };
};

const initialState: CaseActionState = {
  ok: false,
  message: "",
};

export function EditCaseForm({ clients, legalCase }: EditCaseFormProps) {
  const updateAction = updateCaseAction.bind(null, legalCase.id);
  const [state, formAction] = useActionState(updateAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <CaseFormFields
        idPrefix={`edit-case-${legalCase.id}`}
        clients={clients}
        defaultValues={legalCase}
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

"use client";

import type { Case, Client } from "@prisma/client";
import { useActionState, useEffect, useRef } from "react";
import { CaseFormFields } from "@/components/cases/case-form-fields";
import { SubmitButton } from "@/components/cases/submit-button";
import {
  saveCaseAction,
  type CaseActionState,
} from "@/server/actions/cases";
import { Button } from "@/components/ui/button";

type CreateCaseFormProps = {
  clients: Pick<Client, "id" | "name">[];
  editingCase: Case | null;
  onCancelEdit: () => void;
};

const initialState: CaseActionState = {
  ok: false,
  message: "",
};

export function CreateCaseForm({
  clients,
  editingCase,
  onCancelEdit,
}: CreateCaseFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(saveCaseAction, initialState);
  const isEditing = Boolean(editingCase);
  const formKey = editingCase?.id ?? "create-case";

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      onCancelEdit();
    }
  }, [onCancelEdit, state.ok]);

  return (
    <form key={formKey} ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="caseId" value={editingCase?.id ?? ""} />
      <CaseFormFields
        idPrefix={isEditing ? `edit-case-${editingCase?.id}` : "create-case"}
        clients={clients}
        defaultValues={editingCase ?? undefined}
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
          {isEditing ? "Salvar alteracoes" : "Adicionar"}
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

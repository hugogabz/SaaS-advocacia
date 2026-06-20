"use client";

import type { Client } from "@prisma/client";
import { useActionState, useEffect, useRef } from "react";
import { ClientFormFields } from "@/components/clients/client-form-fields";
import { SubmitButton } from "@/components/clients/submit-button";
import {
  saveClientAction,
  type ClientActionState,
} from "@/server/actions/clients";
import { Button } from "@/components/ui/button";

const initialState: ClientActionState = {
  ok: false,
  message: "",
};

type CreateClientFormProps = {
  editingClient: Client | null;
  onCancelEdit: () => void;
};

export function CreateClientForm({
  editingClient,
  onCancelEdit,
}: CreateClientFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(saveClientAction, initialState);
  const isEditing = Boolean(editingClient);
  const formKey = editingClient?.id ?? "create-client";

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      onCancelEdit();
    }
  }, [onCancelEdit, state.ok]);

  return (
    <form key={formKey} ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="clientId" value={editingClient?.id ?? ""} />
      <ClientFormFields
        idPrefix={isEditing ? `edit-client-${editingClient?.id}` : "create-client"}
        defaultValues={editingClient ?? undefined}
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

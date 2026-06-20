"use client";

import { Trash2 } from "lucide-react";
import { SubmitButton } from "@/components/clients/submit-button";
import { deleteClientAction } from "@/server/actions/clients";

type DeleteClientButtonProps = {
  clientId: string;
};

export function DeleteClientButton({ clientId }: DeleteClientButtonProps) {
  const deleteAction = deleteClientAction.bind(null, clientId);

  return (
    <form action={deleteAction}>
      <SubmitButton
        variant="destructive"
        size="sm"
        pendingLabel="Excluindo..."
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Excluir
      </SubmitButton>
    </form>
  );
}

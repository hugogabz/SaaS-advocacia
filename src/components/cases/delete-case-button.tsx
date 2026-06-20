import { Trash2 } from "lucide-react";
import { SubmitButton } from "@/components/cases/submit-button";
import { deleteCaseAction } from "@/server/actions/cases";

type DeleteCaseButtonProps = {
  caseId: string;
};

export function DeleteCaseButton({ caseId }: DeleteCaseButtonProps) {
  const deleteAction = deleteCaseAction.bind(null, caseId);

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

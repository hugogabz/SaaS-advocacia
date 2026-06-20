import { CheckCircle2, Trash2 } from "lucide-react";
import { SubmitButton } from "@/components/tasks/submit-button";
import { completeTaskAction, deleteTaskAction } from "@/server/actions/tasks";

type TaskActionsProps = {
  taskId: string;
  isDone: boolean;
};

export function TaskActions({ taskId, isDone }: TaskActionsProps) {
  const completeAction = completeTaskAction.bind(null, taskId);
  const deleteAction = deleteTaskAction.bind(null, taskId);

  return (
    <div className="flex flex-wrap gap-2">
      {!isDone ? (
        <form action={completeAction}>
          <SubmitButton variant="outline" size="sm" pendingLabel="Concluindo...">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Concluir
          </SubmitButton>
        </form>
      ) : null}
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
    </div>
  );
}

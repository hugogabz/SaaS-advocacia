import type { TaskPriority, TaskStatus } from "@prisma/client";
import { taskPriorityOptions, taskStatusOptions } from "@/components/tasks/task-options";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TaskFormFieldsProps = {
  idPrefix: string;
  clients: Array<{
    id: string;
    name: string;
  }>;
  cases: Array<{
    id: string;
    title: string;
    number: string | null;
    client: {
      name: string;
    };
  }>;
  users: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  defaultValues?: {
    title: string;
    type: string | null;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueAt: Date | null;
    clientId: string | null;
    caseId: string | null;
    assigneeId: string | null;
  };
  errors?: Record<string, string[] | undefined>;
};

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

function formatDateInput(date: Date | null | undefined) {
  if (!date) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function TaskFormFields({
  idPrefix,
  clients,
  cases,
  users,
  defaultValues,
  errors,
}: TaskFormFieldsProps) {
  const titleId = `${idPrefix}-title`;
  const typeId = `${idPrefix}-type`;
  const descriptionId = `${idPrefix}-description`;
  const statusId = `${idPrefix}-status`;
  const priorityId = `${idPrefix}-priority`;
  const dueDateId = `${idPrefix}-due-date`;
  const clientId = `${idPrefix}-client`;
  const caseId = `${idPrefix}-case`;
  const assignedToId = `${idPrefix}-assigned-to`;

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor={titleId}>Titulo</Label>
        <Input
          id={titleId}
          name="title"
          defaultValue={defaultValues?.title ?? ""}
          placeholder="Ex.: Protocolar contestacao"
          required
        />
        {errors?.title ? (
          <p className="text-sm text-destructive">{errors.title[0]}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={typeId}>Tipo</Label>
          <Input
            id={typeId}
            name="type"
            defaultValue={defaultValues?.type ?? ""}
            placeholder="Ex.: Prazo, documento, atendimento"
          />
          {errors?.type ? (
            <p className="text-sm text-destructive">{errors.type[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor={clientId}>Cliente</Label>
          <select
            id={clientId}
            name="clientId"
            defaultValue={defaultValues?.clientId ?? ""}
            className={selectClassName}
          >
            <option value="">Sem cliente vinculado</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors?.clientId ? (
            <p className="text-sm text-destructive">{errors.clientId[0]}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={caseId}>Processo</Label>
          <select
            id={caseId}
            name="caseId"
            defaultValue={defaultValues?.caseId ?? ""}
            className={cn(selectClassName, !cases.length && "text-muted-foreground")}
            disabled={!cases.length}
          >
            <option value="">
              {cases.length ? "Sem processo vinculado" : "Cadastre um processo depois"}
            </option>
            {cases.map((legalCase) => (
              <option key={legalCase.id} value={legalCase.id}>
                {legalCase.title} - {legalCase.client.name}
                {legalCase.number ? ` (${legalCase.number})` : ""}
              </option>
            ))}
          </select>
          {errors?.caseId ? (
            <p className="text-sm text-destructive">{errors.caseId[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor={assignedToId}>Responsavel</Label>
          <select
            id={assignedToId}
            name="assignedToId"
            defaultValue={defaultValues?.assigneeId ?? ""}
            className={selectClassName}
          >
            <option value="">Sem responsavel</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
          {errors?.assignedToId ? (
            <p className="text-sm text-destructive">{errors.assignedToId[0]}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={statusId}>Status</Label>
          <select
            id={statusId}
            name="status"
            defaultValue={defaultValues?.status ?? "TODO"}
            className={selectClassName}
          >
            {taskStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors?.status ? (
            <p className="text-sm text-destructive">{errors.status[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor={priorityId}>Prioridade</Label>
          <select
            id={priorityId}
            name="priority"
            defaultValue={defaultValues?.priority ?? "MEDIUM"}
            className={selectClassName}
          >
            {taskPriorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors?.priority ? (
            <p className="text-sm text-destructive">{errors.priority[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor={dueDateId}>Prazo</Label>
          <Input
            id={dueDateId}
            name="dueDate"
            type="date"
            defaultValue={formatDateInput(defaultValues?.dueAt)}
          />
          {errors?.dueDate ? (
            <p className="text-sm text-destructive">{errors.dueDate[0]}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={descriptionId}>Descricao</Label>
        <Textarea
          id={descriptionId}
          name="description"
          defaultValue={defaultValues?.description ?? ""}
          placeholder="Detalhes, orientacoes ou observacoes do prazo"
        />
        {errors?.description ? (
          <p className="text-sm text-destructive">{errors.description[0]}</p>
        ) : null}
      </div>
    </div>
  );
}

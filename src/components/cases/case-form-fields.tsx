import type { CaseStatus } from "@prisma/client";
import { caseStatusOptions } from "@/components/cases/case-status";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type CaseFormFieldsProps = {
  idPrefix: string;
  clients: Array<{
    id: string;
    name: string;
  }>;
  defaultValues?: {
    title: string;
    number: string | null;
    type: string | null;
    court: string | null;
    status: CaseStatus;
    clientId: string;
    description: string | null;
  };
  errors?: Record<string, string[] | undefined>;
};

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function CaseFormFields({
  idPrefix,
  clients,
  defaultValues,
  errors,
}: CaseFormFieldsProps) {
  const titleId = `${idPrefix}-title`;
  const caseNumberId = `${idPrefix}-case-number`;
  const typeId = `${idPrefix}-type`;
  const courtId = `${idPrefix}-court`;
  const statusId = `${idPrefix}-status`;
  const clientId = `${idPrefix}-client`;
  const descriptionId = `${idPrefix}-description`;

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor={titleId}>Titulo</Label>
        <Input
          id={titleId}
          name="title"
          defaultValue={defaultValues?.title ?? ""}
          placeholder="Ex.: Acao de cobranca"
          required
        />
        {errors?.title ? (
          <p className="text-sm text-destructive">{errors.title[0]}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={caseNumberId}>Numero do processo</Label>
          <Input
            id={caseNumberId}
            name="caseNumber"
            defaultValue={defaultValues?.number ?? ""}
            placeholder="0000000-00.0000.0.00.0000"
          />
          {errors?.caseNumber ? (
            <p className="text-sm text-destructive">{errors.caseNumber[0]}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={typeId}>Tipo</Label>
          <Input
            id={typeId}
            name="type"
            defaultValue={defaultValues?.type ?? ""}
            placeholder="Civel, trabalhista, tributario..."
          />
          {errors?.type ? (
            <p className="text-sm text-destructive">{errors.type[0]}</p>
          ) : null}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={courtId}>Vara/Tribunal</Label>
          <Input
            id={courtId}
            name="court"
            defaultValue={defaultValues?.court ?? ""}
            placeholder="Ex.: 1a Vara Civel"
          />
          {errors?.court ? (
            <p className="text-sm text-destructive">{errors.court[0]}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={statusId}>Status</Label>
          <select
            id={statusId}
            name="status"
            defaultValue={defaultValues?.status ?? "ACTIVE"}
            className={selectClassName}
          >
            {caseStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors?.status ? (
            <p className="text-sm text-destructive">{errors.status[0]}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={clientId}>Cliente</Label>
        <select
          id={clientId}
          name="clientId"
          defaultValue={defaultValues?.clientId ?? ""}
          className={cn(selectClassName, !clients.length && "text-muted-foreground")}
          required
          disabled={!clients.length}
        >
          <option value="" disabled>
            {clients.length ? "Selecione um cliente" : "Cadastre um cliente primeiro"}
          </option>
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
      <div className="space-y-2">
        <Label htmlFor={descriptionId}>Descricao/observacoes</Label>
        <Textarea
          id={descriptionId}
          name="description"
          defaultValue={defaultValues?.description ?? ""}
          placeholder="Resumo, estrategia ou observacoes relevantes"
        />
        {errors?.description ? (
          <p className="text-sm text-destructive">{errors.description[0]}</p>
        ) : null}
      </div>
    </div>
  );
}

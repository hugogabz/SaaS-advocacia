import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ClientFormFieldsProps = {
  idPrefix: string;
  defaultValues?: {
    name: string;
    birthDate: Date | null;
    address: string | null;
    email: string | null;
    phone: string | null;
    document: string | null;
    cpf: string | null;
    benefitType: string | null;
    benefitStatus: string | null;
    govPassword: string | null;
    notes: string | null;
  };
  errors?: Record<string, string[] | undefined>;
};

export function ClientFormFields({
  idPrefix,
  defaultValues,
  errors,
}: ClientFormFieldsProps) {
  const nameId = `${idPrefix}-name`;
  const birthDateId = `${idPrefix}-birth-date`;
  const addressId = `${idPrefix}-address`;
  const phoneId = `${idPrefix}-phone`;
  const benefitTypeId = `${idPrefix}-benefit-type`;
  const benefitStatusId = `${idPrefix}-benefit-status`;
  const cpfId = `${idPrefix}-cpf`;
  const govPasswordId = `${idPrefix}-gov-password`;
  const notesId = `${idPrefix}-notes`;

  const birthDateValue = defaultValues?.birthDate
    ? defaultValues.birthDate.toISOString().slice(0, 10)
    : "";

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor={nameId}>Nome</Label>
        <Input
          id={nameId}
          name="name"
          defaultValue={defaultValues?.name ?? ""}
          placeholder="Nome completo ou razao social"
          required
        />
        {errors?.name ? (
          <p className="text-sm text-destructive">{errors.name[0]}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={birthDateId}>Data de nascimento</Label>
          <Input
            id={birthDateId}
            name="birthDate"
            type="date"
            defaultValue={birthDateValue}
          />
          {errors?.birthDate ? (
            <p className="text-sm text-destructive">{errors.birthDate[0]}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={phoneId}>Telefone</Label>
          <Input
            id={phoneId}
            name="phone"
            defaultValue={defaultValues?.phone ?? ""}
            placeholder="(00) 00000-0000"
          />
          {errors?.phone ? (
            <p className="text-sm text-destructive">{errors.phone[0]}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={addressId}>Endereco</Label>
        <Input
          id={addressId}
          name="address"
          defaultValue={defaultValues?.address ?? ""}
          placeholder="Rua, numero, bairro, cidade"
        />
        {errors?.address ? (
          <p className="text-sm text-destructive">{errors.address[0]}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={benefitTypeId}>Tipo de beneficio</Label>
          <Input
            id={benefitTypeId}
            name="benefitType"
            defaultValue={defaultValues?.benefitType ?? ""}
            placeholder="Aposentadoria, auxilio, pensao..."
          />
          {errors?.benefitType ? (
            <p className="text-sm text-destructive">{errors.benefitType[0]}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={benefitStatusId}>Situacao do beneficio</Label>
          <Input
            id={benefitStatusId}
            name="benefitStatus"
            defaultValue={defaultValues?.benefitStatus ?? ""}
            placeholder="Em analise, concedido, indeferido..."
          />
          {errors?.benefitStatus ? (
            <p className="text-sm text-destructive">{errors.benefitStatus[0]}</p>
          ) : null}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={cpfId}>CPF</Label>
          <Input
            id={cpfId}
            name="cpf"
            defaultValue={defaultValues?.cpf ?? ""}
            placeholder="000.000.000-00"
          />
          {errors?.cpf ? (
            <p className="text-sm text-destructive">{errors.cpf[0]}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={govPasswordId}>Senha Gov.br</Label>
          <Input
            id={govPasswordId}
            name="govPassword"
            type="password"
            defaultValue={defaultValues?.govPassword ?? ""}
            placeholder="Senha de acesso Gov.br"
          />
          {errors?.govPassword ? (
            <p className="text-sm text-destructive">{errors.govPassword[0]}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={notesId}>Observacoes</Label>
        <Textarea
          id={notesId}
          name="notes"
          defaultValue={defaultValues?.notes ?? ""}
          placeholder="Anotacoes relevantes sobre o cliente"
        />
        {errors?.notes ? (
          <p className="text-sm text-destructive">{errors.notes[0]}</p>
        ) : null}
      </div>
      <input type="hidden" name="email" defaultValue={defaultValues?.email ?? ""} />
      <input
        type="hidden"
        name="document"
        defaultValue={defaultValues?.document ?? ""}
      />
    </div>
  );
}

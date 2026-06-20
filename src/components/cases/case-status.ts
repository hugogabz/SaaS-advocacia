import { CaseStatus } from "@prisma/client";

export const caseStatusOptions = [
  { value: CaseStatus.ACTIVE, label: "Ativo" },
  { value: CaseStatus.SUSPENDED, label: "Suspenso" },
  { value: CaseStatus.CLOSED, label: "Encerrado" },
] as const;

export function getCaseStatusLabel(status: CaseStatus) {
  return caseStatusOptions.find((option) => option.value === status)?.label ?? status;
}

export function getCaseStatusFromQuery(query: string) {
  const normalized = query.trim().toLowerCase();

  if (["active", "ativo", "ativa"].includes(normalized)) {
    return CaseStatus.ACTIVE;
  }

  if (["suspended", "suspenso", "suspensa"].includes(normalized)) {
    return CaseStatus.SUSPENDED;
  }

  if (["closed", "encerrado", "encerrada", "fechado", "fechada"].includes(normalized)) {
    return CaseStatus.CLOSED;
  }

  return null;
}

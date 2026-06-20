import type { CaseStatus } from "@prisma/client";
import { BriefcaseBusiness, Building2, FileText, Search, UserRound } from "lucide-react";
import { getCaseStatusLabel } from "@/components/cases/case-status";
import { DeleteCaseButton } from "@/components/cases/delete-case-button";
import { EditCaseForm } from "@/components/cases/edit-case-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LegalCase = {
  id: string;
  title: string;
  number: string | null;
  type: string | null;
  court: string | null;
  status: CaseStatus;
  clientId: string;
  description: string | null;
  client: {
    name: string;
  };
};

type CasesListProps = {
  cases: LegalCase[];
  clients: Array<{
    id: string;
    name: string;
  }>;
  query: string;
};

export function CasesList({ cases, clients, query }: CasesListProps) {
  if (cases.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
          <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-medium">
              {query ? "Nenhum processo encontrado" : "Nenhum processo cadastrado"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query
                ? "Tente buscar por outro titulo, numero, cliente ou status."
                : "Crie o primeiro processo vinculado a um cliente do escritorio."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {cases.map((legalCase) => (
        <Card key={legalCase.id}>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BriefcaseBusiness className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="truncate">{legalCase.title}</span>
              </CardTitle>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  {legalCase.client.name}
                </span>
                {legalCase.number ? (
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    {legalCase.number}
                  </span>
                ) : null}
                {legalCase.court ? (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" aria-hidden="true" />
                    {legalCase.court}
                  </span>
                ) : null}
                {legalCase.type ? <span>Tipo: {legalCase.type}</span> : null}
                <span>Status: {getCaseStatusLabel(legalCase.status)}</span>
              </div>
            </div>
            <DeleteCaseButton caseId={legalCase.id} />
          </CardHeader>
          <CardContent className="space-y-5">
            {legalCase.description ? (
              <p className="rounded-md border bg-secondary/40 p-3 text-sm leading-6 text-muted-foreground">
                {legalCase.description}
              </p>
            ) : null}
            <details className="group rounded-md border p-4">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors group-open:text-foreground">
                Editar processo
              </summary>
              <div className="mt-4">
                <EditCaseForm clients={clients} legalCase={legalCase} />
              </div>
            </details>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

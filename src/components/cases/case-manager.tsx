"use client";

import type { Case, Client } from "@prisma/client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { CasesList } from "@/components/cases/cases-list";
import { CreateCaseForm } from "@/components/cases/create-case-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CaseWithClient = Case & {
  client: {
    name: string;
  };
};

type CaseManagerProps = {
  cases: CaseWithClient[];
  clients: Pick<Client, "id" | "name">[];
  query: string;
};

export function CaseManager({ cases, clients, query }: CaseManagerProps) {
  const [editingCase, setEditingCase] = useState<Case | null>(null);

  function cancelEdit() {
    setEditingCase(null);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-5 w-5 text-primary" aria-hidden="true" />
            {editingCase ? "Editar processo" : "Adicionar processo"}
          </CardTitle>
          <CardDescription>
            {editingCase
              ? "Altere os dados no formulario abaixo e salve para voltar ao cadastro."
              : "Vincule o processo a um cliente ja cadastrado no escritorio."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCaseForm
            key={editingCase?.id ?? "create-case"}
            clients={clients}
            editingCase={editingCase}
            onCancelEdit={cancelEdit}
          />
        </CardContent>
      </Card>

      <CasesList cases={cases} query={query} onEdit={setEditingCase} />
    </>
  );
}

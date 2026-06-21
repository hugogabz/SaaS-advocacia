"use client";

import type { CaseStatus, Client, TaskStatus } from "@prisma/client";
import { Plus } from "lucide-react";
import { ClientsList } from "@/components/clients/clients-list";
import { CreateClientForm } from "@/components/clients/create-client-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

type ClientManagerProps = {
  clients: Array<
    Client & {
      cases: Array<{
        id: string;
        title: string;
        status: CaseStatus;
      }>;
      tasks: Array<{
        id: string;
        title: string;
        status: TaskStatus;
        dueAt: Date | null;
      }>;
    }
  >;
  query: string;
};

export function ClientManager({ clients, query }: ClientManagerProps) {
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  function cancelEdit() {
    setEditingClient(null);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-5 w-5 text-primary" aria-hidden="true" />
            {editingClient ? "Editar cliente" : "Adicionar cliente"}
          </CardTitle>
          <CardDescription>
            {editingClient
              ? "Altere os dados no formulario abaixo e salve para voltar ao cadastro."
              : "Os dados ficam vinculados somente ao escritorio logado."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateClientForm
            editingClient={editingClient}
            onCancelEdit={cancelEdit}
          />
        </CardContent>
      </Card>

      <ClientsList clients={clients} query={query} onEdit={setEditingClient} />
    </>
  );
}

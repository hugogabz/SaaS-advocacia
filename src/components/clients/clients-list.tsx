"use client";

import type { Client } from "@prisma/client";
import { Calendar, Edit, KeyRound, MapPin, Phone, Search, UserRound } from "lucide-react";
import { DeleteClientButton } from "@/components/clients/delete-client-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ClientsListProps = {
  clients: Client[];
  query: string;
  onEdit: (client: Client) => void;
};

function formatDate(date: Date | null) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function ClientsList({ clients, query, onEdit }: ClientsListProps) {
  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
          <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-medium">
              {query ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query
                ? "Tente buscar por outro nome, telefone, CPF ou beneficio."
                : "Crie o primeiro cliente para iniciar a carteira do escritorio."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {clients.map((client) => {
        const birthDate = formatDate(client.birthDate);

        return (
        <Card key={client.id}>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserRound className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="truncate">{client.name}</span>
              </CardTitle>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {client.phone ? (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {client.phone}
                  </span>
                ) : null}
                {birthDate ? (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    {birthDate}
                  </span>
                ) : null}
                {client.cpf ? <span>CPF: {client.cpf}</span> : null}
                {client.benefitType ? (
                  <span>Beneficio: {client.benefitType}</span>
                ) : null}
                {client.benefitStatus ? (
                  <span>Situacao: {client.benefitStatus}</span>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => onEdit(client)}>
                <Edit className="h-4 w-4" aria-hidden="true" />
                Editar
              </Button>
              <DeleteClientButton clientId={client.id} />
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              {client.address ? (
                <span className="flex items-start gap-1.5">
                  <MapPin className="mt-0.5 h-4 w-4" aria-hidden="true" />
                  {client.address}
                </span>
              ) : null}
              {client.govPassword ? (
                <span className="flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4" aria-hidden="true" />
                  Senha Gov.br cadastrada
                </span>
              ) : null}
            </div>
            {client.notes ? (
              <p className="rounded-md border bg-secondary/40 p-3 text-sm leading-6 text-muted-foreground">
                {client.notes}
              </p>
            ) : null}
          </CardContent>
        </Card>
        );
      })}
    </div>
  );
}

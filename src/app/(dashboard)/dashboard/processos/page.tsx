import { redirect } from "next/navigation";
import { BriefcaseBusiness, Plus, Search } from "lucide-react";
import { auth } from "@/auth";
import { getCaseStatusFromQuery } from "@/components/cases/case-status";
import { CasesList } from "@/components/cases/cases-list";
import { CreateCaseForm } from "@/components/cases/create-case-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPrisma } from "@/lib/prisma";
import { caseSearchSchema } from "@/lib/validations/case";

type CasesPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function CasesPage({ searchParams }: CasesPageProps) {
  const session = await auth();

  if (!session?.user?.officeId) {
    redirect("/login");
  }

  const { q } = caseSearchSchema.parse(await searchParams);
  const query = q.trim();
  const statusQuery = getCaseStatusFromQuery(query);

  const [clients, cases] = await Promise.all([
    getPrisma().client.findMany({
      where: {
        officeId: session.user.officeId,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
    getPrisma().case.findMany({
      where: {
        officeId: session.user.officeId,
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { number: { contains: query, mode: "insensitive" } },
                { type: { contains: query, mode: "insensitive" } },
                { client: { name: { contains: query, mode: "insensitive" } } },
                ...(statusQuery ? [{ status: statusQuery }] : []),
              ],
            }
          : {}),
      },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-2xl font-semibold tracking-normal">Processos</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Acompanhe processos, clientes vinculados, numeros, varas e status.
          </p>
        </div>
        <form className="flex w-full gap-2 sm:max-w-md">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Buscar processo"
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="outline">
            Buscar
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-5 w-5 text-primary" aria-hidden="true" />
            Novo processo
          </CardTitle>
          <CardDescription>
            Vincule o processo a um cliente ja cadastrado no escritorio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCaseForm clients={clients} />
        </CardContent>
      </Card>

      <CasesList cases={cases} clients={clients} query={query} />
    </div>
  );
}

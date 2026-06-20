import { redirect } from "next/navigation";
import { Search, Users } from "lucide-react";
import { auth } from "@/auth";
import { ClientManager } from "@/components/clients/client-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPrisma } from "@/lib/prisma";
import { clientSearchSchema } from "@/lib/validations/client";

type ClientsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const session = await auth();

  if (!session?.user?.officeId) {
    redirect("/login");
  }

  const { q } = clientSearchSchema.parse(await searchParams);
  const query = q.trim();

  const clients = await getPrisma().client.findMany({
    where: {
      officeId: session.user.officeId,
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { phone: { contains: query, mode: "insensitive" } },
              { document: { contains: query, mode: "insensitive" } },
              { cpf: { contains: query, mode: "insensitive" } },
              { benefitType: { contains: query, mode: "insensitive" } },
              { benefitStatus: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-2xl font-semibold tracking-normal">Clientes</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Cadastre, consulte e mantenha a carteira de clientes do escritorio.
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
              placeholder="Buscar cliente"
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="outline">
            Buscar
          </Button>
        </form>
      </div>

      <ClientManager clients={clients} query={query} />
    </div>
  );
}

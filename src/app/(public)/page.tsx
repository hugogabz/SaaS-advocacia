import Link from "next/link";
import { ArrowRight, CalendarClock, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/site/header";

const features = [
  {
    title: "Clientes centralizados",
    description: "Organize dados, historico e relacionamento de cada cliente.",
    icon: Users,
  },
  {
    title: "Processos e prazos",
    description: "Acompanhe casos, status e proximos vencimentos em um so lugar.",
    icon: CalendarClock,
  },
  {
    title: "Documentos preparados",
    description: "Base pronta para conectar storage e gerir arquivos juridicos.",
    icon: FileText,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
                SaaS juridico multi-tenant
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
                JurisFlow
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Uma base moderna para escritorios controlarem clientes, processos,
                tarefas, prazos e documentos com seguranca e organizacao.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/cadastro-escritorio">
                  Comecar agora
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Acessar dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <feature.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

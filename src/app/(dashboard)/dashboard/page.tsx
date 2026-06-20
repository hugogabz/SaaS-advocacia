import { CalendarClock, FileText, Scale, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Clientes", value: "0", icon: Users },
  { label: "Processos ativos", value: "0", icon: Scale },
  { label: "Tarefas pendentes", value: "0", icon: CalendarClock },
  { label: "Documentos", value: "0", icon: FileText },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">Dashboard</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A base esta pronta para receber os primeiros modulos do produto.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Proximos passos</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          Implementar CRUDs de clientes e processos, calendario de prazos,
          upload de documentos e convites de usuarios do escritorio.
        </CardContent>
      </Card>
    </div>
  );
}

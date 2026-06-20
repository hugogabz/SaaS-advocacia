import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarClock,
  FileText,
  LayoutDashboard,
  Scale,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Visao geral", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clientes", href: "/dashboard/clientes", icon: Users },
  { name: "Processos", href: "/dashboard/processos", icon: BriefcaseBusiness },
  { name: "Tarefas", href: "/dashboard/tarefas", icon: CalendarClock },
  { name: "Documentos", href: "/dashboard/documentos", icon: FileText },
];

export function DashboardSidebar() {
  return (
    <aside className="hidden w-72 border-r bg-card/70 lg:block">
      <div className="flex h-16 items-center gap-2 border-b px-6 font-semibold">
        <Scale className="h-5 w-5 text-primary" aria-hidden="true" />
        JurisFlow
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              index === 0 && "bg-accent text-accent-foreground",
            )}
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

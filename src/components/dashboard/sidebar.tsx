"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  {
    name: "Central",
    description: "Prazos e prioridades",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Tarefas",
    description: "Prazos e atividades",
    href: "/dashboard/tarefas",
    icon: CalendarClock,
  },
  {
    name: "Clientes",
    description: "Carteira do escritorio",
    href: "/dashboard/clientes",
    icon: Users,
  },
  {
    name: "Processos",
    description: "Casos em andamento",
    href: "/dashboard/processos",
    icon: BriefcaseBusiness,
  },
  {
    name: "Documentos",
    description: "Arquivos e pecas",
    href: "/dashboard/documentos",
    icon: FileText,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 border-r bg-card/70 lg:block">
      <div className="flex h-16 items-center gap-2 border-b px-6 font-semibold">
        <Scale className="h-5 w-5 text-primary" aria-hidden="true" />
        JurisFlow
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-start gap-3 rounded-md px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground",
              )}
            >
              <item.icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="block font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

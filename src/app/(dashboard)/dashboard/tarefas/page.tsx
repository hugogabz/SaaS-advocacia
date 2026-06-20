import { CalendarClock } from "lucide-react";
import { EmptyModule } from "@/components/dashboard/empty-module";

export default function TasksPage() {
  return (
    <EmptyModule
      icon={CalendarClock}
      title="Tarefas"
      description="Modulo reservado para tarefas, responsaveis, prioridades e prazos."
    />
  );
}

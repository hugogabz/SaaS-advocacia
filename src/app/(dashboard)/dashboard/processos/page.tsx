import { BriefcaseBusiness } from "lucide-react";
import { EmptyModule } from "@/components/dashboard/empty-module";

export default function CasesPage() {
  return (
    <EmptyModule
      icon={BriefcaseBusiness}
      title="Processos"
      description="Modulo reservado para processos, status, varas, numeros e vinculo com clientes."
    />
  );
}

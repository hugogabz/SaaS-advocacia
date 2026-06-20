import { Users } from "lucide-react";
import { EmptyModule } from "@/components/dashboard/empty-module";

export default function ClientsPage() {
  return (
    <EmptyModule
      icon={Users}
      title="Clientes"
      description="Modulo reservado para cadastro, busca e historico dos clientes."
    />
  );
}

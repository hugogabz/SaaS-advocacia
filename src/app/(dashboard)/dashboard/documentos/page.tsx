import { FileText } from "lucide-react";
import { EmptyModule } from "@/components/dashboard/empty-module";

export default function DocumentsPage() {
  return (
    <EmptyModule
      icon={FileText}
      title="Documentos"
      description="Modulo reservado para upload, armazenamento e vinculo de documentos aos processos."
    />
  );
}

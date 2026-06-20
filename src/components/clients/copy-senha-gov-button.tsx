"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type CopySenhaGovButtonProps = {
  senhaGov: string;
};

export function CopySenhaGovButton({ senhaGov }: CopySenhaGovButtonProps) {
  async function copySenhaGov() {
    await navigator.clipboard.writeText(senhaGov);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={copySenhaGov}>
      <Copy className="h-4 w-4" aria-hidden="true" />
      Copiar senha
    </Button>
  );
}

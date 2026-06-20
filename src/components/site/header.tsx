import Link from "next/link";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Scale className="h-5 w-5 text-primary" aria-hidden="true" />
          JurisFlow
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/cadastro-escritorio">Criar escritorio</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

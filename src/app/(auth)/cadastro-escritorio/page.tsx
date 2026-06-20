import Link from "next/link";
import { RegisterOfficeForm } from "@/components/auth/register-office-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterOfficePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar escritorio</CardTitle>
          <CardDescription>
            Cadastre o tenant inicial e o usuario proprietario.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RegisterOfficeForm />
          <p className="text-center text-sm text-muted-foreground">
            Ja possui uma conta?{" "}
            <Link className="font-medium text-primary" href="/login">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

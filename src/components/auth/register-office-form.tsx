"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerOfficeAction } from "@/server/actions/register-office";
import {
  registerOfficeSchema,
  type RegisterOfficeInput,
} from "@/lib/validations/auth";

export function RegisterOfficeForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterOfficeInput>({
    resolver: zodResolver(registerOfficeSchema),
    defaultValues: {
      officeName: "",
      ownerName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterOfficeInput) {
    setFormError(null);
    const result = await registerOfficeAction(values);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    router.push("/login");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="officeName">Nome do escritorio</Label>
        <Input id="officeName" {...register("officeName")} />
        {errors.officeName ? (
          <p className="text-sm text-destructive">{errors.officeName.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="ownerName">Seu nome</Label>
        <Input id="ownerName" autoComplete="name" {...register("ownerName")} />
        {errors.ownerName ? (
          <p className="text-sm text-destructive">{errors.ownerName.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>
      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Criando..." : "Criar escritorio"}
      </Button>
    </form>
  );
}

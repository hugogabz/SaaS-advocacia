import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export const registerOfficeSchema = z.object({
  officeName: z.string().min(2, "Informe o nome do escritorio."),
  ownerName: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type RegisterOfficeInput = z.infer<typeof registerOfficeSchema>;

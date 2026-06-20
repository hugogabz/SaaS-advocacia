import { CaseStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable();

export const caseSchema = z.object({
  title: z.string().trim().min(2, "Informe o titulo do processo."),
  caseNumber: optionalText,
  type: optionalText,
  court: optionalText,
  status: z.nativeEnum(CaseStatus, {
    message: "Selecione um status valido.",
  }),
  clientId: z.string().min(1, "Selecione um cliente."),
  description: optionalText,
});

export const caseSearchSchema = z.object({
  q: z.string().trim().optional().default(""),
});

export type CaseInput = z.infer<typeof caseSchema>;

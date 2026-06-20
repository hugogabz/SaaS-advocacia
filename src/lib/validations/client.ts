import { z } from "zod";

const optionalText = z
  .preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().transform((value) => (value.length > 0 ? value : null)),
  )
  .nullable();

const optionalDate = z
  .preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().transform((value) => {
      if (!value) {
        return null;
      }

      const date = new Date(`${value}T12:00:00`);
      return Number.isNaN(date.getTime()) ? null : date;
    }),
  )
  .nullable();

export const clientSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do cliente."),
  birthDate: optionalDate,
  address: optionalText,
  phone: optionalText,
  benefitType: optionalText,
  benefitStatus: optionalText,
  notes: optionalText,
  senhaGov: optionalText,
  document: optionalText,
});

export const clientSearchSchema = z.object({
  q: z.string().trim().optional().default(""),
});

export type ClientInput = z.infer<typeof clientSchema>;

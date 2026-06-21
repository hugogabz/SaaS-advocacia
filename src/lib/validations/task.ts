import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z
  .preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().transform((value) => (value.length > 0 ? value : null)),
  )
  .nullable();

const optionalId = z
  .preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().transform((value) => (value.length > 0 ? value : null)),
  )
  .nullable();

const optionalDueDate = z
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

export const taskSchema = z.object({
  title: z.string().trim().min(2, "Informe o titulo da tarefa."),
  type: optionalText,
  description: optionalText,
  status: z.nativeEnum(TaskStatus, {
    message: "Selecione um status valido.",
  }),
  priority: z.nativeEnum(TaskPriority, {
    message: "Selecione uma prioridade valida.",
  }),
  dueDate: optionalDueDate,
  clientId: optionalId,
  caseId: optionalId,
  assignedToId: optionalId,
});

export type TaskInput = z.infer<typeof taskSchema>;

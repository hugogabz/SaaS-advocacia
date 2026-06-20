import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable();

const optionalId = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable();

const optionalDueDate = z
  .string()
  .trim()
  .transform((value) => {
    if (!value) {
      return null;
    }

    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  })
  .nullable();

export const taskSchema = z.object({
  title: z.string().trim().min(2, "Informe o titulo da tarefa."),
  description: optionalText,
  status: z.nativeEnum(TaskStatus, {
    message: "Selecione um status valido.",
  }),
  priority: z.nativeEnum(TaskPriority, {
    message: "Selecione uma prioridade valida.",
  }),
  dueDate: optionalDueDate,
  caseId: z.string().min(1, "Selecione um processo."),
  assignedToId: optionalId,
});

export type TaskInput = z.infer<typeof taskSchema>;

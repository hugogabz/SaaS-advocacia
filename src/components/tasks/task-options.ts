import { TaskPriority, TaskStatus } from "@prisma/client";

export const taskStatusOptions = [
  { value: TaskStatus.TODO, label: "Pendente" },
  { value: TaskStatus.IN_PROGRESS, label: "Em andamento" },
  { value: TaskStatus.DONE, label: "Concluida" },
  { value: TaskStatus.CANCELED, label: "Cancelada" },
] as const;

export const taskPriorityOptions = [
  { value: TaskPriority.LOW, label: "Baixa" },
  { value: TaskPriority.MEDIUM, label: "Media" },
  { value: TaskPriority.HIGH, label: "Alta" },
  { value: TaskPriority.URGENT, label: "Urgente" },
] as const;

export function getTaskStatusLabel(status: TaskStatus) {
  return taskStatusOptions.find((option) => option.value === status)?.label ?? status;
}

export function getTaskPriorityLabel(priority: TaskPriority) {
  return (
    taskPriorityOptions.find((option) => option.value === priority)?.label ?? priority
  );
}

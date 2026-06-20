"use server";

import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validations/task";

export type TaskActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

const defaultError = {
  ok: false,
  message: "Nao foi possivel salvar a tarefa.",
} satisfies TaskActionState;

async function getCurrentUserContext() {
  const session = await auth();

  if (!session?.user?.officeId || !session.user.id) {
    throw new Error("Unauthorized");
  }

  return {
    officeId: session.user.officeId,
    userId: session.user.id,
  };
}

function parseTaskForm(formData: FormData) {
  return taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    caseId: formData.get("caseId"),
    assignedToId: formData.get("assignedToId"),
  });
}

async function caseBelongsToOffice(caseId: string, officeId: string) {
  const legalCase = await getPrisma().case.findFirst({
    where: {
      id: caseId,
      officeId,
    },
    select: {
      id: true,
    },
  });

  return Boolean(legalCase);
}

async function userBelongsToOffice(userId: string | null, officeId: string) {
  if (!userId) {
    return true;
  }

  const user = await getPrisma().user.findFirst({
    where: {
      id: userId,
      officeId,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
}

export async function createTaskAction(
  _prevState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const { officeId, userId } = await getCurrentUserContext();
  const parsed = parseTaskForm(formData);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revise os campos da tarefa.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!(await caseBelongsToOffice(parsed.data.caseId, officeId))) {
    return {
      ok: false,
      message: "Processo nao encontrado para este escritorio.",
    };
  }

  if (!(await userBelongsToOffice(parsed.data.assignedToId, officeId))) {
    return {
      ok: false,
      message: "Responsavel nao encontrado para este escritorio.",
    };
  }

  try {
    await getPrisma().task.create({
      data: {
        officeId,
        caseId: parsed.data.caseId,
        title: parsed.data.title,
        description: parsed.data.description,
        status: parsed.data.status,
        priority: parsed.data.priority,
        dueAt: parsed.data.dueDate,
        assigneeId: parsed.data.assignedToId,
        createdById: userId,
      },
    });

    revalidatePath("/dashboard/tarefas");

    return {
      ok: true,
      message: "Tarefa criada com sucesso.",
    };
  } catch {
    return defaultError;
  }
}

export async function updateTaskAction(
  taskId: string,
  _prevState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const { officeId } = await getCurrentUserContext();
  const parsed = parseTaskForm(formData);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revise os campos da tarefa.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!(await caseBelongsToOffice(parsed.data.caseId, officeId))) {
    return {
      ok: false,
      message: "Processo nao encontrado para este escritorio.",
    };
  }

  if (!(await userBelongsToOffice(parsed.data.assignedToId, officeId))) {
    return {
      ok: false,
      message: "Responsavel nao encontrado para este escritorio.",
    };
  }

  try {
    const result = await getPrisma().task.updateMany({
      where: {
        id: taskId,
        officeId,
      },
      data: {
        caseId: parsed.data.caseId,
        title: parsed.data.title,
        description: parsed.data.description,
        status: parsed.data.status,
        priority: parsed.data.priority,
        dueAt: parsed.data.dueDate,
        assigneeId: parsed.data.assignedToId,
      },
    });

    if (result.count === 0) {
      return {
        ok: false,
        message: "Tarefa nao encontrada para este escritorio.",
      };
    }

    revalidatePath("/dashboard/tarefas");

    return {
      ok: true,
      message: "Tarefa atualizada com sucesso.",
    };
  } catch {
    return defaultError;
  }
}

export async function completeTaskAction(taskId: string) {
  const { officeId } = await getCurrentUserContext();

  await getPrisma().task.updateMany({
    where: {
      id: taskId,
      officeId,
    },
    data: {
      status: TaskStatus.DONE,
    },
  });

  revalidatePath("/dashboard/tarefas");
}

export async function deleteTaskAction(taskId: string) {
  const { officeId } = await getCurrentUserContext();

  await getPrisma().task.deleteMany({
    where: {
      id: taskId,
      officeId,
    },
  });

  revalidatePath("/dashboard/tarefas");
}

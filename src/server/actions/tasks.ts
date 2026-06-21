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

function taskActionError(action: string, error: unknown): TaskActionState {
  console.error(`[tasks:${action}]`, error);

  return {
    ok: false,
    message:
      error instanceof Error
        ? `Nao foi possivel salvar a tarefa: ${error.message}`
        : "Nao foi possivel salvar a tarefa. Veja o console do servidor.",
  };
}

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
    type: formData.get("type"),
    description: formData.get("description"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    clientId: formData.get("clientId"),
    caseId: formData.get("caseId"),
    assignedToId: formData.get("assignedToId"),
  });
}

function toTaskData(data: ReturnType<typeof taskSchema.parse>) {
  return {
    clientId: data.clientId,
    caseId: data.caseId,
    title: data.title,
    type: data.type,
    description: data.description,
    status: data.status,
    priority: data.priority,
    dueAt: data.dueDate,
    assigneeId: data.assignedToId,
  };
}

async function clientBelongsToOffice(clientId: string | null, officeId: string) {
  if (!clientId) {
    return true;
  }

  const client = await getPrisma().client.findFirst({
    where: {
      id: clientId,
      officeId,
    },
    select: {
      id: true,
    },
  });

  return Boolean(client);
}

async function caseBelongsToOffice(caseId: string | null, officeId: string) {
  if (!caseId) {
    return true;
  }

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

async function caseBelongsToClient(
  caseId: string | null,
  clientId: string | null,
  officeId: string,
) {
  if (!caseId || !clientId) {
    return true;
  }

  const legalCase = await getPrisma().case.findFirst({
    where: {
      id: caseId,
      clientId,
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

  if (!(await clientBelongsToOffice(parsed.data.clientId, officeId))) {
    return {
      ok: false,
      message: "Cliente nao encontrado para este escritorio.",
    };
  }

  if (!(await caseBelongsToOffice(parsed.data.caseId, officeId))) {
    return {
      ok: false,
      message: "Processo nao encontrado para este escritorio.",
    };
  }

  if (!(await caseBelongsToClient(parsed.data.caseId, parsed.data.clientId, officeId))) {
    return {
      ok: false,
      message: "O processo selecionado nao pertence ao cliente informado.",
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
        ...toTaskData(parsed.data),
        createdById: userId,
      },
    });

    revalidatePath("/dashboard/tarefas");
    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Tarefa criada com sucesso.",
    };
  } catch (error) {
    return taskActionError("create", error);
  }
}

export async function saveTaskAction(
  _prevState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const taskId = formData.get("taskId")?.toString();

  if (taskId) {
    return updateTaskAction(taskId, _prevState, formData);
  }

  return createTaskAction(_prevState, formData);
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

  if (!(await clientBelongsToOffice(parsed.data.clientId, officeId))) {
    return {
      ok: false,
      message: "Cliente nao encontrado para este escritorio.",
    };
  }

  if (!(await caseBelongsToOffice(parsed.data.caseId, officeId))) {
    return {
      ok: false,
      message: "Processo nao encontrado para este escritorio.",
    };
  }

  if (!(await caseBelongsToClient(parsed.data.caseId, parsed.data.clientId, officeId))) {
    return {
      ok: false,
      message: "O processo selecionado nao pertence ao cliente informado.",
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
      data: toTaskData(parsed.data),
    });

    if (result.count === 0) {
      return {
        ok: false,
        message: "Tarefa nao encontrada para este escritorio.",
      };
    }

    revalidatePath("/dashboard/tarefas");
    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Tarefa atualizada com sucesso.",
    };
  } catch (error) {
    return taskActionError("update", error);
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
  revalidatePath("/dashboard");
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
  revalidatePath("/dashboard");
}

"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { caseSchema } from "@/lib/validations/case";

export type CaseActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

const defaultError = {
  ok: false,
  message: "Nao foi possivel salvar o processo.",
} satisfies CaseActionState;

async function getCurrentOfficeId() {
  const session = await auth();

  if (!session?.user?.officeId) {
    throw new Error("Unauthorized");
  }

  return session.user.officeId;
}

function parseCaseForm(formData: FormData) {
  return caseSchema.safeParse({
    title: formData.get("title"),
    caseNumber: formData.get("caseNumber"),
    type: formData.get("type"),
    court: formData.get("court"),
    status: formData.get("status"),
    clientId: formData.get("clientId"),
    description: formData.get("description"),
  });
}

async function clientBelongsToOffice(clientId: string, officeId: string) {
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

export async function createCaseAction(
  _prevState: CaseActionState,
  formData: FormData,
): Promise<CaseActionState> {
  const officeId = await getCurrentOfficeId();
  const parsed = parseCaseForm(formData);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revise os campos do processo.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!(await clientBelongsToOffice(parsed.data.clientId, officeId))) {
    return {
      ok: false,
      message: "Cliente nao encontrado para este escritorio.",
    };
  }

  try {
    await getPrisma().case.create({
      data: {
        officeId,
        clientId: parsed.data.clientId,
        title: parsed.data.title,
        number: parsed.data.caseNumber,
        type: parsed.data.type,
        court: parsed.data.court,
        status: parsed.data.status,
        description: parsed.data.description,
      },
    });

    revalidatePath("/dashboard/processos");

    return {
      ok: true,
      message: "Processo criado com sucesso.",
    };
  } catch {
    return defaultError;
  }
}

export async function updateCaseAction(
  caseId: string,
  _prevState: CaseActionState,
  formData: FormData,
): Promise<CaseActionState> {
  const officeId = await getCurrentOfficeId();
  const parsed = parseCaseForm(formData);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revise os campos do processo.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!(await clientBelongsToOffice(parsed.data.clientId, officeId))) {
    return {
      ok: false,
      message: "Cliente nao encontrado para este escritorio.",
    };
  }

  try {
    const result = await getPrisma().case.updateMany({
      where: {
        id: caseId,
        officeId,
      },
      data: {
        clientId: parsed.data.clientId,
        title: parsed.data.title,
        number: parsed.data.caseNumber,
        type: parsed.data.type,
        court: parsed.data.court,
        status: parsed.data.status,
        description: parsed.data.description,
      },
    });

    if (result.count === 0) {
      return {
        ok: false,
        message: "Processo nao encontrado para este escritorio.",
      };
    }

    revalidatePath("/dashboard/processos");

    return {
      ok: true,
      message: "Processo atualizado com sucesso.",
    };
  } catch {
    return defaultError;
  }
}

export async function deleteCaseAction(caseId: string) {
  const officeId = await getCurrentOfficeId();

  await getPrisma().case.deleteMany({
    where: {
      id: caseId,
      officeId,
    },
  });

  revalidatePath("/dashboard/processos");
}

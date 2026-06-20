"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { clientSchema } from "@/lib/validations/client";

export type ClientActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

const defaultError = {
  ok: false,
  message: "Nao foi possivel salvar o cliente.",
} satisfies ClientActionState;

async function getCurrentOfficeId() {
  const session = await auth();

  if (!session?.user?.officeId) {
    throw new Error("Unauthorized");
  }

  return session.user.officeId;
}

function parseClientForm(formData: FormData) {
  return clientSchema.safeParse({
    name: formData.get("name"),
    birthDate: formData.get("birthDate"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    benefitType: formData.get("benefitType"),
    benefitStatus: formData.get("benefitStatus"),
    notes: formData.get("notes"),
    cpf: formData.get("cpf"),
    govPassword: formData.get("govPassword"),
    email: formData.get("email"),
    document: formData.get("document"),
  });
}

export async function createClientAction(
  _prevState: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const officeId = await getCurrentOfficeId();
  const parsed = parseClientForm(formData);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revise os campos do cliente.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await getPrisma().client.create({
      data: {
        officeId,
        ...parsed.data,
      },
    });

    revalidatePath("/dashboard/clientes");

    return {
      ok: true,
      message: "Cliente criado com sucesso.",
    };
  } catch {
    return defaultError;
  }
}

export async function saveClientAction(
  _prevState: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const clientId = formData.get("clientId")?.toString();

  if (clientId) {
    return updateClientAction(clientId, _prevState, formData);
  }

  return createClientAction(_prevState, formData);
}

export async function updateClientAction(
  clientId: string,
  _prevState: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const officeId = await getCurrentOfficeId();
  const parsed = parseClientForm(formData);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revise os campos do cliente.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await getPrisma().client.updateMany({
      where: {
        id: clientId,
        officeId,
      },
      data: parsed.data,
    });

    if (result.count === 0) {
      return {
        ok: false,
        message: "Cliente nao encontrado para este escritorio.",
      };
    }

    revalidatePath("/dashboard/clientes");

    return {
      ok: true,
      message: "Cliente atualizado com sucesso.",
    };
  } catch {
    return defaultError;
  }
}

export async function deleteClientAction(clientId: string) {
  const officeId = await getCurrentOfficeId();

  await getPrisma().client.deleteMany({
    where: {
      id: clientId,
      officeId,
    },
  });

  revalidatePath("/dashboard/clientes");
}

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

function clientActionError(action: string, error: unknown): ClientActionState {
  console.error(`[clients:${action}]`, error);

  return {
    ok: false,
    message:
      error instanceof Error
        ? `Nao foi possivel salvar o cliente: ${error.message}`
        : "Nao foi possivel salvar o cliente. Veja o console do servidor.",
  };
}

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
    senhaGov: formData.get("senhaGov"),
    document: formData.get("document"),
  });
}

function toClientData(data: ReturnType<typeof clientSchema.parse>) {
  return {
    name: data.name,
    birthDate: data.birthDate,
    address: data.address,
    phone: data.phone,
    benefitType: data.benefitType,
    benefitStatus: data.benefitStatus,
    notes: data.notes,
    document: data.document,
    senhaGov: data.senhaGov,
  };
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
        ...toClientData(parsed.data),
      },
    });

    revalidatePath("/dashboard/clientes");

    return {
      ok: true,
      message: "Cliente criado com sucesso.",
    };
  } catch (error) {
    return clientActionError("create", error);
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
      data: toClientData(parsed.data),
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
  } catch (error) {
    return clientActionError("update", error);
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

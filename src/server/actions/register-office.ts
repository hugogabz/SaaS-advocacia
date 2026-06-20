"use server";

import { Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createSlug } from "@/lib/slug";
import {
  registerOfficeSchema,
  type RegisterOfficeInput,
} from "@/lib/validations/auth";

export async function registerOfficeAction(input: RegisterOfficeInput) {
  const parsed = registerOfficeSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revise os dados informados.",
    };
  }

  const prisma = getPrisma();
  const email = parsed.data.email.toLowerCase();
  const baseSlug = createSlug(parsed.data.officeName);
  const passwordHash = await hashPassword(parsed.data.password);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        ok: false,
        message: "Ja existe uma conta com este e-mail.",
      };
    }

    const officeCount = await prisma.office.count({
      where: { slug: { startsWith: baseSlug } },
    });

    const slug = officeCount > 0 ? `${baseSlug}-${officeCount + 1}` : baseSlug;

    await prisma.office.create({
      data: {
        name: parsed.data.officeName,
        slug,
        users: {
          create: {
            name: parsed.data.ownerName,
            email,
            passwordHash,
            role: "OWNER",
          },
        },
      },
    });

    return {
      ok: true,
      message: "Escritorio criado com sucesso.",
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        message: "Nao foi possivel criar o escritorio com esses dados.",
      };
    }

    throw error;
  }
}

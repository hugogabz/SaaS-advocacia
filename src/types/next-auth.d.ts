import type { UserRole } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      officeId: string;
      officeName: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role: UserRole;
    officeId: string;
    officeName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    officeId: string;
    officeName: string;
  }
}

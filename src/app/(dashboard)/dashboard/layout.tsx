import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4 lg:px-8">
          <div>
            <p className="text-sm text-muted-foreground">Escritorio</p>
            <h1 className="font-semibold">{session.user.officeName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-muted-foreground sm:block">
              {session.user.email}
            </p>
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

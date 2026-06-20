import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EmptyModuleProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function EmptyModule({ title, description, icon: Icon }: EmptyModuleProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  );
}

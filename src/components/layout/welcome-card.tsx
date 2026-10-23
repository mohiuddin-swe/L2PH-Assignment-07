"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLE_LABEL } from "@/lib/constants";
import { firstName } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";

export function WelcomeCard({ children }: { children?: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Welcome, {firstName(user.name)}</CardTitle>
        <CardDescription>
          Signed in as {ROLE_LABEL[user.role]} ({user.email}).
        </CardDescription>
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
    </Card>
  );
}
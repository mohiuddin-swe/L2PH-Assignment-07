import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/status-badge";
import { ROLE_LABEL } from "@/lib/constants";
import { formatDate, initials } from "@/lib/format";
import type { Profile } from "@/types/api";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium break-words">{value || <span className="text-muted-foreground">Not provided</span>}</dd>
    </div>
  );
}

export function ProfileView({ user }: { user: Profile }) {
  const department = user.studentProfile?.department ?? user.teacherProfile?.department;

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-4">
        <Avatar size="lg" className="size-16 text-lg">
          <AvatarFallback className="bg-primary text-lg text-primary-foreground">{initials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-xl">{user.name}</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2">
            {ROLE_LABEL[user.role]}
            <StatusBadge status={user.status} />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-5 border-t pt-5 sm:grid-cols-2">
          <Field label="Email" value={user.email} />
          <Field label="Phone" value={user.phone} />
          {user.studentProfile ? <Field label="Student ID" value={user.studentProfile.studentId} /> : null}
          {user.teacherProfile ? <Field label="Designation" value={user.teacherProfile.designation} /> : null}
          {user.role !== "ADMIN" ? <Field label="Department" value={department ? `${department.name} (${department.code})` : null} /> : null}
          <Field label="Sign-in method" value={user.authProvider === "GOOGLE" ? "Google" : "Email and password"} />
          <Field label="Member since" value={formatDate(user.createdAt)} />
        </dl>
      </CardContent>
    </Card>
  );
}
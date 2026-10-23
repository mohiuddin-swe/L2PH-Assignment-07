import { Megaphone } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { Notice } from "@/types/api";

export function NoticeList({ notices }: { notices: Notice[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest notices</CardTitle>
        <CardDescription>Announcements from your teachers and the university.</CardDescription>
      </CardHeader>
      <CardContent>
        {notices.length === 0 ? (
          <EmptyState icon={Megaphone} title="No notices yet" className="py-8" />
        ) : (
          <ul className="divide-y">
            {notices.map((notice) => (
              <li key={notice.id} className="space-y-1 py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-medium">{notice.title}</p>
                <p className="line-clamp-2 text-sm text-muted-foreground">{notice.content}</p>
                <p className="text-xs text-muted-foreground">
                  {notice.author.name} · {formatDate(notice.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
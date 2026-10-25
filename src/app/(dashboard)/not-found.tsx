import { SearchX } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardNotFound() {
  return (
    <Card>
      <EmptyState
        icon={SearchX}
        title="We could not find that"
        description="It may have been removed, or you may not have access to it."
        action={
          <Link href="/login" className={buttonVariants({ variant: "outline" })}>
            Back to my dashboard
          </Link>
        }
      />
    </Card>
  );
}

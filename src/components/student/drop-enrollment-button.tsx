"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useDropEnrollment } from "@/hooks/use-enrollment-actions";

interface DropEnrollmentButtonProps {
  enrollmentId: string;
  courseLabel: string;
}

export function DropEnrollmentButton({ enrollmentId, courseLabel }: DropEnrollmentButtonProps) {
  const [open, setOpen] = useState(false);
  const drop = useDropEnrollment();

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <LogOut aria-hidden />
        Drop
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Drop ${courseLabel}?`}
        description="You will lose your seat and the course will no longer count towards your credits. You can enroll again later if a seat is free."
        confirmLabel="Drop course"
        pending={drop.isPending}
        onConfirm={() => drop.mutate(enrollmentId, { onSuccess: () => setOpen(false) })}
      />
    </>
  );
}
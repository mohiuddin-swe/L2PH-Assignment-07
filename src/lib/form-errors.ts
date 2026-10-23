import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-error";

// Shows backend validation errors next to the matching form fields. Anything that cannot be
// matched to a field (wrong password, server down, ...) is shown as a toast instead.
export function applyApiError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly FieldPath<T>[],
) {
  if (!(error instanceof ApiError)) {
    toast.error("Something went wrong. Please try again.");
    return;
  }

  const known = new Set<string>(fields);
  let mapped = 0;
  for (const issue of error.errors) {
    const name = issue.field.split(".").pop() ?? issue.field;
    if (known.has(name)) {
      setError(name as FieldPath<T>, { type: "server", message: issue.message });
      mapped += 1;
    }
  }
  if (mapped === 0 || mapped < error.errors.length) toast.error(error.message);
}
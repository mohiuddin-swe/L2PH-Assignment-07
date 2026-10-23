import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="grid min-h-svh place-items-center" role="status" aria-label="Loading">
      <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
    </div>
  );
}
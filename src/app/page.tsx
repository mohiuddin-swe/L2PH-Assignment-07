import { redirect } from "next/navigation";

// Temporary: the public landing page is added in a later sprint.
export default function HomePage() {
  redirect("/login");
}
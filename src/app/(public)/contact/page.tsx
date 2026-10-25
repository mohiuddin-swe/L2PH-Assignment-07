import { BookText, Code2, ExternalLink, Server } from "lucide-react";
import type { Metadata } from "next";
import { PublicHero, PublicSection } from "@/components/layout/public-section";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Find the ${APP_NAME} source code, the live API documentation and where to report a problem.`,
  alternates: { canonical: "/contact" },
};

const LINKS = [
  {
    icon: Code2,
    title: "Frontend source code",
    text: "The Next.js app you are using right now.",
    href: "https://github.com/mohiuddin-swe/L2PH-Assignment-07",
  },
  {
    icon: Server,
    title: "Backend source code",
    text: "The Node.js and PostgreSQL REST API.",
    href: "https://github.com/mohiuddin-swe/L2PH-Assignment-06",
  },
  {
    icon: BookText,
    title: "API documentation",
    text: "Every endpoint, with a Swagger page you can try.",
    href: "https://l2ph-assignment-06.onrender.com/api/v1/docs",
  },
];

export default function ContactPage() {
  return (
    <>
      <PublicHero
        eyebrow="Contact"
        title="Questions, feedback or a bug to report?"
        description="The project lives on GitHub. Open an issue on the repository and it will be seen."
      />
      <PublicSection>
        <div className="grid gap-4 md:grid-cols-3">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="group rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
              <Card className="h-full transition-colors group-hover:bg-muted/50">
                <CardHeader>
                  <span className="mb-2 grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <link.icon className="size-5" aria-hidden />
                  </span>
                  <CardTitle className="flex items-center gap-1.5">
                    {link.title}
                    <ExternalLink className="size-3.5 text-muted-foreground" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </CardTitle>
                  <CardDescription>{link.text}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          The API runs on a free hosting plan that sleeps when idle, so the very first request after a quiet period can take up to a minute.
        </p>
      </PublicSection>
    </>
  );
}

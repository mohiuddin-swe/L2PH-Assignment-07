import type { ReactNode } from "react";

interface PublicHeroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PublicHero({ eyebrow, title, description }: PublicHeroProps) {
  return (
    <section className="border-b bg-muted/40">
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-12">
        <p className="text-sm font-medium text-primary">{eyebrow}</p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}

export function PublicSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-12">
      {title ? <h2 className="text-2xl font-semibold tracking-tight">{title}</h2> : null}
      {children}
    </section>
  );
}

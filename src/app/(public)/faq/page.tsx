import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import { PublicHero, PublicSection } from "@/components/layout/public-section";
import { DEMO_ACCOUNTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about enrollment, unpaid invoices, attendance, results, CGPA and paying fees with the SSLCommerz sandbox.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    question: "How do I enroll in a course?",
    answer: "Open Courses in your dashboard, pick an offering and press Enroll. Each offering has a limited number of seats, and you can hold at most 18 credits in one semester.",
  },
  {
    question: "Why does enrollment say I have an unpaid invoice?",
    answer: "The invoice for a semester must be paid before you can enroll in that semester's courses. Open Invoices, press Pay now, and try enrolling again once the payment is confirmed.",
  },
  {
    question: "Can I drop a course?",
    answer: "Yes. Open Enrollments, press Drop next to the course and confirm. Dropping gives your seat back to the class.",
  },
  {
    question: "What attendance do I need?",
    answer: "Your attendance page shows a percentage for each course and warns you when it is below 75%.",
  },
  {
    question: "When do I see my results?",
    answer: "Results appear after your teacher publishes them. Until then they are drafts that only the teacher can see. Published results cannot be changed.",
  },
  {
    question: "How is my CGPA calculated?",
    answer: "Each published course gives grade points on a 4.00 scale. Your semester GPA and your CGPA are weighted by course credits.",
  },
  {
    question: "How do I pay online, and can I test it?",
    answer:
      "Payments run through the SSLCommerz sandbox, so no real money moves. On the payment page choose Visa and enter card 4111 1111 1111 1111, CVV 111, expiry 12/30. When asked for an OTP, enter 111111.",
  },
  {
    question: "Which demo accounts can I sign in with?",
    answer: "The sign-in page has one-click buttons for a student, a teacher and an admin. You can also type these credentials in the form.",
    accounts: true,
  },
];

export default function FaqPage() {
  return (
    <>
      <PublicHero eyebrow="FAQ" title="Frequently asked questions" description="Quick answers about enrollment, fees, attendance and results." />
      <PublicSection>
        <div className="max-w-3xl divide-y rounded-xl border bg-card">
          {FAQS.map((item) => (
            <details key={item.question} className="group px-4 py-1 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-3 font-medium select-none">
                {item.question}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="space-y-3 pb-4 text-sm text-muted-foreground">
                <p>{item.answer}</p>
                {item.accounts ? (
                  <ul className="space-y-1 rounded-lg bg-muted/60 p-3 font-mono text-xs text-foreground">
                    {DEMO_ACCOUNTS.map((account) => (
                      <li key={account.email}>
                        {account.email} / {account.password}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </PublicSection>
    </>
  );
}

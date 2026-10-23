import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { APP_NAME } from "@/lib/config";
import { AppProviders } from "@/providers/app-providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const description =
  "UniManage is a role-based university management system: courses and enrollment, attendance, results and GPA, and online fee payment for students, teachers and administrators.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${APP_NAME} | University Management System`, template: `%s | ${APP_NAME}` },
  description,
  applicationName: APP_NAME,
  keywords: ["university management system", "student portal", "attendance", "results", "GPA", "fee payment"],
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: `${APP_NAME} | University Management System`,
    description,
  },
  twitter: { card: "summary", title: `${APP_NAME} | University Management System`, description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#14141c" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-svh">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
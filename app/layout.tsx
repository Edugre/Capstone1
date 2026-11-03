import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import Link from "next/link";
import NavLinks, { MobileNavLinks } from "@/components/nav-links";
import { CheckIcon } from "@/components/icons";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Tracker",
  description: "Track your classes and assignments in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas font-sans text-[15px] text-ink">
        <header className="border-b border-line bg-surface">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-on-accent">
                <CheckIcon className="size-4.5 stroke-[2.6]" />
              </span>
              <span className="font-display text-[17px] font-extrabold tracking-tight">
                Student Tracker
              </span>
            </Link>
            <nav aria-label="Main" className="hidden sm:block">
              <NavLinks />
            </nav>
          </div>
        </header>
        <div className="flex flex-1 flex-col pb-20 sm:pb-0">{children}</div>
        <nav
          aria-label="Main"
          className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:hidden"
        >
          <MobileNavLinks />
        </nav>
      </body>
    </html>
  );
}

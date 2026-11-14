import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Link from "next/link";
import NavLinks, { MobileNavLinks } from "@/components/nav-links";
import { MugIcon } from "@/components/icons";
import { SignedInOnly, SignOutButton } from "@/components/app-chrome";
import ThemeToggle from "@/components/theme-toggle";
import { ToastProvider } from "@/components/toast";
import "./globals.css";

// Runs before first paint so a saved night mode doesn't flash light first.
const themeScript = `(function(){try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}})()`;

const nunito = Nunito({
  variable: "--font-nunito",
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
      data-theme="light"
      suppressHydrationWarning
      className={`${nunito.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-canvas font-sans text-base leading-relaxed text-ink">
        <ToastProvider>
          <header className="px-4 pt-4.5 sm:px-6">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex size-10.5 animate-bob items-center justify-center rounded-[14px] bg-accent text-on-accent">
                  <MugIcon className="size-6" />
                </span>
                <span className="text-xl font-black tracking-tight">
                  Student Tracker
                </span>
              </Link>
              <div className="flex items-center gap-2.5">
                <SignedInOnly>
                  <nav aria-label="Main" className="hidden sm:block">
                    <NavLinks />
                  </nav>
                </SignedInOnly>
                <ThemeToggle />
                <SignedInOnly>
                  <SignOutButton />
                </SignedInOnly>
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col pb-24 sm:pb-0">{children}</div>
          <SignedInOnly>
            <nav
              aria-label="Main"
              className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-10 rounded-3xl border border-line bg-surface p-1.5 shadow-nav sm:hidden"
            >
              <MobileNavLinks />
            </nav>
          </SignedInOnly>
        </ToastProvider>
      </body>
    </html>
  );
}

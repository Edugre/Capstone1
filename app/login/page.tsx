import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = { title: "Sign in · Student Tracker" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 pt-7 pb-18 sm:px-6">
      <div className="flex animate-rise flex-col gap-1.5">
        <h1 className="text-[34px] leading-tight font-black tracking-tight">
          Welcome back
        </h1>
        <p className="text-[17px] text-ink-2">
          Sign in to see your classes and what&apos;s due.
        </p>
      </div>
      <section
        aria-label="Sign in"
        className="animate-rise rounded-[26px] border border-line bg-surface p-6 [animation-delay:120ms]"
      >
        <Suspense fallback={<LoginForm />}>
          <Form searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}

async function Form({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { error } = await searchParams;
  return <LoginForm linkFailed={error === "link"} />;
}

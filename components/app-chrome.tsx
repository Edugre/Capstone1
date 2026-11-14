"use client";

import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-actions";

// Nav and the sign-out button only make sense once you're signed in.
function useSignedInArea() {
  const pathname = usePathname();
  return !(pathname === "/login" || pathname.startsWith("/auth/"));
}

export function SignedInOnly({ children }: { children: React.ReactNode }) {
  return useSignedInArea() ? children : null;
}

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        title="Sign out"
        className="lift flex min-h-12 flex-none cursor-pointer items-center rounded-full border border-line bg-surface px-4.5 text-[15px] font-bold text-ink-2 hover:text-ink"
      >
        Sign out
      </button>
    </form>
  );
}

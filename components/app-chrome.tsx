"use client";

import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-actions";
import { SignOutIcon } from "./icons";

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
      {/* Round icon like the theme toggle; the label only shows when there's room. */}
      <button
        type="submit"
        aria-label="Sign out"
        title="Sign out"
        className="lift flex size-12 flex-none cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-surface text-[15px] font-bold whitespace-nowrap text-ink-2 hover:text-ink lg:w-auto lg:px-4.5"
      >
        <SignOutIcon className="size-5.5" />
        <span className="hidden lg:inline">Sign out</span>
      </button>
    </form>
  );
}

import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createAuthClient } from "./supabase-auth";

export type User = { id: string; email: string | null };

/**
 * The signed-in user, verified from the session cookie's JWT. Sends anyone
 * who isn't signed in to /login. Every data read and server action goes
 * through this, so it's the real access check (proxy.ts is only a fast gate).
 */
export const getCurrentUser = cache(async (): Promise<User> => {
  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) redirect("/login");

  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
  };
});

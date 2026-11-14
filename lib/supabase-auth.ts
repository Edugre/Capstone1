import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * A Supabase client that acts as the signed-in user, using the session
 * cookies. Use it only for auth calls (sign in, sign up, sign out, getClaims).
 * Data queries go through the secret-key client in ./supabase.ts.
 */
export async function createAuthClient() {
  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in .env");
  }

  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called while rendering a Server Component, where cookies are
          // read-only. proxy.ts refreshes the session cookies instead.
        }
      },
    },
  });
}

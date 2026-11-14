"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthClient } from "./supabase-auth";

export type AuthState = { error?: string; message?: string; email?: string };

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "Email and password are required.", email } as const;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "That email doesn't look right.", email } as const;
  }
  return { email, password } as const;
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const creds = readCredentials(formData);
  if ("error" in creds) return creds;

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithPassword(creds);
  if (error) {
    return {
      email: creds.email,
      error:
        error.code === "email_not_confirmed"
          ? "Confirm your email first. Check your inbox for the link."
          : "That email and password don't match.",
    };
  }

  redirect("/");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const creds = readCredentials(formData);
  if ("error" in creds) return creds;
  if (creds.password.length < 8) {
    return { email: creds.email, error: "Use at least 8 characters for your password." };
  }

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.signUp({
    ...creds,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });
  if (error) return { email: creds.email, error: error.message };

  // With email confirmation off, Supabase signs the user in right away.
  if (data.session) redirect("/");

  return {
    email: creds.email,
    message: "Check your email for a link to finish signing up.",
  };
}

export async function signOut() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/login");
}

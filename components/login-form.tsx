"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthState } from "@/lib/auth-actions";
import { Field, SubmitButton, fieldClass } from "./form-fields";

type Mode = "signin" | "signup";

export default function LoginForm({ linkFailed }: { linkFailed?: boolean }) {
  const [mode, setMode] = useState<Mode>("signin");
  const [signInState, signInAction, signingIn] = useActionState<AuthState, FormData>(
    signIn,
    linkFailed ? { error: "That link has expired or was already used. Sign in instead." } : {},
  );
  const [signUpState, signUpAction, signingUp] = useActionState<AuthState, FormData>(
    signUp,
    {},
  );

  const isSignUp = mode === "signup";
  const state = isSignUp ? signUpState : signInState;
  const pending = isSignUp ? signingUp : signingIn;

  return (
    <div className="flex flex-col gap-5">
      <div
        role="group"
        aria-label="Sign in or create an account"
        className="grid grid-cols-2 gap-1.5 rounded-full bg-warm-2 p-1.5"
      >
        {(
          [
            ["signin", "Sign in"],
            ["signup", "Create account"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
            className={`min-h-11 cursor-pointer rounded-full text-[15px] transition-colors ${
              mode === value
                ? "bg-surface font-extrabold text-ink shadow-sm"
                : "font-bold text-ink-2"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form
        key={mode}
        action={isSignUp ? signUpAction : signInAction}
        className="flex flex-col gap-4"
      >
        <Field label="Email">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={state.email}
            placeholder="you@school.edu"
            className={fieldClass}
          />
        </Field>
        <Field label="Password" hint={isSignUp ? "At least 8 characters" : undefined}>
          <input
            name="password"
            type="password"
            required
            minLength={isSignUp ? 8 : undefined}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            className={fieldClass}
          />
        </Field>
        <SubmitButton
          pending={pending}
          label={isSignUp ? "Create account" : "Sign in"}
          pendingLabel={isSignUp ? "Creating…" : "Signing in…"}
        />
        {state.error && (
          <p role="alert" className="text-sm font-bold text-late">
            {state.error}
          </p>
        )}
        {state.message && (
          <p role="status" className="animate-fade text-sm font-bold text-done">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}

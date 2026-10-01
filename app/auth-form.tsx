"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isSignUp = mode === "sign-up";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const result = isSignUp
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password });

    setPending(false);

    if (result.error) {
      setError(result.error.message ?? "Authentication failed. Please try again.");
      return;
    }

    window.location.assign("/courses");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <Link href="/" className="mb-8 text-sm font-medium text-zinc-600 hover:text-zinc-950">
        College Courses
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
        {isSignUp ? "Create your account" : "Sign in"}
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        {isSignUp
          ? "Your courses will be private to your account."
          : "Sign in to manage your courses."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {isSignUp && (
          <label className="block space-y-2 text-sm font-medium text-zinc-800">
            Name
            <input
              autoComplete="name"
              required
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded border border-zinc-300 px-3 py-2.5 font-normal"
            />
          </label>
        )}

        <label className="block space-y-2 text-sm font-medium text-zinc-800">
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded border border-zinc-300 px-3 py-2.5 font-normal"
          />
        </label>

        <label className="block space-y-2 text-sm font-medium text-zinc-800">
          Password
          <input
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            minLength={isSignUp ? 8 : undefined}
            maxLength={128}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded border border-zinc-300 px-3 py-2.5 font-normal"
          />
          {isSignUp && <span className="block font-normal text-zinc-500">Use at least 8 characters.</span>}
        </label>

        {error && (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded bg-zinc-950 px-4 py-2.5 font-medium text-white disabled:opacity-60"
        >
          {pending ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-600">
        {isSignUp ? "Already registered? " : "New here? "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="font-medium text-zinc-950 underline underline-offset-4"
        >
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </main>
  );
}
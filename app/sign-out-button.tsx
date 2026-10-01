"use client";

import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  async function handleSignOut() {
    await authClient.signOut();
    window.location.assign("/sign-in");
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-50"
    >
      Sign out
    </button>
  );
}"use client";

import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  async function handleSignOut() {
    await authClient.signOut();
    window.location.assign("/sign-in");
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-50"
    >
      Sign out
    </button>
  );
}
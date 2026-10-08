"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";

export default function AdminLoginPage() {
  const { signIn, signOut } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  const me = useQuery(api.users.me, isAuthenticated ? {} : "skip");
  const router = useRouter();
  const ensured = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");

  useEffect(() => {
    if (!isAuthenticated || me !== null || ensured.current) return;
    ensured.current = true;
    void ensureCurrentUser({ authMethod: "email" }).catch(() => {
      ensured.current = false;
      setError("Admin account load nahi ho saka.");
    });
  }, [ensureCurrentUser, isAuthenticated, me]);

  useEffect(() => {
    if (me?.role === "admin") router.replace("/admin/students");
    if (me && me.role !== "admin") setError("Aapko admin access nahi hai");
  }, [me, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await signIn("password", {
        email: String(form.get("email") ?? "").trim().toLowerCase(),
        password: String(form.get("password") ?? ""),
        flow,
      });
    } catch (cause) {
      console.error("Admin authentication failed", cause);
      setError(
        flow === "signUp"
          ? "Admin account create nahi ho saka. Email allowlist aur password check karein."
          : "Account nahi mila ya password durust nahi hai. Pehli dafa hain to account create karein."
      );
    } finally {
      setBusy(false);
    }
  }

  if (isLoading || (isAuthenticated && me === undefined)) {
    return <div className="grid min-h-[70vh] place-items-center text-stone-600">Admin account check ho raha hai…</div>;
  }

  if (isAuthenticated && me?.role !== "admin") {
    return (
      <main className="min-h-[70vh] bg-stone-50 px-4 pb-14 pt-32">
        <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-white p-7 text-center shadow-lg">
          <ShieldCheck className="mx-auto text-red-600" size={38} />
          <h1 className="mt-4 font-display text-3xl font-semibold">Access denied</h1>
          <p role="alert" className="mt-3 text-red-700">{error || "Aapko admin access nahi hai"}</p>
          <button onClick={() => void signOut()} className="mt-6 rounded-xl bg-stone-900 px-5 py-3 font-semibold text-white">Doosre account se login karein</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-stone-50 px-4 pb-14 pt-32">
      <div className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-7 shadow-lg sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600"><ShieldCheck /></div>
        <p className="eyebrow mt-5">Admin portal</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">{flow === "signIn" ? "Admin sign in" : "Create admin account"}</h1>
        <p className="mt-2 text-sm text-stone-600">
          {flow === "signIn" ? "Authorized administrators ke liye separate access." : "Sirf allowlisted admin email ko access milega."}
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-stone-700">Email address<input required name="email" type="email" autoComplete="email" className="mt-1.5 w-full rounded-xl border border-stone-300 px-3 py-3" /></label>
          <label className="block text-sm font-medium text-stone-700">Password<input required name="password" type="password" minLength={8} autoComplete="current-password" className="mt-1.5 w-full rounded-xl border border-stone-300 px-3 py-3" /></label>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white disabled:opacity-60">
            {busy ? "Please wait…" : flow === "signIn" ? "Sign in to Admin Portal" : "Create Admin Account"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => { setFlow(flow === "signIn" ? "signUp" : "signIn"); setError(""); }}
          className="mt-4 w-full text-sm font-semibold text-red-600"
        >
          {flow === "signIn" ? "First time? Create admin account" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}

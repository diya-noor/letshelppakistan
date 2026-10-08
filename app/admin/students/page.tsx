"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AddStudentForm } from "@/components/AddStudentForm";
import { StudentList } from "@/components/StudentList";
import { api } from "@/convex/_generated/api";

export default function StudentsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const me = useQuery(api.users.me, isAuthenticated ? {} : "skip");
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/admin/login");
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || (isAuthenticated && me === undefined)) {
    return <div className="grid min-h-[60vh] place-items-center text-stone-600">Loading…</div>;
  }
  if (!isAuthenticated) {
    return <div className="grid min-h-[60vh] place-items-center text-stone-600">Admin login par redirect ho raha hai…</div>;
  }
  if (!me || me.role !== "admin") {
    return <AccessDenied onSignOut={() => void signOut()} />;
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 pb-16 pt-28">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white px-5 py-4 shadow-sm">
          <div><p className="eyebrow">Admin portal</p><h1 className="font-display text-2xl font-semibold">Students</h1></div>
          <button onClick={() => void signOut().then(() => router.replace("/admin/login"))} className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white"><LogOut size={16} />Logout</button>
        </header>
        <AddStudentForm />
        <StudentList />
      </div>
    </main>
  );
}

function AccessDenied({ onSignOut }: { onSignOut: () => void }) {
  return <div className="mx-auto max-w-lg px-4 py-28 text-center"><h1 className="h1">Access denied</h1><p className="mt-3 text-red-700">Aapko admin access nahi hai</p><button onClick={onSignOut} className="mt-6 rounded-xl bg-stone-900 px-5 py-3 font-semibold text-white">Logout</button></div>;
}

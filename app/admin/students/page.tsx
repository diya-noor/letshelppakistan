"use client";

import Link from "next/link";
import { useConvexAuth, useQuery } from "convex/react";
import { AddStudentForm } from "@/components/AddStudentForm";
import { StudentList } from "@/components/StudentList";
import { api } from "@/convex/_generated/api";

export default function StudentsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const me = useQuery(api.users.me, isAuthenticated ? {} : "skip");

  if (isLoading || (isAuthenticated && me === undefined)) {
    return <div className="grid min-h-[60vh] place-items-center text-stone-600">Loading…</div>;
  }
  if (!isAuthenticated) {
    return <Gate message="Students manage karne ke liye admin sign in karein." />;
  }
  if (!me || me.role !== "admin") {
    return <Gate message="Is account ko admin access hasil nahi hai." />;
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 pb-16 pt-28">
      <div className="mx-auto max-w-6xl space-y-8">
        <AddStudentForm />
        <StudentList />
      </div>
    </main>
  );
}

function Gate({ message }: { message: string }) {
  return <div className="mx-auto max-w-lg px-4 py-28 text-center"><h1 className="h1">Admin access</h1><p className="mt-3 text-stone-600">{message}</p><Link href="/scholarship/login" className="mt-6 inline-block rounded-xl bg-red-600 px-5 py-3 font-semibold text-white">Sign in</Link></div>;
}

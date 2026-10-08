"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { FileText, UserRound } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Component, type ErrorInfo, type ReactNode, useState } from "react";
import { DocumentUploadSlots, existingDocumentForSlot, type DocumentSlot, type SelectedSlotFiles } from "@/components/scholarship/DocumentUploadSlots";

const groups = [
  { title: "Profile Photo", categories: [{ label: "Photo", types: ["profilePhoto", "photo"] }] },
  { title: "CNIC / B-Form", categories: [{ label: "Front", types: ["cnicFront", "cnic"] }, { label: "Back", types: ["cnicBack"] }] },
  { title: "Result Card", categories: [{ label: "Result card", types: ["resultCard", "result"] }] },
  { title: "Fee Voucher", categories: [{ label: "Fee voucher", types: ["feeVoucher"] }] },
  { title: "Bank Proof", categories: [{ label: "Cheque / account title", types: ["bankProof", "bank_details"] }] },
  { title: "Guardian CNIC", categories: [{ label: "Guardian CNIC", types: ["guardianCnic"] }] },
  { title: "Other Documents", categories: [{ label: "Other files", types: ["other", "income_certificate"] }] },
];

export default function StudentProfilePage() {
  return <ProfileErrorBoundary><StudentProfileContent/></ProfileErrorBoundary>;
}

function StudentProfileContent() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const params = useParams<{ studentId: string }>();
  const studentId = params.studentId as Id<"appUsers">;
  const me = useQuery(api.users.me, isAuthenticated ? {} : "skip");
  const profileData = useQuery(api.student.getProfile, me?.role === "admin" || me?.role === "student" ? { studentId } : "skip");
  const generateUploadUrl = useMutation(api.student.generateUploadUrl);
  const saveDocument = useMutation(api.student.saveDocument);
  const [editMode, setEditMode] = useState(false);
  const [files, setFiles] = useState<SelectedSlotFiles>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(file: File) {
    if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} is over 5 MB`);
    const url = await generateUploadUrl({});
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
    if (!response.ok) throw new Error(`Could not upload ${file.name}`);
    return (await response.json()).storageId as Id<"_storage">;
  }

  async function saveFiles() {
    setSaving(true);
    setMessage("");
    try {
      const entries = Object.entries(files) as [DocumentSlot, File[]][];
      for (const [type, selected] of entries) for (const file of selected) {
        const current = type === "other" ? undefined : existingDocumentForSlot(profileData?.documents ?? [], type);
        await saveDocument({ studentId, type, storageId: await upload(file), fileName: file.name, replaceDocumentId: current?._id });
      }
      setFiles({});
      setEditMode(false);
      setMessage("Documents saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save documents");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || (isAuthenticated && me === undefined) || profileData === undefined) return <State>Loading student profile…</State>;
  if (!isAuthenticated || !me) return <State>Please sign in to view this profile.</State>;
  if (profileData === null) return <State>Unable to load the student profile. Please try again.</State>;

  const { profile, documents, photoUrl, application } = profileData;
  const sections: { title: string; fields: [string, string | undefined][] }[] = [
    { title: "Personal information", fields: [["Full name", profile?.fullName], ["Father / guardian name", profile?.fatherName || profile?.guardianName], ["Date of birth", profile?.dateOfBirth]] },
    { title: "Contact", fields: [["Phone number", profile?.contactNumber], ["Email", profile?.email]] },
    { title: "Address", fields: [["Home address", profile?.address]] },
    { title: "Identity", fields: [["CNIC / B-Form", profile?.cnic]] },
    { title: "Bank details", fields: [["Account details", profile?.bankAccountDetails]] },
    { title: "Education", fields: [["School / institute", profile?.instituteName], ["Class / program", profile?.program]] },
  ];

  return <main className="min-h-screen bg-stone-50 px-4 pb-16 pt-28"><div className="mx-auto max-w-5xl">
    <Link href={me.role === "admin" ? "/admin/scholarships" : "/scholarship"} className="text-sm font-semibold text-red-700">← Back</Link>
    <header className="mt-5 flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-md sm:flex-row sm:items-center sm:p-8">
      <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-2xl bg-stone-100 text-stone-400">{photoUrl ? <img src={photoUrl} alt="Student profile" className="h-full w-full object-cover"/> : <UserRound size={54} aria-label="Profile placeholder"/>}</div>
      <div className="min-w-0 flex-1"><p className="eyebrow">Student profile</p><div className="mt-1 flex flex-wrap items-center gap-3"><h1 className="font-display text-3xl font-semibold sm:text-4xl">{profile?.fullName || "Student"}</h1><Status value={application?.status}/></div><p className="mt-2 text-stone-600">{profile?.instituteName || "Not provided"}{profile?.program ? ` · ${profile.program}` : ""}</p></div>
    </header>

    <div className="mt-6 grid gap-5 md:grid-cols-2">{sections.map(section => <section key={section.title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-display text-xl font-semibold">{section.title}</h2><dl className="mt-4 grid gap-3 sm:grid-cols-2">{section.fields.map(([label, value]) => <Field key={label} label={label} value={value}/>)}</dl></section>)}</div>

    <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-2xl font-semibold">Documents</h2>{me.role === "admin" && <button type="button" onClick={() => { setEditMode(value => !value); setFiles({}); setMessage(""); }} className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold">{editMode ? "Cancel editing" : "Edit documents"}</button>}</div>
      {message && <p role="status" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-stone-700">{message}</p>}
      {editMode && me.role === "admin" ? <div className="mt-5"><DocumentUploadSlots selectedFiles={files} documents={documents} onChange={(type, selected) => setFiles(current => ({ ...current, [type]: selected }))} disabled={saving}/><button type="button" disabled={saving} onClick={() => void saveFiles()} className="mt-4 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Uploading…" : "Save documents"}</button></div> : documents.length === 0 ? <p className="mt-4 rounded-xl bg-stone-50 p-5 text-sm text-stone-500">No documents uploaded.</p> : <div className="mt-5 grid gap-4 sm:grid-cols-2">{groups.map(group => <section key={group.title} className="rounded-xl border border-stone-200 p-4"><h3 className="font-semibold">{group.title}</h3><div className="mt-3 space-y-3">{group.categories.map(category => { const matching = documents.filter((doc: any) => category.types.includes(doc.type)); return <div key={category.label} className="border-t border-stone-100 pt-3"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">{category.label}</p>{matching.length ? matching.map((doc: any) => <DocumentItem key={doc._id} document={doc}/>) : <p className="text-sm text-stone-500">Not uploaded</p>}</div>; })}</div></section>)}</div>}
    </section>
  </div></main>;
}

function DocumentItem({ document }: { document: any }) {
  return <div className="mb-3 flex min-w-0 items-center gap-3 last:mb-0">{document.url && document.mimeType.startsWith("image/") ? <a href={document.url} target="_blank" rel="noreferrer" className="shrink-0"><img src={document.url} alt={document.fileName} className="h-14 w-14 rounded-lg border object-cover"/></a> : <FileText className="shrink-0 text-red-600" size={22}/>}<div className="min-w-0 flex-1"><p className="truncate text-sm font-medium" title={document.fileName}>{document.fileName}</p><p className="text-xs text-stone-500">Uploaded {new Date(document.uploadedAt).toLocaleDateString()}</p><div className="mt-1 flex gap-3">{document.url && <a href={document.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-red-700">View / Download</a>}{document.url && document.mimeType.startsWith("image/") && <a href={document.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-stone-600">Preview</a>}</div></div></div>;
}

function Status({ value }: { value?: string }) {
  return <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold capitalize text-amber-800">{value?.replaceAll("_", " ") || "Pending"}</span>;
}

function Field({ label, value }: { label: string; value?: string }) {
  return <div className="rounded-xl bg-stone-50 p-3"><dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</dt><dd className="mt-1 break-words text-sm font-medium">{value?.trim() || "Not provided"}</dd></div>;
}

function State({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-[70vh] place-items-center bg-stone-50 px-4 pt-20"><p className="rounded-xl border border-stone-200 bg-white p-5 text-center text-stone-600">{children}</p></main>;
}

class ProfileErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, _info: ErrorInfo) { console.error("Student profile failed to load", error); }
  render() { return this.state.hasError ? <State>Unable to load this profile. Check your access or try again later.</State> : this.props.children; }
}

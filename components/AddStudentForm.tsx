"use client";

import { useMutation } from "convex/react";
import { FormEvent, useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type UploadState = Record<string, "uploading" | "done" | "error">;
const inputClass = "mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm";

export function AddStudentForm() {
  const generateUploadUrl = useMutation(api.students.generateUploadUrl);
  const addStudent = useMutation(api.students.addStudent);
  const [fatherCnic, setFatherCnic] = useState<File | null>(null);
  const [resultCard, setResultCard] = useState<File | null>(null);
  const [otherDocuments, setOtherDocuments] = useState<File[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function uploadFile(file: File, key: string) {
    setUploadState((current) => ({ ...current, [key]: "uploading" }));
    try {
      const postUrl = await generateUploadUrl({});
      const response = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!response.ok) throw new Error(`Could not upload ${file.name}`);
      const { storageId } = (await response.json()) as { storageId: Id<"_storage"> };
      setUploadState((current) => ({ ...current, [key]: "done" }));
      return storageId;
    } catch (error) {
      setUploadState((current) => ({ ...current, [key]: "error" }));
      throw error;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const ageText = String(data.get("age") ?? "").trim();
    setSubmitting(true);
    setMessage(null);
    setUploadState({});

    try {
      const [fatherCnicFile, resultCardFile, uploadedOthers] = await Promise.all([
        fatherCnic ? uploadFile(fatherCnic, "father-cnic") : undefined,
        resultCard ? uploadFile(resultCard, "result-card") : undefined,
        Promise.all(otherDocuments.map((file, index) => uploadFile(file, `other-${index}`))),
      ]);

      await addStudent({
        name: String(data.get("name") ?? ""),
        age: ageText ? Number(ageText) : undefined,
        className: optionalValue(data, "className"),
        guardianName: optionalValue(data, "guardianName"),
        phone: optionalValue(data, "phone"),
        address: optionalValue(data, "address"),
        fatherCnicFile,
        resultCardFile,
        otherDocuments: uploadedOthers.length ? uploadedOthers : undefined,
      });

      form.reset();
      setFatherCnic(null);
      setResultCard(null);
      setOtherDocuments([]);
      setUploadState({});
      setMessage({ type: "success", text: "Student aur documents successfully save ho gaye." });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Student save nahi ho saka." });
    } finally {
      setSubmitting(false);
    }
  }

  const files = [
    ...(fatherCnic ? [{ key: "father-cnic", file: fatherCnic }] : []),
    ...(resultCard ? [{ key: "result-card", file: resultCard }] : []),
    ...otherDocuments.map((file, index) => ({ key: `other-${index}`, file })),
  ];

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-display text-2xl font-semibold">Add Student</h2>
      <p className="mt-1 text-sm text-stone-600">Student details ke saath PDF ya image documents upload karein (max 10 MB each).</p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Student name" required />
        <Field name="age" label="Age" type="number" min="0" max="150" />
        <Field name="className" label="Class" />
        <Field name="guardianName" label="Guardian name" />
        <Field name="phone" label="Phone" type="tel" />
        <Field name="address" label="Address" />

        <FileField label="Father CNIC" onChange={(files) => setFatherCnic(files[0] ?? null)} />
        <FileField label="Result Card" onChange={(files) => setResultCard(files[0] ?? null)} />
        <div className="sm:col-span-2">
          <FileField label="Other Documents" multiple onChange={setOtherDocuments} />
        </div>

        {files.length > 0 && (
          <ul className="space-y-1 rounded-xl bg-stone-50 p-3 text-sm sm:col-span-2">
            {files.map(({ key, file }) => (
              <li key={key} className="flex justify-between gap-3">
                <span className="truncate">{file.name}</span>
                <span aria-live="polite" className="font-medium text-stone-600">
                  {uploadState[key] === "uploading" ? "Uploading…" : uploadState[key] === "done" ? "Uploaded" : uploadState[key] === "error" ? "Failed" : "Ready"}
                </span>
              </li>
            ))}
          </ul>
        )}

        {message && (
          <p role="status" className={`rounded-xl p-3 text-sm sm:col-span-2 ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {message.text}
          </p>
        )}

        <button disabled={submitting} className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2">
          {submitting ? "Uploading & saving…" : "Add student"}
        </button>
      </form>
    </section>
  );
}

function optionalValue(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim() || undefined;
}

function Field({ name, label, required, type = "text", min, max }: { name: string; label: string; required?: boolean; type?: string; min?: string; max?: string }) {
  return <label className="text-sm font-medium">{label}<input className={inputClass} name={name} type={type} required={required} min={min} max={max} /></label>;
}

function FileField({ label, multiple, onChange }: { label: string; multiple?: boolean; onChange: (files: File[]) => void }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input className={inputClass} type="file" accept=".pdf,image/jpeg,image/png,image/webp" multiple={multiple} onChange={(event) => onChange(Array.from(event.target.files ?? []))} />
    </label>
  );
}

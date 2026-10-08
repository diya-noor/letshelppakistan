"use client";

import type { Id } from "@/convex/_generated/dataModel";
import { FileText, ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";

const slotDefinitions = [
  { type: "profilePhoto", label: "Profile photo", imageOnly: true },
  { type: "cnicFront", label: "CNIC / B-Form" },
  { type: "incomeCertificate", label: "Income certificate" },
  { type: "bankProof", label: "Bank details" },
  { type: "resultCard", label: "Result card" },
  { type: "other", label: "Other documents", multiple: true },
] as const;

export type DocumentSlot = (typeof slotDefinitions)[number]["type"];
export const documentSlots = slotDefinitions.map(slot => ({ imageOnly: false, multiple: false, ...slot }));
export type SelectedSlotFiles = Partial<Record<DocumentSlot, File[]>>;
type ExistingDocument = {
  _id: Id<"documents">;
  type: string;
  fileName: string;
  mimeType: string;
  uploadedAt: number;
  url: string | null;
};

export function DocumentUploadSlots({
  selectedFiles,
  documents = [],
  onChange,
  disabled = false,
}: {
  selectedFiles: SelectedSlotFiles;
  documents?: ExistingDocument[];
  onChange: (type: DocumentSlot, files: File[]) => void;
  disabled?: boolean;
}) {
  const [validation, setValidation] = useState<Record<string, string>>({});
  return <div className="grid gap-3 sm:grid-cols-2">{documentSlots.map(slot => {
    const selected = selectedFiles[slot.type] ?? [];
    const existing = documents.filter(document => isInSlot(document.type, slot.type));
    return <section key={slot.type} className="rounded-xl border border-stone-200 bg-white p-3">
      <h3 className="text-sm font-semibold">{slot.label}</h3>
      <div className="mt-2 space-y-2">
        {selected.map((file, index) => <SelectedFile key={`${file.name}-${file.lastModified}-${index}`} file={file} onRemove={() => onChange(slot.type, selected.filter((_, i) => i !== index))}/>)}
        {existing.map(document => <ExistingFile key={document._id} document={document}/>) }
        {!selected.length && !existing.length && <p className="text-xs text-stone-500">Not uploaded</p>}
      </div>
      {validation[slot.type] && <p role="alert" className="mt-2 text-xs text-red-700">{validation[slot.type]}</p>}
      <label className={`mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-stone-100 px-3 py-2 text-xs font-semibold ${disabled ? "pointer-events-none opacity-50" : ""}`}>
        {slot.imageOnly ? <ImagePlus size={15}/> : <FileText size={15}/>} {slot.multiple ? "Choose files" : selected.length || existing.length ? "Replace file" : "Choose file"}
        <input hidden type="file" multiple={slot.multiple} disabled={disabled} accept={slot.imageOnly ? "image/jpeg,image/png,image/webp" : ".pdf,image/jpeg,image/png,image/webp"} onChange={event => {
          const files = Array.from(event.currentTarget.files ?? []);
          event.currentTarget.value = "";
          const invalid = files.find(file => file.size > 5 * 1024 * 1024 || (!slot.imageOnly && !["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type)) || (slot.imageOnly && !file.type.startsWith("image/")));
          if (invalid) { setValidation(current => ({ ...current, [slot.type]: invalid.size > 5 * 1024 * 1024 ? `${invalid.name} exceeds 5 MB.` : "Use PDF, JPG, PNG or WEBP files; profile photos must be images." })); return; }
          setValidation(current => ({ ...current, [slot.type]: "" }));
          if (files.length) onChange(slot.type, slot.multiple ? [...selected, ...files] : [files[0]]);
        }}/>
      </label>
      <p className="mt-1 text-xs text-stone-500">{slot.imageOnly ? "Image only" : "PDF or image"}; max 5 MB per file.</p>
    </section>;
  })}</div>;
}

function isInSlot(type: string, slot: DocumentSlot) {
  if (type === slot) return true;
  const legacy: Partial<Record<DocumentSlot, string[]>> = {
    profilePhoto: ["photo"],
    cnicFront: ["cnic"],
    resultCard: ["result"],
    bankProof: ["bank_details"],
    incomeCertificate: ["income_certificate"],
  };
  return legacy[slot]?.includes(type) ?? false;
}

export function existingDocumentForSlot<T extends { type: string }>(documents: T[], slot: DocumentSlot) {
  const replaceableLegacy: Partial<Record<DocumentSlot, string[]>> = {
    profilePhoto: ["photo"], cnicFront: ["cnic"], bankProof: ["bank_details"], incomeCertificate: ["income_certificate"],
  };
  return documents.find(document => document.type === slot) ?? documents.find(document => replaceableLegacy[slot]?.includes(document.type));
}

function SelectedFile({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [preview, setPreview] = useState<string>();
  useEffect(() => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return <div className="flex items-center gap-2 rounded-lg bg-stone-50 p-2">
    {preview ? <img src={preview} alt="Selected upload preview" className="h-10 w-10 rounded-md object-cover"/> : <FileText size={19} className="shrink-0 text-red-600"/>}
    <span className="min-w-0 flex-1 truncate text-xs" title={file.name}>{file.name}</span>
    <button type="button" onClick={onRemove} aria-label={`Remove ${file.name}`} className="rounded p-1 text-stone-500 hover:bg-white"><X size={15}/></button>
  </div>;
}

function ExistingFile({ document }: { document: ExistingDocument }) {
  return <div className="flex items-center gap-2 rounded-lg bg-stone-50 p-2">
    {document.url && document.mimeType.startsWith("image/") ? <a href={document.url} target="_blank" rel="noreferrer"><img src={document.url} alt={document.fileName} className="h-10 w-10 rounded-md object-cover"/></a> : <FileText size={19} className="shrink-0 text-red-600"/>}
    <a href={document.url ?? undefined} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-xs font-medium text-red-700" title={document.fileName}>{document.fileName}</a>
  </div>;
}

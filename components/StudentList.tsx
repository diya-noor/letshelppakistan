"use client";

import { useQuery } from "convex/react";
import { FileText, Image as ImageIcon } from "lucide-react";
import { api } from "@/convex/_generated/api";

export function StudentList() {
  const students = useQuery(api.students.listStudents, {});

  if (students === undefined) return <p className="rounded-2xl border bg-white p-6 text-stone-600">Students load ho rahe hain…</p>;
  if (students.length === 0) return <p className="rounded-2xl border bg-white p-6 text-stone-600">Abhi koi student add nahi hua.</p>;

  return (
    <section>
      <h2 className="font-display text-2xl font-semibold">Students & Documents</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {students.map((student) => (
          <article key={student._id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold">{student.name}</h3>
            <p className="mt-1 text-sm text-stone-600">
              {[student.age !== undefined ? `Age ${student.age}` : null, student.className, student.guardianName ? `Guardian: ${student.guardianName}` : null].filter(Boolean).join(" · ") || "No extra details"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <DocumentLink label="Father CNIC" url={student.fatherCnicUrl} />
              <DocumentLink label="Result Card" url={student.resultCardUrl} />
              {student.otherDocumentUrls.map((document, index) => (
                <DocumentLink key={document.storageId} label={`Other ${index + 1}`} url={document.url} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DocumentLink({ label, url }: { label: string; url: string | null }) {
  if (!url) return null;
  const isImage = /\.(?:jpe?g|png|webp)(?:\?|$)/i.test(url);
  return (
    <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
      {isImage ? <ImageIcon size={16} /> : <FileText size={16} />}
      {label}
    </a>
  );
}

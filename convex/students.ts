import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { clean, requireAdmin } from "./helpers";

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const maxFileSize = 10 * 1024 * 1024;

const optionalText = (value: string | undefined, max: number) => {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (trimmed.length > max) throw new Error("A field is too long");
  return trimmed;
};

async function validateStoredFile(ctx: MutationCtx, storageId: Id<"_storage">) {
  const file = await ctx.db.system.get(storageId);
  if (!file) throw new Error("An uploaded file could not be found");
  if (!file.contentType || !allowedMimeTypes.has(file.contentType)) {
    throw new Error("Only PDF, JPG, PNG, and WEBP documents are allowed");
  }
  if (file.size > maxFileSize) {
    throw new Error("Each document must be 10 MB or smaller");
  }
}

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const addStudent = mutation({
  args: {
    name: v.string(),
    age: v.optional(v.number()),
    className: v.optional(v.string()),
    guardianName: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    fatherCnicFile: v.optional(v.id("_storage")),
    resultCardFile: v.optional(v.id("_storage")),
    otherDocuments: v.optional(v.array(v.id("_storage"))),
  },
  returns: v.id("students"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    if (args.age !== undefined && (!Number.isInteger(args.age) || args.age < 0 || args.age > 150)) {
      throw new Error("Age must be a whole number between 0 and 150");
    }

    const storageIds = [
      args.fatherCnicFile,
      args.resultCardFile,
      ...(args.otherDocuments ?? []),
    ].filter((id): id is Id<"_storage"> => id !== undefined);
    await Promise.all(storageIds.map((id) => validateStoredFile(ctx, id)));

    return await ctx.db.insert("students", {
      name: clean(args.name, "Student name", 100),
      age: args.age,
      className: optionalText(args.className, 100),
      guardianName: optionalText(args.guardianName, 100),
      phone: optionalText(args.phone, 30),
      address: optionalText(args.address, 500),
      fatherCnicFile: args.fatherCnicFile,
      resultCardFile: args.resultCardFile,
      otherDocuments: args.otherDocuments?.length ? args.otherDocuments : undefined,
      createdAt: Date.now(),
    });
  },
});

export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.storage.getUrl(args.storageId);
  },
});

const studentWithUrls = v.object({
  _id: v.id("students"),
  _creationTime: v.number(),
  name: v.string(),
  age: v.optional(v.number()),
  className: v.optional(v.string()),
  guardianName: v.optional(v.string()),
  phone: v.optional(v.string()),
  address: v.optional(v.string()),
  fatherCnicFile: v.optional(v.id("_storage")),
  resultCardFile: v.optional(v.id("_storage")),
  otherDocuments: v.optional(v.array(v.id("_storage"))),
  createdAt: v.number(),
  fatherCnicUrl: v.union(v.string(), v.null()),
  resultCardUrl: v.union(v.string(), v.null()),
  otherDocumentUrls: v.array(v.object({ storageId: v.id("_storage"), url: v.union(v.string(), v.null()) })),
});

export const listStudents = query({
  args: {},
  returns: v.array(studentWithUrls),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const students = await ctx.db.query("students").order("desc").take(100);
    return await Promise.all(students.map(async (student) => ({
      ...student,
      fatherCnicUrl: student.fatherCnicFile ? await ctx.storage.getUrl(student.fatherCnicFile) : null,
      resultCardUrl: student.resultCardFile ? await ctx.storage.getUrl(student.resultCardFile) : null,
      otherDocumentUrls: await Promise.all((student.otherDocuments ?? []).map(async (storageId) => ({
        storageId,
        url: await ctx.storage.getUrl(storageId),
      }))),
    })));
  },
});

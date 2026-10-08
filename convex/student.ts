import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { clean, requireAdmin, requireAppUser, validateCnic, validatePhone } from "./helpers";
const documentType = v.union(v.literal("profilePhoto"), v.literal("cnicFront"), v.literal("cnicBack"), v.literal("resultCard"), v.literal("feeVoucher"), v.literal("bankProof"), v.literal("guardianCnic"), v.literal("other"));
const allowedMime = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
export const getDashboard = query({ args: {}, returns: v.any(), handler: async ctx => { const user = await requireAppUser(ctx); if (user.role !== "student") throw new Error("Student access required"); const profile = await ctx.db.query("studentProfiles").withIndex("by_userId", q => q.eq("userId", user._id)).unique(); const application = await ctx.db.query("applications").withIndex("by_studentId", q => q.eq("studentId", user._id)).unique(); const docs = await ctx.db.query("documents").withIndex("by_studentId", q => q.eq("studentId", user._id)).collect(); const terms = await ctx.db.query("terms").withIndex("by_studentId", q => q.eq("studentId", user._id)).order("desc").take(100); const documents = await Promise.all(docs.map(async d => ({ ...d, url: await ctx.storage.getUrl(d.storageId) }))); const hydratedTerms = await Promise.all(terms.map(async t => ({ ...t, resultUrl: t.resultStorageId ? await ctx.storage.getUrl(t.resultStorageId) : null }))); return { user: { _id: user._id, role: user.role }, profile, application, documents, terms: hydratedTerms }; } });
export const saveProfile = mutation({
  args: {
    studentId: v.optional(v.id("appUsers")),
    fullName: v.string(), fatherName: v.string(), cnic: v.string(), dateOfBirth: v.string(),
    address: v.string(), instituteName: v.string(), program: v.string(), contactNumber: v.string(),
    email: v.optional(v.string()), bankAccountDetails: v.optional(v.string()),
  },
  returns: v.object({ studentId: v.id("appUsers"), profileId: v.id("studentProfiles") }),
  handler: async (ctx, args) => {
    const actor = await requireAppUser(ctx);
    let studentId = actor._id;
    if (args.studentId) {
      if (actor.role !== "admin") throw new Error("Admin access required");
      const target = await ctx.db.get(args.studentId);
      if (!target || target.role !== "student") throw new Error("Student not found");
      studentId = target._id;
    } else if (actor.role === "admin") {
      const now = Date.now();
      studentId = await ctx.db.insert("appUsers", { role: "student", accountType: "admin_added", createdAt: now, updatedAt: now });
      await ctx.db.insert("applications", { studentId, status: "pending", submittedAt: now, updatedAt: now });
    } else if (actor.role !== "student") {
      throw new Error("Student access required");
    }
    const fullName = clean(args.fullName, "Full name", 100);
    const fatherName = clean(args.fatherName, "Father's name", 100);
    const cnic = validateCnic(args.cnic);
    const dateOfBirth = clean(args.dateOfBirth, "Date of birth", 10);
    const parsedDate = new Date(`${dateOfBirth}T00:00:00.000Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== dateOfBirth) throw new Error("Enter a valid date of birth");
    const email = args.email?.trim().toLowerCase() || undefined;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address");
    const data = {
      fullName, fatherName, guardianName: fatherName, cnic, dateOfBirth,
      address: clean(args.address, "Address", 500),
      instituteName: clean(args.instituteName, "Institute", 150),
      program: clean(args.program, "Class / program", 100),
      contactNumber: validatePhone(args.contactNumber), email,
      bankAccountDetails: args.bankAccountDetails?.trim() || undefined,
      updatedAt: Date.now(),
    };
    const duplicate = await ctx.db.query("studentProfiles").withIndex("by_cnic", q => q.eq("cnic", data.cnic)).unique();
    if (duplicate && duplicate.userId !== studentId) throw new Error("This CNIC/B-Form is already registered");
    const existing = await ctx.db.query("studentProfiles").withIndex("by_userId", q => q.eq("userId", studentId)).unique();
    if (existing) {
      await ctx.db.patch(existing._id, data);
      return { studentId, profileId: existing._id };
    }
    const now = Date.now();
    const id = await ctx.db.insert("studentProfiles", { ...data, userId: studentId, createdAt: now });
    const application = await ctx.db.query("applications").withIndex("by_studentId", q => q.eq("studentId", studentId)).unique();
    if (!application) await ctx.db.insert("applications", { studentId, status: "pending", submittedAt: now, updatedAt: now });
    return { studentId, profileId: id };
  },
});

export const getProfile = query({
  args: { studentId: v.optional(v.id("appUsers")) },
  returns: v.any(),
  handler: async (ctx, args) => {
    const actor = await requireAppUser(ctx);
    const studentId = args.studentId ?? actor._id;
    if (actor.role === "student" && studentId !== actor._id) throw new Error("You can only view your own profile");
    if (actor.role === "admin" && !args.studentId) throw new Error("Select a student profile");
    const student = await ctx.db.get(studentId);
    if (!student || student.role !== "student") throw new Error("Student not found");
    const profile = await ctx.db.query("studentProfiles").withIndex("by_userId", q => q.eq("userId", studentId)).unique();
    const application = await ctx.db.query("applications").withIndex("by_studentId", q => q.eq("studentId", studentId)).unique();
    const documents = await ctx.db.query("documents").withIndex("by_studentId", q => q.eq("studentId", studentId)).collect();
    const result = await Promise.all(documents.map(async document => ({
      ...document,
      url: await ctx.storage.getUrl(document.storageId),
    })));
    const legacyPhoto = result.find(document => document.type === "photo" && document.mimeType.startsWith("image/"));
    const photoUrl = profile?.profileImageId ? await ctx.storage.getUrl(profile.profileImageId) : legacyPhoto?.url ?? null;
    return { profile, application, documents: result.sort((a, b) => b.uploadedAt - a.uploadedAt), photoUrl };
  },
});
export const generateUploadUrl = mutation({ args: {}, returns: v.string(), handler: async ctx => { await requireAppUser(ctx); return await ctx.storage.generateUploadUrl(); } });
export const saveDocument = mutation({
  args: { studentId: v.optional(v.id("appUsers")), type: documentType, storageId: v.id("_storage"), fileName: v.string(), replaceDocumentId: v.optional(v.id("documents")) },
  returns: v.id("documents"),
  handler: async (ctx, args) => {
    const actor = await requireAppUser(ctx);
    let studentId = actor._id;
    if (actor.role === "admin") {
      if (!args.studentId) throw new Error("Select a student for this document");
      const student = await ctx.db.get(args.studentId);
      if (!student || student.role !== "student") throw new Error("Student not found");
      studentId = student._id;
    } else if (args.studentId && args.studentId !== actor._id) {
      throw new Error("You can only upload documents to your own profile");
    }

    const stored = await ctx.db.system.get(args.storageId);
    if (!stored?.contentType || !allowedMime.has(stored.contentType) || stored.size > 5 * 1024 * 1024) throw new Error("Only PDF/JPG/PNG/WEBP files up to 5 MB are allowed");
    if (args.type === "profilePhoto" && !stored.contentType.startsWith("image/")) throw new Error("Profile photo must be an image");
    const profile = await ctx.db.query("studentProfiles").withIndex("by_userId", q => q.eq("userId", studentId)).unique();
    if (!profile) throw new Error("Student profile not found");

    if (args.replaceDocumentId) {
      const previous = await ctx.db.get(args.replaceDocumentId);
      const legacyTypes: Partial<Record<typeof args.type, string[]>> = { profilePhoto: ["photo"], cnicFront: ["cnic"], bankProof: ["bank_details"], other: ["income_certificate"] };
      if (!previous || previous.studentId !== studentId || (previous.type !== args.type && !legacyTypes[args.type]?.includes(previous.type))) throw new Error("Document to replace was not found in this category");
      await ctx.db.delete(previous._id);
      await ctx.storage.delete(previous.storageId);
    } else if (args.type !== "other") {
      const previousFiles = await ctx.db.query("documents").withIndex("by_studentId_and_type", q => q.eq("studentId", studentId).eq("type", args.type)).collect();
      for (const previous of previousFiles) {
        await ctx.db.delete(previous._id);
        await ctx.storage.delete(previous.storageId);
      }
    }

    const documentId = await ctx.db.insert("documents", {
      studentId, type: args.type, storageId: args.storageId,
      fileName: clean(args.fileName, "File name", 180), mimeType: stored.contentType,
      size: stored.size, uploadedAt: Date.now(),
    });
    if (args.type === "profilePhoto") await ctx.db.patch(profile._id, { profileImageId: args.storageId, updatedAt: Date.now() });
    return documentId;
  },
});
export const addTerm = mutation({ args: { termName: v.string(), resultStorageId: v.id("_storage"), resultFileName: v.string(), mimeType: v.string(), size: v.number() }, returns: v.id("terms"), handler: async (ctx,args) => { const user = await requireAppUser(ctx); if (user.role !== "student") throw new Error("Student access required"); const stored = await ctx.db.system.get(args.resultStorageId); if (!stored || !stored.contentType || !allowedMime.has(stored.contentType) || stored.size > 5 * 1024 * 1024) throw new Error("Only PDF/JPG/PNG/WEBP files up to 5 MB are allowed"); const now = Date.now(); const termId = await ctx.db.insert("terms", { studentId: user._id, termName: clean(args.termName,"Term name",100), resultStorageId: args.resultStorageId, resultFileName: clean(args.resultFileName,"File name",180), paymentStatus: "pending", amountPaid: 0, amountDue: 0, createdBy: user._id, createdAt: now, updatedAt: now }); await ctx.db.insert("documents", { studentId: user._id, type: "result", storageId: args.resultStorageId, fileName: args.resultFileName, mimeType: stored.contentType, size: stored.size, termId, uploadedAt: now }); return termId; } });

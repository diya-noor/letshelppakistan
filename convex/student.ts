import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { clean, isAdmin, requireAppUser } from "./helpers";
import { persistStudentProfile } from "./profileUtils";
const documentType = v.union(v.literal("profilePhoto"), v.literal("cnicFront"), v.literal("cnicBack"), v.literal("incomeCertificate"), v.literal("resultCard"), v.literal("feeVoucher"), v.literal("bankProof"), v.literal("guardianCnic"), v.literal("other"));
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
    if (actor.role !== "student" || await isAdmin(ctx, actor)) {
      throw new Error("Student access required");
    }
    if (args.studentId && args.studentId !== actor._id) throw new Error("You can only save your own profile");
    return await persistStudentProfile(ctx, actor._id, args);
  },
});

export const getProfile = query({
  args: { studentId: v.optional(v.id("appUsers")) },
  returns: v.any(),
  handler: async (ctx, args) => {
    const actor = await requireAppUser(ctx);
    const admin = await isAdmin(ctx, actor);
    const studentId = args.studentId ?? actor._id;
    if (!admin && studentId !== actor._id) throw new Error("You can only view your own profile");
    if (admin && !args.studentId) throw new Error("Select a student profile");
    const student = await ctx.db.get(studentId);
    if (!student || student.role !== "student") throw new Error("Student not found");
    const profile = await ctx.db.query("studentProfiles").withIndex("by_userId", q => q.eq("userId", studentId)).unique();
    const application = await ctx.db.query("applications").withIndex("by_studentId", q => q.eq("studentId", studentId)).unique();
    const documents = await ctx.db.query("documents").withIndex("by_studentId", q => q.eq("studentId", studentId)).collect();
    const result = await Promise.all(documents.map(async document => ({
      ...document,
      url: await ctx.storage.getUrl(document.storageId),
    })));
    const legacyPhoto = result.find(document => ["profilePhoto", "photo"].includes(document.type) && document.mimeType.startsWith("image/"));
    const photoUrl = profile?.profileImageId ? await ctx.storage.getUrl(profile.profileImageId) : legacyPhoto?.url ?? null;
    return { profile, application, user: { accountType: student.accountType, authUserId: student.authUserId, updatedAt: student.updatedAt }, documents: result.sort((a, b) => b.uploadedAt - a.uploadedAt), photoUrl };
  },
});
export const generateUploadUrl = mutation({
  args: { studentId: v.optional(v.id("appUsers")) },
  returns: v.string(),
  handler: async (ctx, args) => {
    const actor = await requireAppUser(ctx);
    const admin = await isAdmin(ctx, actor);
    if (admin && args.studentId) {
      const target = await ctx.db.get(args.studentId);
      if (!target || target.role !== "student") throw new Error("Student not found");
    } else if (admin && !args.studentId) {
      throw new Error("Select a student before uploading documents");
    } else if (args.studentId && args.studentId !== actor._id) {
      throw new Error("You can only upload documents to your own profile");
    }
    return await ctx.storage.generateUploadUrl();
  },
});
export const saveDocument = mutation({
  args: { studentId: v.optional(v.id("appUsers")), type: documentType, storageId: v.id("_storage"), fileName: v.string(), replaceDocumentId: v.optional(v.id("documents")) },
  returns: v.id("documents"),
  handler: async (ctx, args) => {
    const actor = await requireAppUser(ctx);
    const admin = await isAdmin(ctx, actor);
    let studentId = actor._id;
    if (admin) {
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
      const legacyTypes: Partial<Record<typeof args.type, string[]>> = { profilePhoto: ["photo"], cnicFront: ["cnic"], bankProof: ["bank_details"], incomeCertificate: ["income_certificate"] };
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

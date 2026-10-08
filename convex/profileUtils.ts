import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { clean, validateCnic, validatePhone } from "./helpers";

export type ProfileFields = {
  fullName: string;
  fatherName: string;
  cnic: string;
  dateOfBirth: string;
  address: string;
  instituteName: string;
  program: string;
  contactNumber: string;
  email?: string;
  bankAccountDetails?: string;
};

export async function persistStudentProfile(ctx: MutationCtx, studentId: Id<"appUsers">, args: ProfileFields) {
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
  const profileId = await ctx.db.insert("studentProfiles", { ...data, userId: studentId, createdAt: now });
  const application = await ctx.db.query("applications").withIndex("by_studentId", q => q.eq("studentId", studentId)).unique();
  if (!application) await ctx.db.insert("applications", { studentId, status: "pending", submittedAt: now, updatedAt: now });
  return { studentId, profileId };
}

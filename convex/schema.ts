import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
const applicationStatus = v.union(v.literal("pending"), v.literal("under_review"), v.literal("approved"), v.literal("rejected"));
const paymentStatus = v.union(v.literal("pending"), v.literal("partial"), v.literal("paid"));
export default defineSchema({
  ...authTables,
  appUsers: defineTable({ authUserId: v.optional(v.id("users")), role: v.union(v.literal("student"), v.literal("admin")), authMethod: v.optional(v.union(v.literal("email"), v.literal("phone"))), accountType: v.optional(v.union(v.literal("self_registered"), v.literal("admin_added"))), createdAt: v.number(), updatedAt: v.number() }).index("by_authUserId", ["authUserId"]).index("by_role", ["role"]),
  studentProfiles: defineTable({ userId: v.id("appUsers"), fullName: v.string(), fatherName: v.string(), guardianName: v.optional(v.string()), cnic: v.optional(v.string()), dateOfBirth: v.optional(v.string()), address: v.optional(v.string()), instituteName: v.string(), program: v.string(), contactNumber: v.optional(v.string()), email: v.optional(v.string()), bankAccountDetails: v.optional(v.string()), createdAt: v.number(), updatedAt: v.number() }).index("by_userId", ["userId"]).index("by_instituteName", ["instituteName"]).index("by_program", ["program"]).index("by_cnic", ["cnic"]),
  documents: defineTable({ studentId: v.id("appUsers"), type: v.union(v.literal("cnic"), v.literal("income_certificate"), v.literal("photo"), v.literal("bank_details"), v.literal("result")), storageId: v.id("_storage"), fileName: v.string(), mimeType: v.string(), size: v.number(), termId: v.optional(v.id("terms")), uploadedAt: v.number() }).index("by_studentId", ["studentId"]).index("by_studentId_and_type", ["studentId", "type"]).index("by_termId", ["termId"]),
  applications: defineTable({ studentId: v.id("appUsers"), status: applicationStatus, reviewedBy: v.optional(v.id("appUsers")), reviewNotes: v.optional(v.string()), submittedAt: v.number(), reviewedAt: v.optional(v.number()), updatedAt: v.number() }).index("by_studentId", ["studentId"]).index("by_status", ["status"]),
  terms: defineTable({ studentId: v.id("appUsers"), termName: v.string(), resultStorageId: v.optional(v.id("_storage")), resultFileName: v.optional(v.string()), paymentStatus, amountPaid: v.number(), amountDue: v.number(), paymentDate: v.optional(v.string()), notes: v.optional(v.string()), createdBy: v.id("appUsers"), createdAt: v.number(), updatedAt: v.number() }).index("by_studentId", ["studentId"]).index("by_studentId_and_paymentStatus", ["studentId", "paymentStatus"]).index("by_paymentStatus", ["paymentStatus"]),
  notifications: defineTable({ userId: v.id("appUsers"), title: v.string(), message: v.string(), type: v.union(v.literal("application"), v.literal("payment"), v.literal("term"), v.literal("system")), isRead: v.boolean(), createdAt: v.number() }).index("by_userId", ["userId"]).index("by_userId_and_isRead", ["userId", "isRead"]),
  students: defineTable({
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
  }),
});

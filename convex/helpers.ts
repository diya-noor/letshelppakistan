import { getAuthUserId } from "@convex-dev/auth/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
type Ctx = QueryCtx | MutationCtx;
export async function requireAppUser(ctx: Ctx): Promise<Doc<"appUsers">> { const authUserId = await getAuthUserId(ctx); if (!authUserId) throw new Error("Not authenticated"); const user = await ctx.db.query("appUsers").withIndex("by_authUserId", q => q.eq("authUserId", authUserId)).unique(); if (!user) throw new Error("Account setup is incomplete"); return user; }
export async function requireAdmin(ctx: Ctx) { const user = await requireAppUser(ctx); if (user.role !== "admin") throw new Error("Admin access required"); return user; }
export function clean(value: string, label: string, max = 300) { const result = value.trim(); if (!result) throw new Error(`${label} is required`); if (result.length > max) throw new Error(`${label} is too long`); return result; }
export function validateCnic(value: string) { const compact = value.replace(/-/g, ""); if (!/^\d{13}$/.test(compact)) throw new Error("CNIC/B-Form must contain 13 digits"); return `${compact.slice(0,5)}-${compact.slice(5,12)}-${compact.slice(12)}`; }
export function validatePhone(value: string) { const compact = value.replace(/[\s()-]/g, ""); if (!/^(?:\+92|92|0)3\d{9}$/.test(compact)) throw new Error("Enter a valid Pakistani phone number"); return compact.startsWith("+92") ? compact : compact.startsWith("92") ? `+${compact}` : `+92${compact.slice(1)}`; }
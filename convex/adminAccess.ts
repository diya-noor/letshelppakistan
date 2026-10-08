import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const makeAdmin = internalMutation({
  args: {},
  returns: v.object({
    appUserId: v.id("appUsers"),
    authUserId: v.id("users"),
    email: v.string(),
    role: v.literal("admin"),
  }),
  handler: async (ctx) => {
    const email = "iqtidarturi@gmail.com";

    const authUsers = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .take(2);

    if (authUsers.length === 0) {
      throw new Error(`No registered auth account found for ${email}`);
    }
    if (authUsers.length > 1) {
      throw new Error(`Multiple auth accounts found for ${email}; resolve the duplicate before assigning admin access`);
    }

    const authUser = authUsers[0];
    const existing = await ctx.db
      .query("appUsers")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", authUser._id))
      .unique();
    const now = Date.now();

    const appUserId = existing
      ? existing._id
      : await ctx.db.insert("appUsers", {
          authUserId: authUser._id,
          role: "admin",
          authMethod: "email",
          accountType: "self_registered",
          createdAt: now,
          updatedAt: now,
        });

    if (existing) {
      await ctx.db.patch(existing._id, {
        role: "admin",
        authMethod: existing.authMethod ?? "email",
        accountType: existing.accountType ?? "self_registered",
        updatedAt: now,
      });
    }

    return { appUserId, authUserId: authUser._id, email, role: "admin" as const };
  },
});

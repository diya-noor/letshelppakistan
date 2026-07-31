import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAppUser } from "./helpers";
export const listMine = query({ args: {}, returns: v.any(), handler: async ctx => { const user = await requireAppUser(ctx); return await ctx.db.query("notifications").withIndex("by_userId", q => q.eq("userId", user._id)).order("desc").take(50); } });
export const markRead = mutation({ args: { notificationId: v.id("notifications") }, returns: v.null(), handler: async (ctx,args) => { const user = await requireAppUser(ctx); const item = await ctx.db.get(args.notificationId); if (!item || item.userId !== user._id) throw new Error("Notification not found"); await ctx.db.patch(item._id,{isRead:true}); return null; } });
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const RATE_WINDOW_MS = 60_000;
const MAX_SUBMISSIONS_PER_WINDOW = 5;
const MAX_RESONANCE_PER_WINDOW = 40;

export const create = mutation({
  args: {
    text: v.string(),
    relatedNodeIds: v.array(v.string()),
    visitorId: v.string(),
  },
  returns: v.id("submissions"),
  handler: async (ctx, args) => {
    const text = args.text.trim();
    if (text.length < 20) {
      throw new Error("Share a bit more — at least a sentence or two.");
    }
    if (text.length > 4000) {
      throw new Error("Keep it under 4000 characters.");
    }
    if (args.visitorId.length < 8 || args.visitorId.length > 128) {
      throw new Error("Invalid visitor id.");
    }
    if (args.relatedNodeIds.length > 12) {
      throw new Error("Pick up to 12 related patterns.");
    }

    const recent = await ctx.db
      .query("submissions")
      .withIndex("by_visitor", (q) => q.eq("visitorId", args.visitorId))
      .collect();
    const cutoff = Date.now() - RATE_WINDOW_MS;
    const recentCount = recent.filter((s) => s.createdAt > cutoff).length;
    if (recentCount >= MAX_SUBMISSIONS_PER_WINDOW) {
      throw new Error("Slow down — try again in a minute.");
    }

    return await ctx.db.insert("submissions", {
      text,
      relatedNodeIds: args.relatedNodeIds,
      visitorId: args.visitorId,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const listMapped = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("submissions"),
      text: v.string(),
      relatedNodeIds: v.array(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("mapped"),
        v.literal("rejected"),
      ),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("submissions")
      .withIndex("by_status", (q) => q.eq("status", "mapped"))
      .collect();
    return rows
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 50)
      .map(({ _id, text, relatedNodeIds, status, createdAt }) => ({
        _id,
        text,
        relatedNodeIds,
        status,
        createdAt,
      }));
  },
});

export const listPending = query({
  args: { adminSecret: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("submissions"),
      text: v.string(),
      relatedNodeIds: v.array(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("mapped"),
        v.literal("rejected"),
      ),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const expected = process.env.ADMIN_SECRET;
    if (!expected || args.adminSecret !== expected) {
      throw new Error("Unauthorized");
    }
    const rows = await ctx.db
      .query("submissions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return rows
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(({ _id, text, relatedNodeIds, status, createdAt }) => ({
        _id,
        text,
        relatedNodeIds,
        status,
        createdAt,
      }));
  },
});

export const setStatus = mutation({
  args: {
    adminSecret: v.string(),
    id: v.id("submissions"),
    status: v.union(
      v.literal("pending"),
      v.literal("mapped"),
      v.literal("rejected"),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const expected = process.env.ADMIN_SECRET;
    if (!expected || args.adminSecret !== expected) {
      throw new Error("Unauthorized");
    }
    await ctx.db.patch(args.id, { status: args.status });
    return null;
  },
});

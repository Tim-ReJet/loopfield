import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const RATE_WINDOW_MS = 60_000;
const MAX_RESONANCE_PER_WINDOW = 40;

export const vote = mutation({
  args: {
    nodeId: v.string(),
    signal: v.union(
      v.literal("know"),
      v.literal("not_me"),
      v.literal("close"),
    ),
    visitorId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (args.nodeId.length < 2 || args.nodeId.length > 80) {
      throw new Error("Invalid node.");
    }
    if (args.visitorId.length < 8 || args.visitorId.length > 128) {
      throw new Error("Invalid visitor id.");
    }

    const existing = await ctx.db
      .query("resonance")
      .withIndex("by_visitor_node", (q) =>
        q.eq("visitorId", args.visitorId).eq("nodeId", args.nodeId),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        signal: args.signal,
        createdAt: Date.now(),
      });
      return null;
    }

    const recent = await ctx.db
      .query("resonance")
      .withIndex("by_visitor_node", (q) => q.eq("visitorId", args.visitorId))
      .collect();
    const cutoff = Date.now() - RATE_WINDOW_MS;
    if (recent.filter((r) => r.createdAt > cutoff).length >= MAX_RESONANCE_PER_WINDOW) {
      throw new Error("Slow down — try again in a minute.");
    }

    await ctx.db.insert("resonance", {
      nodeId: args.nodeId,
      signal: args.signal,
      visitorId: args.visitorId,
      createdAt: Date.now(),
    });
    return null;
  },
});

export const countsForNode = query({
  args: { nodeId: v.string() },
  returns: v.object({
    know: v.number(),
    not_me: v.number(),
    close: v.number(),
  }),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("resonance")
      .withIndex("by_node", (q) => q.eq("nodeId", args.nodeId))
      .collect();
    const counts = { know: 0, not_me: 0, close: 0 };
    for (const row of rows) {
      counts[row.signal] += 1;
    }
    return counts;
  },
});

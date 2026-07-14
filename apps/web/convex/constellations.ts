import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { visitorId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("constellations"),
      visitorId: v.string(),
      nodeIds: v.array(v.string()),
      updatedAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("constellations")
      .withIndex("by_visitor", (q) => q.eq("visitorId", args.visitorId))
      .unique();
    if (!row) return null;
    return {
      _id: row._id,
      visitorId: row.visitorId,
      nodeIds: row.nodeIds,
      updatedAt: row.updatedAt,
    };
  },
});

export const save = mutation({
  args: {
    visitorId: v.string(),
    nodeIds: v.array(v.string()),
  },
  returns: v.id("constellations"),
  handler: async (ctx, args) => {
    if (args.visitorId.length < 8 || args.visitorId.length > 128) {
      throw new Error("Invalid visitor id.");
    }
    if (args.nodeIds.length > 44) {
      throw new Error("Constellation too large.");
    }
    const existing = await ctx.db
      .query("constellations")
      .withIndex("by_visitor", (q) => q.eq("visitorId", args.visitorId))
      .unique();
    const updatedAt = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        nodeIds: args.nodeIds,
        updatedAt,
      });
      return existing._id;
    }
    return await ctx.db.insert("constellations", {
      visitorId: args.visitorId,
      nodeIds: args.nodeIds,
      updatedAt,
    });
  },
});

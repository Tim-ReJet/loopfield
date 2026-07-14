import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  submissions: defineTable({
    text: v.string(),
    relatedNodeIds: v.array(v.string()),
    visitorId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("mapped"),
      v.literal("rejected"),
    ),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_visitor", ["visitorId"]),

  resonance: defineTable({
    nodeId: v.string(),
    signal: v.union(
      v.literal("know"),
      v.literal("not_me"),
      v.literal("close"),
    ),
    visitorId: v.string(),
    createdAt: v.number(),
  })
    .index("by_node", ["nodeId"])
    .index("by_visitor_node", ["visitorId", "nodeId"]),

  constellations: defineTable({
    visitorId: v.string(),
    nodeIds: v.array(v.string()),
    updatedAt: v.number(),
  }).index("by_visitor", ["visitorId"]),
});

import { query } from "./_generated/server";
import { v } from "convex/values";

export const ping = query({
  args: {},
  returns: v.object({ ok: v.boolean() }),
  handler: async () => ({ ok: true }),
});

import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const protectedProcedure = tRPCContext.procedure.use(async (opts) => {
  const {ctx} = opts;

  const userId = (ctx as any).userId;
  
  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in" });
  }

  return opts.next({
    ctx: {
      ...ctx,
      userId,
    },
  });
});
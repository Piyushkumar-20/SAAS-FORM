import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { verifyToken } from "./utils/jwt";

export async function createContext({ req }: CreateExpressContextOptions) {
  let userId: string | null = null;

  const token = req.headers.authorization?.split(" ")[1]; // Get "Bearer <token>"

  if (token) {
    try {
      const decoded = await verifyToken(token);
      userId = decoded.userId;
    } catch (err) {
      // Invalid token, userId stays null
    }
  }

  return { userId };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { env } from "./env";
import path from "path";

config({ path: path.resolve(__dirname, "../../.env") });

export default defineConfig({
  out: "./drizzle",
  schema: "./schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});

import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  index,
} from "drizzle-orm/pg-core";
import { userRoleEnum, subscriptionPlanEnum } from "./enums";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    fullName: varchar("full_name", { length: 80 }).notNull(),

    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    emailVerified: boolean("email_verified").default(false),
    emailVerificationToken: text("email_verification_token"),

    profileImageUrl: text("profile_image_url"),

    role: userRoleEnum("role").default("USER").notNull(),
    subscriptionPlan: subscriptionPlanEnum("subscription_plan").default("FREE").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  }),
);

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

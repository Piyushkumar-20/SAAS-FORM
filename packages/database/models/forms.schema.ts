import {
  pgTable,
  text,
  timestamp,
  jsonb,
  uuid,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { formStatusEnum, visibilityEnum } from "./enums";

export const forms = pgTable(
  "forms",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creatorId: uuid("creator_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    description: text("description"),
    slug: text("slug").notNull().unique(),
    status: formStatusEnum("status").notNull().default("DRAFT"),
    visibility: visibilityEnum("visibility").default("unlisted").notNull(),

    themeSettings: jsonb("theme_settings")
      .$type<{
        backgroundColor: string;
        textColor: string;
        accentColor: string;
        fontFamily: string;
        backgroundImage?: string;
      }>()
      .notNull(),

    isPasswordProtected: boolean("is_password_protected").default(false).notNull(),
    passwordHash: text("password_hash"),

    isTemplate: boolean("is_template").default(false).notNull(),

    expiresAt: timestamp("expires_at"),
    responsesLimit: integer("responses_limit"),

    emailNotifications: jsonb("email_notifications")
      .$type<{
        notifyOnResponse: boolean;
        notificationEmails: string[];
      }>()
      .default({ notifyOnResponse: false, notificationEmails: [] })
      .notNull(),

    viewCount: integer("view_count").default(0).notNull(),
    submissionCount: integer("submission_count").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    creatorIdx: index("forms_creator_id_idx").on(table.creatorId),
    slugIdx: index("forms_slug_idx").on(table.slug),
    statusIdx: index("forms_status_idx").on(table.status),
    visibilityIdx: index("forms_visibility_idx").on(table.visibility),
  }),
);

export type SelectForm = typeof forms.$inferSelect;
export type InsertForm = typeof forms.$inferInsert;
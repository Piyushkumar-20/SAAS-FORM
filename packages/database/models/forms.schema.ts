import {
  pgTable,
  text,
  timestamp,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { fromStatusEnum, visibilityEnum } from "./enums";

export const forms = pgTable("forms", {
  id: uuid("id").defaultRandom().primaryKey(),
  creatorId: uuid("creator_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  status: fromStatusEnum("status").notNull().default("DRAFT"),
  visibility: visibilityEnum("visibility").default("private").notNull(),
  themeSettings: jsonb("theme_settings")
    .$type<{
      backgroundColor: string;
      textColor: string;
      accentColor: string;
      fontFamily: string;
      backgroundImage?: string;
    }>()
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SelectForm =
  typeof forms.$inferSelect;

export type InsertForm =
  typeof forms.$inferInsert;
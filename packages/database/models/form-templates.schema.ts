import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const formTemplates = pgTable(
  "form_templates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creatorId: uuid("creator_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    description: text("description"),
    category: text("category").notNull(), // e.g., "movies", "anime", "games", "startups"
    thumbnail: text("thumbnail"),

    fieldSchema: jsonb("field_schema")
      .$type<
        Array<{
          type: string;
          label: string;
          helpText?: string;
          placeholder?: string;
          isRequired: boolean;
          validationRules?: Record<string, unknown>;
        }>
      >()
      .notNull(),

    themeSettings: jsonb("theme_settings")
      .$type<{
        backgroundColor: string;
        textColor: string;
        accentColor: string;
        fontFamily: string;
        backgroundImage?: string;
      }>()
      .notNull(),

    isPublic: boolean("is_public").default(false).notNull(),
    usageCount: integer("usage_count").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    creatorIdx: index("templates_creator_id_idx").on(table.creatorId),
    categoryIdx: index("templates_category_idx").on(table.category),
    isPublicIdx: index("templates_is_public_idx").on(table.isPublic),
  }),
);

export type SelectFormTemplate = typeof formTemplates.$inferSelect;
export type InsertFormTemplate = typeof formTemplates.$inferInsert;

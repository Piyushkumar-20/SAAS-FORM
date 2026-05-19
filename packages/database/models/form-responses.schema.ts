import { pgTable, uuid, timestamp, jsonb, text, boolean, varchar, index } from "drizzle-orm/pg-core";

import { forms } from "./forms.schema";

export const formResponses = pgTable(
  "form_responses",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    formsId: uuid("forms_id")
      .references(() => forms.id, { onDelete: "cascade" })
      .notNull(),

    respondentName: varchar("respondent_name", { length: 255 }),
    respondentEmail: varchar("respondent_email", { length: 255 }),

    submittedAt: timestamp("submitted_at").defaultNow().notNull(),

    metaData: jsonb("meta_data")
      .$type<{
        browser: string;
        ipHash: string;
        os: string;
        durationMs: number;
        userAgent?: string;
      }>()
      .notNull(),

    isSpam: boolean("is_spam").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    formsIdx: index("responses_forms_id_idx").on(table.formsId),
    submittedAtIdx: index("responses_submitted_at_idx").on(table.submittedAt),
  }),
);

export type SelectFormResponse = typeof formResponses.$inferSelect;
export type InsertFormResponse = typeof formResponses.$inferInsert;
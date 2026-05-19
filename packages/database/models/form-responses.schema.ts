import { pgTable, uuid, timestamp, jsonb, index } from "drizzle-orm/pg-core";

import { forms } from "./forms.schema";

export const formResponses = pgTable("form_responses", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  formsId: uuid("forms_id").references(() => forms.id, { onDelete: "cascade" }),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  metaData: jsonb("meta_data")
    .$type<{
      browser: string;
      ipHash: string;
      os: string;
      durationMs: number;
    }>()
    .notNull(),
});

export type SelectFormResponse = typeof formResponses.$inferSelect;
export type InsertFormResponse = typeof formResponses.$inferInsert;
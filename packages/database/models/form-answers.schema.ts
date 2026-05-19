import { pgTable, uuid, jsonb, timestamp, index } from "drizzle-orm/pg-core";

import { formResponses } from "./form-responses.schema";
import { formFieldTable } from "./form-fields.schema";

export const formAnswer = pgTable(
  "form_answers",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    responseId: uuid("response_id")
      .references(() => formResponses.id, { onDelete: "cascade" })
      .notNull(),
    fieldId: uuid("field_id")
      .references(() => formFieldTable.id, { onDelete: "cascade" })
      .notNull(),
    value: jsonb("value").$type<string | string[] | number | null>().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    responseIdx: index("answers_response.id_idx").on(table.responseId),
    fieldIdx: index("answers_field.id_idx").on(table.fieldId),
  }),
);

export type SelectFormAnswer = typeof formAnswer.$inferSelect;
export type InsertFormAnswer = typeof formAnswer.$inferInsert;

import {
  pgTable,
  uuid,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { forms } from "./forms.schema";

export const formClones = pgTable(
  "form_clones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    originalFormId: uuid("original_form_id")
      .references(() => forms.id, { onDelete: "cascade" })
      .notNull(),
    clonedFormId: uuid("cloned_form_id")
      .references(() => forms.id, { onDelete: "cascade" })
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    originalIdx: index("clones_original_form_id_idx").on(table.originalFormId),
    clonedIdx: index("clones_cloned_form_id_idx").on(table.clonedFormId),
  }),
);

export type SelectFormClone = typeof formClones.$inferSelect;
export type InsertFormClone = typeof formClones.$inferInsert;

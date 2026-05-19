import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { forms } from "./forms.schema";
import { fieldTypesEnum } from "./enums";

export const formFieldTable = pgTable(
  "form_fields",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    formId: uuid("form_id")
      .references(() => forms.id, {
        onDelete: "cascade",
      })
      .notNull(),
    type: fieldTypesEnum("type").notNull(),
    label: text("label").notNull(),
    helpText: text("help_text"),
    placeholder: text("placeholder"),
    displayOrder: integer("display_order").notNull(),
    isRequired: boolean("is_required").default(false).notNull(),
    defaultValue: jsonb("default_value"),
    validationRules: jsonb("validation_rules")
      .$type<{
        minLength?: number;
        maxLength?: number;

        minValue?: number;
        maxValue?: number;
      }>()
      .default({})
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    formIdx: index("fields_form_id_idx").on(table.formId),
    orderIdx: index("fields_display_order_idx").on(table.displayOrder),
  }),
);
export type SelectFormField = typeof formFieldTable.$inferSelect;

export type InsertFormField = typeof formFieldTable.$inferInsert;

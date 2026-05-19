import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { forms } from "./forms.schema";
import { formResponses } from "./form-responses.schema";
import { emailLogStatusEnum, notificationTypeEnum } from "./enums";

export const emailLogs = pgTable(
  "email_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    formsId: uuid("forms_id")
      .references(() => forms.id, { onDelete: "cascade" })
      .notNull(),
    responseId: uuid("response_id")
      .references(() => formResponses.id, { onDelete: "set null" }),

    recipientEmail: varchar("recipient_email", { length: 255 }).notNull(),
    notificationType: notificationTypeEnum("notification_type").notNull(),

    subject: text("subject").notNull(),
    body: text("body").notNull(),

    status: emailLogStatusEnum("status").default("PENDING").notNull(),
    errorMessage: text("error_message"),

    sentAt: timestamp("sent_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    formsIdx: index("email_logs_forms_id_idx").on(table.formsId),
    responseIdx: index("email_logs_response_id_idx").on(table.responseId),
    statusIdx: index("email_logs_status_idx").on(table.status),
    createdAtIdx: index("email_logs_created_at_idx").on(table.createdAt),
  }),
);

export type SelectEmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

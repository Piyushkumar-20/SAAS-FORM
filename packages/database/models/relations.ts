import { relations } from "drizzle-orm";

import { users } from "./user.schema";

import { forms } from "./forms.schema";

import { formFieldTable } from "./form-fields.schema";

import { formResponses } from "./form-responses.schema";

import { formAnswer } from "./form-answers.schema";

export const usersRelations = relations(users, ({ many }) => ({
  forms: many(forms),
}));

export const formsRelations = relations(forms, ({ one, many }) => ({
  creator: one(users, {
    fields: [forms.creatorId],
    references: [users.id],
  }),

  fields: many(formFieldTable),

  responses: many(formResponses),
}));

export const formFieldsRelations = relations(formFieldTable, ({ one }) => ({
  form: one(forms, {
    fields: [formFieldTable.formId],
    references: [forms.id],
  }),
}));

export const formResponsesRelations = relations(formResponses, ({ one, many }) => ({
  form: one(forms, {
    fields: [formResponses.formsId],
    references: [forms.id],
  }),

  answers: many(formAnswer),
}));

export const formAnswersRelations = relations(formAnswer, ({ one }) => ({
  response: one(formResponses, {
    fields: [formAnswer.responseId],
    references: [formResponses.id],
  }),

  field: one(formFieldTable, {
    fields: [formAnswer.fieldId],
    references: [formFieldTable.id],
  }),
}));

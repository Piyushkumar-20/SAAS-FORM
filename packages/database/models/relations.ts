import { relations } from "drizzle-orm";

import { users } from "./user.schema";
import { forms } from "./forms.schema";
import { formFieldTable } from "./form-fields.schema";
import { formResponses } from "./form-responses.schema";
import { formAnswer } from "./form-answers.schema";
import { formTemplates } from "./form-templates.schema";
import { emailLogs } from "./email-logs.schema";
import { formClones } from "./form-clones.schema";

export const usersRelations = relations(users, ({ many }) => ({
  forms: many(forms),
  templates: many(formTemplates),
  emailLogs: many(emailLogs),
}));

export const formsRelations = relations(forms, ({ one, many }) => ({
  creator: one(users, {
    fields: [forms.creatorId],
    references: [users.id],
  }),

  fields: many(formFieldTable),
  responses: many(formResponses),
  emailLogs: many(emailLogs),

  originalClones: many(formClones, { relationName: "original" }),
  clonedForms: many(formClones, { relationName: "cloned" }),
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
  emailLogs: many(emailLogs),
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

export const formTemplatesRelations = relations(formTemplates, ({ one }) => ({
  creator: one(users, {
    fields: [formTemplates.creatorId],
    references: [users.id],
  }),
}));

export const emailLogsRelations = relations(emailLogs, ({ one }) => ({
  form: one(forms, {
    fields: [emailLogs.formsId],
    references: [forms.id],
  }),

  response: one(formResponses, {
    fields: [emailLogs.responseId],
    references: [formResponses.id],
  }),
}));

export const formClonesRelations = relations(formClones, ({ one }) => ({
  originalForm: one(forms, {
    fields: [formClones.originalFormId],
    references: [forms.id],
    relationName: "original",
  }),

  clonedForm: one(forms, {
    fields: [formClones.clonedFormId],
    references: [forms.id],
    relationName: "cloned",
  }),
}));

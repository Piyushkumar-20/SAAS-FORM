import { pgEnum } from "drizzle-orm/pg-core";

export const visibilityEnum = pgEnum("visibility", ["public", "unlisted"]);

export const formStatusEnum = pgEnum("form_status", ["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const fieldTypesEnum = pgEnum("field_types", [
  "SHORT_TEXT",
  "LONG_TEXT",
  "NUMBER",
  "EMAIL",
  "DATE",
  "SINGLE_SELECT",
  "MULTI_SELECT",
  "CHECKBOX",
  "RATING",
]);

export const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN"]);

export const subscriptionPlanEnum = pgEnum("subscription_plan", ["FREE", "PRO", "ENTERPRISE"]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "FORM_RESPONSE",
  "FORM_PUBLISHED",
  "RESPONDENT_CONFIRMATION",
]);

export const emailLogStatusEnum = pgEnum("email_log_status", ["PENDING", "SENT", "FAILED"]);
import { pgEnum } from "drizzle-orm/pg-core";

export const visibilityEnum = pgEnum("visibility", ["public", "private"]);

export const fromStatusEnum = pgEnum("from-status", ["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const fieldTypesEnum = pgEnum("field-types", [
  "SHORT_TEXT",
  "LONG_TEXT",
  "NUMBER",
  "DATE",
  "SINGLE_SELECT",
  "MULTI_SELECT",
  "CHECKBOX",
  "RATING",
]);
CREATE TYPE "public"."email_log_status" AS ENUM('PENDING', 'SENT', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."field_types" AS ENUM('SHORT_TEXT', 'LONG_TEXT', 'NUMBER', 'EMAIL', 'DATE', 'SINGLE_SELECT', 'MULTI_SELECT', 'CHECKBOX', 'RATING');--> statement-breakpoint
CREATE TYPE "public"."form_status" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('FORM_RESPONSE', 'FORM_PUBLISHED', 'RESPONDENT_CONFIRMATION');--> statement-breakpoint
CREATE TYPE "public"."subscription_plan" AS ENUM('FREE', 'PRO', 'ENTERPRISE');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "form_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"thumbnail" text,
	"field_schema" jsonb NOT NULL,
	"theme_settings" jsonb NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"forms_id" uuid NOT NULL,
	"response_id" uuid,
	"recipient_email" varchar(255) NOT NULL,
	"notification_type" "notification_type" NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"status" "email_log_status" DEFAULT 'PENDING' NOT NULL,
	"error_message" text,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_clones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_form_id" uuid NOT NULL,
	"cloned_form_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "visibility" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "visibility" SET DEFAULT 'unlisted'::text;--> statement-breakpoint
DROP TYPE "public"."visibility";--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('public', 'unlisted');--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "visibility" SET DEFAULT 'unlisted'::"public"."visibility";--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "visibility" SET DATA TYPE "public"."visibility" USING "visibility"::"public"."visibility";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "status" SET DATA TYPE "public"."form_status" USING "status"::text::"public"."form_status";--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "status" SET DEFAULT 'DRAFT';--> statement-breakpoint
ALTER TABLE "form_fields" ALTER COLUMN "type" SET DATA TYPE "public"."field_types" USING "type"::text::"public"."field_types";--> statement-breakpoint
ALTER TABLE "form_responses" ALTER COLUMN "forms_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verification_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'USER' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_plan" "subscription_plan" DEFAULT 'FREE' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "is_password_protected" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "is_template" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "responses_limit" integer;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "email_notifications" jsonb DEFAULT '{"notifyOnResponse":false,"notificationEmails":[]}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "view_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "submission_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "form_responses" ADD COLUMN "respondent_name" varchar(255);--> statement-breakpoint
ALTER TABLE "form_responses" ADD COLUMN "respondent_email" varchar(255);--> statement-breakpoint
ALTER TABLE "form_responses" ADD COLUMN "is_spam" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "form_responses" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "form_templates" ADD CONSTRAINT "form_templates_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_forms_id_forms_id_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_response_id_form_responses_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."form_responses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_clones" ADD CONSTRAINT "form_clones_original_form_id_forms_id_fk" FOREIGN KEY ("original_form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_clones" ADD CONSTRAINT "form_clones_cloned_form_id_forms_id_fk" FOREIGN KEY ("cloned_form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "templates_creator_id_idx" ON "form_templates" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "templates_category_idx" ON "form_templates" USING btree ("category");--> statement-breakpoint
CREATE INDEX "templates_is_public_idx" ON "form_templates" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "email_logs_forms_id_idx" ON "email_logs" USING btree ("forms_id");--> statement-breakpoint
CREATE INDEX "email_logs_response_id_idx" ON "email_logs" USING btree ("response_id");--> statement-breakpoint
CREATE INDEX "email_logs_status_idx" ON "email_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "email_logs_created_at_idx" ON "email_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "clones_original_form_id_idx" ON "form_clones" USING btree ("original_form_id");--> statement-breakpoint
CREATE INDEX "clones_cloned_form_id_idx" ON "form_clones" USING btree ("cloned_form_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "forms_creator_id_idx" ON "forms" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "forms_slug_idx" ON "forms" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "forms_status_idx" ON "forms" USING btree ("status");--> statement-breakpoint
CREATE INDEX "forms_visibility_idx" ON "forms" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "responses_forms_id_idx" ON "form_responses" USING btree ("forms_id");--> statement-breakpoint
CREATE INDEX "responses_submitted_at_idx" ON "form_responses" USING btree ("submitted_at");--> statement-breakpoint
DROP TYPE "public"."field-types";--> statement-breakpoint
DROP TYPE "public"."from-status";
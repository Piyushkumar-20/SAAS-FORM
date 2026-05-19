CREATE TYPE "public"."field-types" AS ENUM('SHORT_TEXT', 'LONG_TEXT', 'NUMBER', 'DATE', 'SINGLE_SELECT', 'MULTI_SELECT', 'CHECKBOX', 'RATING');--> statement-breakpoint
CREATE TYPE "public"."from-status" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(80) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false,
	"profile_image_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "form_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"response_id" uuid NOT NULL,
	"field_id" uuid NOT NULL,
	"value" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"description" text,
	"slug" text NOT NULL,
	"status" "from-status" DEFAULT 'DRAFT' NOT NULL,
	"visibility" "visibility" DEFAULT 'private' NOT NULL,
	"theme_settings" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "forms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"type" "field-types" NOT NULL,
	"label" text NOT NULL,
	"help_text" text,
	"placeholder" text,
	"display_order" integer NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL,
	"default_value" jsonb,
	"validation_rules" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"forms_id" uuid,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"meta_data" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "form_answers" ADD CONSTRAINT "form_answers_response_id_form_responses_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."form_responses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_answers" ADD CONSTRAINT "form_answers_field_id_form_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."form_fields"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_forms_id_forms_id_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "answers_response.id_idx" ON "form_answers" USING btree ("response_id");--> statement-breakpoint
CREATE INDEX "answers_field.id_idx" ON "form_answers" USING btree ("field_id");--> statement-breakpoint
CREATE INDEX "fields_form_id_idx" ON "form_fields" USING btree ("form_id");--> statement-breakpoint
CREATE INDEX "fields_display_order_idx" ON "form_fields" USING btree ("display_order");
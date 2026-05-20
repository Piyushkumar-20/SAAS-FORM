import { z } from "zod";
export const zodUndefinedModel = z.undefined().describe("undefined");
export { z };

//  Seperate password Schema better for reuse
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least 1 capital letter")
  .regex(/[0-9]/, "Password must contain at least 1 number");

// SignupInput schema
export const SignupInput = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
  fullname: z.string().min(2, "Full name must contain at least 2 character"),
  password: passwordSchema,
});

export type SignupInputType = z.infer<typeof SignupInput>;

// LoginInput Schema
export const LoginInput = z.object({
  email: z.string().email("Invalid Email Format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInputType = z.infer<typeof LoginInput>;

// AuthOutput Schema
export const AuthOutput = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    fullname: z.string(),
    email: z.string().email(),
    role: z.enum(["USER", "ADMIN"]),
    subscriptionPlan: z.enum(["FREE", "PRO", "ENTERPRISE"]),
  }),
});

export type AuthOutputType = z.infer<typeof AuthOutput>;

// Form schemas

// Reusable theme
const themeSettingSchema = z.object({
  backgroundColor: z.string().default("#ffffff"),
  textColor: z.string().default("#000000"),
  accentColor: z.string().default("#007bff"),
  fontFamily: z.string().default("sans-serif"),
  backgroundImage: z.string().optional(),
});

// Create Form Input
export const CreateFormInput = z.object({
  title: z.string().min(1, "Title is required").max(200, "Maximum 200 is allowed"),
  description: z.string().max(1000).optional().nullable(),
  themeSettings: themeSettingSchema,
});

export type CreateFormInput = z.infer<typeof CreateFormInput>;

// update form input
export const UpdateFormInput = z.object({
  id: z.string().uuid("Invalid Form Id"),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  themeSettings: themeSettingSchema.partial().optional(),
});
export type UpdateFormInputType = z.infer<typeof UpdateFormInput>;

// PUBLISH FORM INPUT
export const PublishFormInput = z.object({
  id: z.string().uuid(),
  visibility: z.enum(["public", "unlisted"]),
});

export type PublishFormInputType = z.infer<typeof PublishFormInput>;

// FORM OUTPUT (what API returns)
export const FormOutput = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  visibility: z.enum(["public", "unlisted"]),
  creatorId: z.string().uuid(),
  themeSettings: themeSettingSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  viewCount: z.number(),
  submissionCount: z.number(),
});

export type FormOutputType = z.infer<typeof FormOutput>;

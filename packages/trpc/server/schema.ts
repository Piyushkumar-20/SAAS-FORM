import { z } from "zod";

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

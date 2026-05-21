import { z, zodUndefinedModel, SignupInput, LoginInput, AuthOutput } from "../../schema";
import { userService } from "../../services/user";
import { getAuthenticationMethodOutputSchema } from "@repo/services/user/model";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { signToken } from "../../utils/jwt";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  getSupportedAuthenticationProviders: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/supported-providers"),
        tags: TAGS,
      },
    })
    .input(zodUndefinedModel)
    .output(z.readonly(z.array(getAuthenticationMethodOutputSchema)))
    .query(async () => {
      const supportedMethods = await userService.getAuthenticationMethods();
      return supportedMethods;
    }),

  signup: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/signup"),
        tags: TAGS,
      },
    })
    .input(SignupInput)
    .output(AuthOutput)
    .mutation(async (opts) => {
      const { email, fullname, password } = opts.input;

      const existingUser = await userService.findUserByEmail(email);

      if (existingUser) {
        throw new Error("User already exists");
      }

      const user = await userService.createUser(
        email,
        fullname,
        password
      );

      if (!user) {
        throw new Error("Failed to create user");
      }

      const token = await signToken(user.id);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullName,
          role: "USER",
          subscriptionPlan: "FREE",
        },
      };
    }),

  login: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/login"),
        tags: TAGS,
      },
    })
    .input(LoginInput)
    .output(AuthOutput)
    .mutation(async (opts) => {
      const { email, password } = opts.input;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isValid = await userService.verifyPassword(
        password,
        user.password
      );

      if (!isValid) {
        throw new Error("Invalid credentials");
      }

      const token = await signToken(user.id);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullName,
          role: user.role,
          subscriptionPlan: user.subscriptionPlan,
        },
      };
    }),

  logout: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/logout"),
        tags: TAGS,
      },
    })
    .mutation(async () => {
      return {
        success: true,
      };
    }),

  getLoggedInUserInfo: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/me"),
        tags: TAGS,
      },
    })
    .query(async ({ ctx }) => {
      if (!ctx.userId) {
        throw new Error("Unauthorized");
      }

      const user = await userService.getUserById(ctx.userId);

      if (!user) {
        throw new Error("User not found");
      }

      return {
        id: user.id,
        email: user.email,
        fullname: user.fullName,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
      };
    }),
});
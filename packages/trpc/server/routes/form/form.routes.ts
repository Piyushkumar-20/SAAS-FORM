import { z } from "zod";
import { router, protectedProcedure } from "../../trpc";
import { formService } from "../../services/forms";
import { CreateFormInput, UpdateFormInput } from "../../schema";
import { TRPCError } from "@trpc/server";

export const formsRouter = router({
  // Create a new form
  create: protectedProcedure
    .input(CreateFormInput)
    .mutation(async ({ input, ctx }) => {
      try {
        const form = await formService.createForm({
          ...input,
          userId: ctx.userId,
        });
        return form;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create form",
        });
      }
    }),

  // Get all forms for current user
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const forms = await formService.getFormsByUserId(ctx.userId);
      return forms;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch forms",
      });
    }
  }),

  // Get single form by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const form = await formService.getFormById(input.id);

        if (!form) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Form not found",
          });
        }

        if (form.creatorId !== ctx.userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this form",
          });
        }

        return form;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch form",
        });
      }
    }),

  // Update form
  update: protectedProcedure
    .input(UpdateFormInput)
    .mutation(async ({ input, ctx }) => {
      try {
        const form = await formService.getFormById(input.id);

        if (!form) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Form not found",
          });
        }

        if (form.creatorId !== ctx.userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this form",
          });
        }

        const { id, ...updateData } = input;
        const updated = await formService.updateForm(id, {
          ...updateData,
          userId: ctx.userId,
        });
        return updated;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update form",
        });
      }
    }),

  // Delete form
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const form = await formService.getFormById(input.id);

        if (!form) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Form not found",
          });
        }

        if (form.creatorId !== ctx.userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this form",
          });
        }

        await formService.deleteForm(input.id, ctx.userId);
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete form",
        });
      }
    }),
});
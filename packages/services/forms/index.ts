import { db, eq, desc } from "@repo/database";
import { forms } from "@repo/database/schema";
import type {
  CreateFormInput,
  UpdateFormInputType,
  PublishFormInputType,
} from "@repo/trpc/server/schema";

class FormService {
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  public async createForm(creatorId: string, input: CreateFormInput) {
    const slug = this.generateSlug(input.title);
    const [form] = await db
      .insert(forms)
      .values({
        title: input.title,
        description: input.description,
        slug,
        creatorId,
        themeSettings: input.themeSettings,
      })
      .returning();
    return form;
  }

  public async getFormById(formId: string) {
    const [form] = await db.select().from(forms).where(eq(forms.id, formId)).limit(1);
    return form || null;
  }

  // READ - List user's forms
  public async listUserForms(creatorId: string, limit?: number, offset?: number) {
    const [formsList] = await db
      .select()
      .from(forms)
      .where(eq(forms.creatorId, creatorId))
      .orderBy(desc(forms.createdAt));
    return formsList;
  }

  // update form
  public async updateForm(formId: string, creatorId: string, input: UpdateFormInputType) {
    const form = await this.getFormById(formId);
    if (!form) {
      throw new Error("Form not found");
    }
    if (form.creatorId !== creatorId) {
      throw new Error("Unauthorized");
    }
    const [updatedForm] = await db
      .update(forms)
      .set({
        title: input.title ?? form.title,
        description: input.description ?? form.description,
        themeSettings: input.themeSettings
          ? { ...form.themeSettings, ...input.themeSettings }
          : form.themeSettings,
      })
      .where(eq(forms.id, formId))
      .returning();
    return updatedForm;
  }

  // delete form
  public async deleteForm(formId: string, creatorId: string) {
    const form = await this.getFormById(formId);
    if (!form) {
      throw new Error("Form not found");
    }
    if (form.creatorId !== creatorId) {
      throw new Error("Unauthorized");
    }
    await db.delete(forms).where(eq(forms.id, formId));
    return true;
  }

    // PUBLISH
  public async publishForm(
    formId: string,
    creatorId: string,
    visibility: "public" | "unlisted" | undefined,
    input: PublishFormInputType
  ) {
    const form = await this.getFormById(formId);
    if (!form) {
      throw new Error("Form not found");
    }
    if (form.creatorId !== creatorId) {
        throw new Error("Unauthorized");
    }
        const [updatedForm] = await db
        .update(forms)
        .set({
            status: "PUBLISHED",
            visibility: visibility,
        })
        .where(eq(forms.id, formId))
        .returning();
    return updatedForm;
  }
}

export default FormService;
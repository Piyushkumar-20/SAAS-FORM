import FormService from "@repo/services/forms";

class FormServiceWrapper {
  private formService = new FormService();

  async createForm(input: any) {
    return this.formService.createForm(input.userId, {
      title: input.title,
      description: input.description,
      themeSettings: input.themeSettings,
    });
  }

  async getFormById(formId: string) {
    return this.formService.getFormById(formId);
  }

  async getFormsByUserId(userId: string) {
    return this.formService.listUserForms(userId);
  }

  async updateForm(formId: string, input: any) {
    return this.formService.updateForm(formId, input.userId || "", input);
  }

  async deleteForm(formId: string, userId: string) {
    return this.formService.deleteForm(formId, userId);
  }
}

export const formService = new FormServiceWrapper();

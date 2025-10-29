import { listResource } from '../utils/list-resource';
import prisma from "../config/prisma";
import { Template } from "@prisma/client";

export const TemplateService = {
  async getAllTemplates(query: any) {
    return listResource(
      'template',
      query,
      ['title', 'model_type'],
      {},
      { id: 'desc' },
    );
  },

  async getTemplatesToSelect() {
    return await prisma.template.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  },

  async createTemplate(data: Omit<Template, "id">): Promise<Template> {
    return await prisma.template.create({
      data: {
        ...data,
        model_type: data.model_type || 'Quotation', 
      },
    });
  },

    async getTemplateById(templateId: number) {
    return await prisma.template.findUnique({
      where: { id: templateId },
    });
  },

  async updateTemplate(
    templateId: number,
    data: Partial<Omit<Template, "id">>
  ): Promise<Template> {
    return await prisma.template.update({
      where: { id: templateId },
      data: {
        ...data,
      },
    });
  },

  async deleteTemplate(templateId: number): Promise<Template> {
    return await prisma.template.delete({
      where: { id: templateId },
    });
  },

}
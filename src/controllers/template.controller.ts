import { AuthenticatedRequest } from "../types/express";
import { Response } from "express";
import { TemplateService } from "../services/template.service";

/**
 * Controlador para manejar las operaciones relacionadas con las plantillas.
 * Permite listar, mostrar, crear, actualizar y eliminar plantillas.
 * Los servicios de plantilla se obtienen del servicio `template.service`.
 */
export const TemplateController = {
  async index(req: AuthenticatedRequest, res: Response) {
    const result = await TemplateService.getAllTemplates(req.query);
    res.json(result);
  },

  async select(req: AuthenticatedRequest, res: Response) {
    const templates = await TemplateService.getTemplatesToSelect();
    res.json(templates);
  },

    async show(req: AuthenticatedRequest, res: Response) {
        const template = await TemplateService.getTemplateById(+req.params.id);
        if (!template) {
            res.status(404).json({ error: "Plantilla no encontrada" });
            return;
        }
        res.json(template);
    },
    async create(req: AuthenticatedRequest, res: Response) {
        const data = req.body;
        const template = await TemplateService.createTemplate(data);
        res.status(201).json(template);
    },

    async update(req: AuthenticatedRequest, res: Response) {
        const templateId = +req.params.id;
        const data = req.body;
        const updatedTemplate = await TemplateService.updateTemplate(templateId, data);
        res.json(updatedTemplate);
    },

    async delete(req: AuthenticatedRequest, res: Response) {
        const templateId = +req.params.id;
        await TemplateService.deleteTemplate(templateId);
        res.status(204).send();
    },
};
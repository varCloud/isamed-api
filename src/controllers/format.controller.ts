import { AuthenticatedRequest } from "../types/express";
import { Response } from "express";
import { FormatService } from "../services/format.service";

/**
 * Controlador para manejar las operaciones relacionadas con los formatos.
 * Permite listar, mostrar, crear, actualizar y eliminar formatos.
 * Los servicios de formato se obtienen del servicio `format.service`.
 */

export const FormatController = {

    async index(req: AuthenticatedRequest, res: Response) {
        const result = await FormatService.getAllFormats(req.query);
        res.json(result);
    },

    async uploadFormat(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
         if (!req.file) {
      res.status(400).json({ message: 'No se subió ningún archivo' });
      return;
    }
      const { name } = req.params;
      console.log('Nombre del formato:', name);
      const data = {
        name, 
        ...req.body
        
      }
        const format = await FormatService.uploadFormat(req.file, data);
        res.status(201).json(format);
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al subir el formato', error: err });
    }
  },

  async serveFormat(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const format = await FormatService.serveFormat(parseInt(id));
    if (!format) {
      res.status(404).json({ message: 'Formato no encontrado' });
      return;
    }
   res.setHeader('Content-Disposition', `inline; filename="${format.file_name}"`);
  res.sendFile(format.file_path);
  },

  async delete(req: AuthenticatedRequest, res: Response) {
    const formatId = +req.params.id;
    await FormatService.deleteFormat(formatId);
    res.status(204).send();
  },

}
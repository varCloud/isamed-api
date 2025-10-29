import { PhotoService } from "../services/photo.service";
import { AuthenticatedRequest } from "../types/express";
import { Response } from "express";
import fs from "fs"
import path from "path";

/**
 * Controlador para manejar las operaciones relacionadas con las fotos.
 * Permite subir, servir, listar y eliminar fotos asociadas a entidades como órdenes y reportes de reparación.
 * Los servicios de foto se obtienen del servicio `photo.service`.
 */

export const PhotoController = {
    
  async uploadPhoto(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { entityType, entityId } = req.params;

    if (!req.file) {
      res.status(400).json({ message: 'No se subió ningún archivo' });
      return;
    }

    const photo = await PhotoService.uploadPhoto(
      req.file,
      entityType as 'Order' | 'Repair_report',
      parseInt(entityId)
    );

    res.status(201).json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al subir la foto', error: err });
  }
},

    
      async serveMedia(req: AuthenticatedRequest, res: Response): Promise<void> {
        const { id } = req.params;

        const photo = await PhotoService.servePhoto(parseInt(id));

        if (!photo) {
          res.status(404).json({ message: 'Foto no encontrada' });
          return;
        }

        const filePath = photo.file_path;

    
        const file = path.resolve(filePath);

        if (!fs.existsSync(file)) {
          res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
          return;
        }
        res.download(file);
      },

      async getPhotosByEntity(req: AuthenticatedRequest, res: Response): Promise<void> {
        const { entityType, entityId } = req.params;
    
        const photos = await PhotoService.getPhotosByEntity(entityType as "Order" | "Repair_report", parseInt(entityId));
    
        res.status(200).json(photos);
      },

      async deletePhoto(req: AuthenticatedRequest, res: Response): Promise<void> {
        const { id } = req.params;
    
        try {
          const deletedPhoto = await PhotoService.deletePhoto(parseInt(id));
          res.status(200).json(deletedPhoto);
        } catch (error) {
          res.status(404).json({ message: 'Foto no encontrada', error: (error as Error).message });
        }
      },

    
}
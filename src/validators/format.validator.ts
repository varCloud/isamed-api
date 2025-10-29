import { z } from 'zod';
import type { Express } from 'express';

export const formatSchema = z.object({
  file: z.custom<Express.Multer.File>((file) => {
    if (!file || typeof file !== 'object') return false;

    const validExtensions = ['jpg', 'png', 'jpeg', 'gif', 'mp4', 'mov', 'pdf'];
    const ext = file.originalname.split('.').pop()?.toLowerCase();

    return ext && validExtensions.includes(ext);
  }, {
    message: 'Archivo requerido o extensión no permitida.',
  }),
});

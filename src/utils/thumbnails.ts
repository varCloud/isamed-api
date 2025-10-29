import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { Photo } from '@prisma/client';
export const generateThumbnailBase64 = async (photo: Photo): Promise<string | null> => {
  try {
    const folderName = (() => {
      switch (photo.photeable_type) {
        case 'Order':
          return 'order';
        case 'Repair_report':
          return 'repair-report';
        default:
          throw new Error('Invalid photoable type');
      }
    })();

    const baseDir = path.join(__dirname, '..', 'media', 'service', folderName, String(photo.photeable_id));
    const originalPath = path.join(baseDir, photo.file_name);
    const thumbPath = path.join(baseDir, `thumb-${photo.file_name}`);

    // Si ya existe thumbnail, solo lo leemos
    if (!fs.existsSync(thumbPath)) {
      await sharp(originalPath).resize(200).jpeg({ quality: 70 }).toFile(thumbPath);
    }

    const buffer = fs.readFileSync(thumbPath);
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error('Error generating thumbnail:', err);
    return null;
  }
}

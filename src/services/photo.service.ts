import prisma from "../config/prisma";
import { Photo } from "@prisma/client";
import { generateThumbnailBase64 } from "../utils/thumbnails";
import path from "path";
import fs from "fs";

export const PhotoService = {
  async createPhoto(data: Omit<Photo, "id">): Promise<Photo> {
    return prisma.photo.create({ data });
  },
  async uploadPhoto(
  file: Express.Multer.File,
  type: 'Order' | 'Repair_report',
  id: number
): Promise<Photo> {

  const allowedTypes = ['Order', 'Repair_report'];
  if (!allowedTypes.includes(type)) {
    throw new Error('Tipo inválido');
  }

  return prisma.photo.create({
    data: {
      photeable_id: id,
      photeable_type: type,
      file_name: file.filename,
      file_path: file.path,
      created_at: new Date(),
    },
  });
},

 async getPhotosByEntity(type: "Order" | "Repair_report", id: number): Promise<(Photo & { thumbnailBase64: string | null })[]> {
    const photos = await prisma.photo.findMany({
      where: { photeable_type: type, photeable_id: id },
      orderBy: { created_at: "desc" },
    });

    const result = await Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        thumbnailBase64: await generateThumbnailBase64(photo),
      }))
    );

    return result;
  },


  async servePhoto(id: number): Promise<Photo & { file_path: string } | null> {
    
    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) {
      console.log(`Foto con ID ${id} no encontrada en la base de datos`);
      throw new Error("Photo not found");
    }

    const filePath = photo.file_path;
    

    
    if (!fs.existsSync(filePath)) {
      console.error(`Archivo no encontrado en: ${filePath}`);
      throw new Error("File not found");
    }
    
    console.log(`Archivo encontrado, retornando datos`);
    
    return {
      ...photo,
      file_path: filePath
    };

  },



  async deletePhoto(id: number): Promise<Photo> {
    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) {
      throw new Error("Photo not found");
    }

    const { file_name, photeable_type, photeable_id } = photo;

    const folderName = (() => {
      switch (photeable_type) {
        case "Order":
          return "order";
        case "Repair_report":
          return "repair-report";
        default:
          throw new Error("Invalid photoable type");
      }
    })();

    const filePath = path.join(__dirname, "..", "media", "service", folderName, String(photeable_id), file_name);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return prisma.photo.delete({ where: { id } });

  },
  

};


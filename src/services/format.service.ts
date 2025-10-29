import { listResource } from '../utils/list-resource';
import prisma from "../config/prisma";
import { Format } from "@prisma/client";
import fs from "fs";
import path from "path";

export const FormatService = {

    async getAllFormats(query: any) {
        return listResource(
            'format',
            query,
            ['name'],
            {},
            { created_at: 'desc' },
            { status: 'active' }
        );
    },
    async getFormatById(id: number): Promise<Format | null> {
        return await prisma.format.findUnique({ where: { id } });
    },

    async uploadFormat(file: Express.Multer.File, data: any): Promise<Format> {
            return prisma.format.create({
                data: {
                    name: data.name,
                    file_name: file.filename,
                    file_path: file.path,
                    status: 'active',
                    created_at: new Date(),
                },

            });
    },

    async serveFormat(id: number): Promise<Format | null> {
        const format = await prisma.format.findUnique({ where: { id } });
        if (!format) {
            throw new Error("Format not found");
        }

        const { file_name: formatName } = format;
        const filePath = path.join(__dirname, "..", "media", "formats", formatName);
        if (!fs.existsSync(filePath)) {
            throw new Error("File not found");
        }

        return format;
    },

    async deleteFormat(id: number): Promise<Format> {
        const format = await prisma.format.findUnique({ where: { id } });
        if (!format) {
            throw new Error("Format not found");
        }

        const filePath = path.join(__dirname, "..", "media", "formats", format.file_name);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return await prisma.format.delete({ where: { id } });
    }



}
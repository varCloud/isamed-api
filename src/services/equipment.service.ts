import prisma from "../config/prisma";
import { Equipment } from "@prisma/client";

export const EquipmentService = {
    async createEquipment(data: Omit<Equipment, "id" | "created_at" | "updated_at">): Promise<Equipment> {
        return await prisma.equipment.create({
            data: {
                ...data,
                created_at: new Date(),
            },
        });
    },
    updateEquipment(id: number, data: Partial<Equipment>): Promise<Equipment> {
        return prisma.equipment.update({
            where: { id },
            data: {
                ...data,
            },
        });
    }
    ,
    async deleteEquipment(id: number): Promise<Equipment> {
        return await prisma.equipment.delete({
            where: { id },
        });
    }
};
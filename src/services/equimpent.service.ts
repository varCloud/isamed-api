import prisma from "../config/prisma";

import { Equipment } from "@prisma/client";

export const EquipmentService = {
  async createEquipment(data: Omit<Equipment, "id">): Promise<Equipment> {
    const { brand_cat_id, equipment_cat_id, order_id, ...rest } = data;
    return await prisma.equipment.create({
      data: {
        ...rest,
        created_at: new Date(),
        brand: { connect: { id: Number(brand_cat_id) } },
        equipment_cat: { connect: { id: Number(equipment_cat_id) } },
        order: { connect: { id: order_id } }
      },
    });
  },

  async getAllEquipments(): Promise<Equipment[]> {
    return await prisma.equipment.findMany();
  },

  async getEquipmentById(id: number): Promise<Equipment | null> {
    return await prisma.equipment.findUnique({ where: { id } });
  },

  async updateEquipment(id: number, data: Partial<Omit<Equipment, "id">>): Promise<Equipment> {
    return await prisma.equipment.update({
      where: { id },
      data,
    });
  },

  async deleteEquipment(id: number): Promise<Equipment> {
    return await prisma.equipment.delete({ where: { id } });
  },
};
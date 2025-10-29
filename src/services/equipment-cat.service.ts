import prisma from "../config/prisma";
import { Equipment_cat } from "@prisma/client";
import { listResource } from '../utils/list-resource';

export const EquipmentCatService = {
  async createEquipmentCat(data: Omit<Equipment_cat, "id">): Promise<Equipment_cat> {
    return await prisma.equipment_cat.create({ data: {
      ...data,
      created_at: new Date(),

    } });
  },

  async getAllEquipmentCats(query: any) {
    return listResource(
      'equipment_cat',
      query,
      ['name'],
      {},
      { created_at: 'desc' },
      { deleted_at: null }
    );
  },

  async getEquipmentCatToSelect(): Promise<Pick<Equipment_cat, "id" | "name">[]> {
    return await prisma.equipment_cat.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        name: true,
      },
    });
  },

  async updateEquipmentCat(id: number, data: Partial<Omit<Equipment_cat, "id">>): Promise<Equipment_cat> {
    return await prisma.equipment_cat.update({
      where: { id },
      data: { ...data, updated_at: new Date() },
    });
  },

  async deleteEquipmentCat(id: number): Promise<Equipment_cat> {
    return await prisma.equipment_cat.update({ where: { id }, data: { deleted_at: new Date()} });
  },
};
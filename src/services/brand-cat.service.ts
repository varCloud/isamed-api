import prisma from "../config/prisma";
import { Brand_cat } from "@prisma/client";
import { listResource } from '../utils/list-resource';


export const BrandCatService = {
  async createBrandCat(data: Omit<Brand_cat, "id">): Promise<Brand_cat> {
    return await prisma.brand_cat.create({ data: { ...data, created_at: new Date() } });
  },

  async getAllBrandCats(query: any) {
        return listResource(
            'brand_cat',
            query,
            ['name'],
            {},
            { created_at: 'desc' },
            { deleted_at: null }
        );
  },

  async getBrandCatToSelect(): Promise<Pick<Brand_cat, "id" | "name">[]> {
    return await prisma.brand_cat.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        name: true,
      },
    });
  },

  async updateBrandCat(id: number, data: Partial<Omit<Brand_cat, "id">>): Promise<Brand_cat> {
    return await prisma.brand_cat.update({
      where: { id },
      data: { ...data, updated_at: new Date() },
    });
  },

  async deleteBrandCat(id: number): Promise<Brand_cat> {
    return await prisma.brand_cat.update({ where: { id },data: { deleted_at: new Date() } });
  },
};
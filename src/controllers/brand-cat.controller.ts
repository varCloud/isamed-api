import { BrandCatService } from "../services/brand-cat.service";
import { AuthenticatedRequest } from "../types/express";
import { Response } from "express";

export const BrandCatController = {
    async createBrandCat(req: AuthenticatedRequest, res: Response) {
        const data = req.body;
        const brandCat = await BrandCatService.createBrandCat(data);
        res.status(201).json(brandCat);
    },

    async getAllBrandCats(req: AuthenticatedRequest, res: Response) {
        const brandCats = await BrandCatService.getAllBrandCats(req.query);
        res.status(200).json(brandCats);
    },

    async getBrandCatToSelect(req: AuthenticatedRequest, res: Response) {
        const brandCats = await BrandCatService.getBrandCatToSelect();
        res.status(200).json(brandCats);
    },

    async updateBrandCat(req: AuthenticatedRequest, res: Response) {
        const { id } = req.params;
        const data = req.body;
        const brandCat = await BrandCatService.updateBrandCat(Number(id), data);
        res.status(200).json(brandCat);
    },

    async deleteBrandCat(req: AuthenticatedRequest, res: Response) {
        const { id } = req.params;
        const brandCat = await BrandCatService.deleteBrandCat(Number(id));
        res.status(200).json(brandCat);
    }
};

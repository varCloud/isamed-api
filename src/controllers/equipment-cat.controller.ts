import { EquipmentCatService } from "../services/equipment-cat.service";
import { AuthenticatedRequest } from "../types/express";
import { Response } from "express";
export const EquipmentCatController = {
    async createEquipmentCat(req: AuthenticatedRequest, res: Response) {
        const data = req.body;
        const equipmentCat = await EquipmentCatService.createEquipmentCat(data);
        res.status(201).json(equipmentCat);
    },

    async getAllEquipmentCats(req: AuthenticatedRequest, res: Response) {
        const equipmentCats = await EquipmentCatService.getAllEquipmentCats(req.query);
        res.status(200).json(equipmentCats);
    },

    async getEquipmentCatToSelect(req: AuthenticatedRequest, res: Response) {
        const equipmentCats = await EquipmentCatService.getEquipmentCatToSelect();
        res.status(200).json(equipmentCats);
    },

    async updateEquipmentCat(req: AuthenticatedRequest, res: Response) {
        const { id } = req.params;
        const data = req.body;
        const equipmentCat = await EquipmentCatService.updateEquipmentCat(Number(id), data);
        res.status(200).json(equipmentCat);
    },

    async deleteEquipmentCat(req: AuthenticatedRequest, res: Response) {
        const { id } = req.params;
        const equipmentCat = await EquipmentCatService.deleteEquipmentCat(Number(id));
        res.status(200).json(equipmentCat);
    }
};

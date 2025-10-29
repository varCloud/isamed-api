import { EquipmentService } from "../services/equimpent.service";
import { AuthenticatedRequest } from "../types/express";
import { Response } from "express";

export const EquipmentController = {
    async createEquipment(req: AuthenticatedRequest, res: Response) {
        const data = req.body;
        const equipment = await EquipmentService.createEquipment(data);
        res.status(201).json(equipment);
    },

    async updateEquipment(req: AuthenticatedRequest, res: Response) {
        const { id } = req.params;
        const data = req.body;
        const equipment = await EquipmentService.updateEquipment(Number(id), data);
        res.status(200).json(equipment);
    },

    async deleteEquipment(req: AuthenticatedRequest, res: Response) {
        const { id } = req.params;
        const equipment = await EquipmentService.deleteEquipment(Number(id));
        res.status(200).json(equipment);
    }
};
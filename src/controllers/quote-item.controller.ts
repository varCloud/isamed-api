import { Response } from "express";
import { QuoteItemService } from "../services/quote-item.service";
import { AuthenticatedRequest } from "../types/express";

export const QuoteItemController = {

    async create(req: AuthenticatedRequest, res: Response){
        const data = req.body
        await QuoteItemService.createQuoteItem(data)
        res.status(201).json('Servicio creado éxitosamente');
    },

    async update(req: AuthenticatedRequest, res: Response){
        const id = +req.params.id
        const data = req.body
        
        if (!id) {
            res.status(400).json({ error: "ID de cotización es requerido" });
            return;
        }

        await QuoteItemService.updateQuoteItem(id, data)
        res.status(200).json('Servicio actualizado éxitosamente');
    },

    async delete(req: AuthenticatedRequest, res: Response){
        const id = +req.params.id
        if (!id) {
            res.status(400).json({ error: "ID de cotización es requerido" });
            return;
        }
        await QuoteItemService.deleteQuoteItem(id)
        res.status(204).send();
    },

}
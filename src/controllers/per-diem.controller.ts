import { AuthenticatedRequest } from "../types/express";
import { Response } from "express";
import { PerDiemService } from "../services/per-diem.service";
import { generatePdfFromHtml } from "../utils/pdf";
import { generatePerDiemQr } from "../utils/qr";
import { generatePerDiemPrintableHtml } from "../templates/per-diem.printable";
import path from "path";
import fs from "fs";

/**
 * Controlador para manejar las operaciones relacionadas con los viáticos.
 * Permite listar, mostrar, crear, actualizar y eliminar viáticos.
 * Los servicios de viáticos se obtienen del servicio `per-diem.service`.
 */

export const PerDiemController = {
  async index(req: AuthenticatedRequest, res: Response) {
    const result = await PerDiemService.getAllPerDiems(req.query);
    res.json(result);
  },

  async getByCustomerId(req: AuthenticatedRequest, res: Response) {
  const customerId = parseInt(req.query.customer_id as string);

  if (!customerId) {
     res.status(400).json({ message: "customer_id es requerido" });
    return;
  }

  const query = {
    ...req.query,
    customer_id: customerId,
  };

    const perDiems = await PerDiemService.getPerDiemsByCustomer(query);
    res.json(perDiems);
  },

  async show(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const perDiem = await PerDiemService.getPerDiemById(id);
      
      if (!perDiem) {
        res.status(404).json({ error: "Viático no encontrado" });
        return;
      }
      
      res.json(perDiem);
    } catch (error) {
      console.error('Error fetching per diem:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

 async create(req: AuthenticatedRequest, res: Response) {
    try {
      const data = req.body;
      const userId = req.user?.id;
      
      const perDiemData = {
        ...data,
        user_id: userId,
        created_at: new Date(),
        gasoline_charges: data.gasoline_charges || [],
        extra_expenses: data.extra_expenses || []
      };
      
      const perDiem = await PerDiemService.createPerDiem(perDiemData);
      res.status(201).json({ message: 'Viático creado exitosamente', data: perDiem });
    } catch (error) {
      console.error('Error creating per diem:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      
      const existingPerDiem = await PerDiemService.getPerDiemById(id);
      if (!existingPerDiem) {
        res.status(404).json({ error: "Viático no encontrado" });
        return;
      }
      
      const perDiem = await PerDiemService.updatePerDiem(id, data);
      res.json({ message: 'Viático actualizado exitosamente', data: perDiem });
    } catch (error) {
      console.error('Error updating per diem:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      
      const existingPerDiem = await PerDiemService.getPerDiemById(id);
      if (!existingPerDiem) {
        res.status(404).json({ error: "Viático no encontrado" });
        return;
      }
      
      await PerDiemService.deletePerDiem(id);
      res.json({ message: 'Viático eliminado exitosamente' });
    } catch (error) {
      console.error('Error deleting per diem:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

    async downloadPdf(req: AuthenticatedRequest, res: Response) {
        const perDiem = await PerDiemService.getPerDiemById(Number(req.params.id));
        if (!perDiem) {
            res.status(404).json({ error: "Viático no encontrado" });
            return;
        }
        const css = fs.readFileSync(path.resolve(__dirname, '../assets/style.css'), 'utf-8');
        const qrPath = await generatePerDiemQr(perDiem.id);
        const imgPath = path.resolve(__dirname, '../assets/membrete.jpg');
        const imgBase64 = fs.readFileSync(imgPath).toString('base64');
        const imgDataUri = `data:image/jpeg;base64,${imgBase64}`;
        const qrBase64 = fs.readFileSync(qrPath).toString('base64');
        const qrDataUri = `data:image/png;base64,${qrBase64}`;

        const html = generatePerDiemPrintableHtml(perDiem, qrDataUri, imgDataUri, css);
        const pdfBuffer = await generatePdfFromHtml(html);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=viatico-${perDiem.id}.pdf`);
        res.send(pdfBuffer);
    },

    async generatePdf(req: AuthenticatedRequest, res: Response): Promise<void> {
              const perDiem = await PerDiemService.getPerDiemById(Number(req.params.id));
        if (!perDiem) {
            res.status(404).json({ error: "Viático no encontrado" });
            return;
        }
        const css = fs.readFileSync(path.resolve(__dirname, '../assets/style.css'), 'utf-8');
        const qrPath = await generatePerDiemQr(perDiem.id);
        const imgPath = path.resolve(__dirname, '../assets/membrete.jpg');
        const imgBase64 = fs.readFileSync(imgPath).toString('base64');
        const imgDataUri = `data:image/jpeg;base64,${imgBase64}`;
        const qrBase64 = fs.readFileSync(qrPath).toString('base64');
        const qrDataUri = `data:image/png;base64,${qrBase64}`;

        const html = generatePerDiemPrintableHtml(perDiem, qrDataUri, imgDataUri, css);
        const pdfBuffer = await generatePdfFromHtml(html);
        
      res.setHeader("Content-Type", "application/pdf");
res.setHeader(
  "Content-Disposition",
  `inline; filename="Viatico-${perDiem.id}.pdf"`
);
res.end(pdfBuffer);
    },

}
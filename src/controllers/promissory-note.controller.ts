import { AuthenticatedRequest } from "../types/express";
import { Response } from "express";
import { PromissoryNoteService } from "../services/promissory-note.service";
import { generatePdfFromHtml } from "../utils/pdf";
import { generatePromissoryNoteQr } from "../utils/qr";
import { generatePromissoryNotePrintableHtml } from "../templates/promissory-note.printable";
import path from "path";
import fs from "fs";

/**
 * Controlador para manejar las operaciones relacionadas con los pagaré.
 * Permite listar, mostrar, crear, actualizar y eliminar pagaré.
 * Los servicios de pagaré se obtienen del servicio `promissory-note.service`.
 */

export const PromissoryNoteController = {
  async index(req: AuthenticatedRequest, res: Response) {
    const result = await PromissoryNoteService.getAllPromissoryNotes(req.query);
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

    const promissoryNotes = await PromissoryNoteService.getPromissoryNotesByCustomer(query);
    res.json(promissoryNotes);
  },

  async create(req: AuthenticatedRequest, res: Response) {
    const data = req.body;
    const userId = req.user?.id;
    const promissoryNoteData = {
      ...data,
    };
    const promissoryNote = await PromissoryNoteService.createPromissoryNote(promissoryNoteData);
    res.status(201).json('Pagaré creado exitosamente');
    },

    async show(req: AuthenticatedRequest, res: Response) {
    const promissoryNote = await PromissoryNoteService.getPromissoryNoteById(Number(req.params.id));

    if (!promissoryNote) {
      res.status(404).json({ message: "Pagaré no encontrado" });
      return;
    }

    res.json(promissoryNote);
    },

    async update(req: AuthenticatedRequest, res: Response) {
    const data = req.body;
    const promissoryNote = await PromissoryNoteService.updatePromissoryNote(Number(req.params.id), data);
    res.json('Pagaré actualizado exitosamente');
  },

    async delete(req: AuthenticatedRequest, res: Response) {
        await PromissoryNoteService.deletePromissoryNote(Number(req.params.id));
        res.status(204).send();
    },  

  async downloadPdf(req: AuthenticatedRequest, res: Response) {
    const promissoryNote = await PromissoryNoteService.getPromissoryNoteById(Number(req.params.id));
    if (!promissoryNote) {
      res.status(404).json({ error: "Pagaré no encontrado" });
      return;
    }
    const css = fs.readFileSync(path.resolve(__dirname, '../assets/style.css'), 'utf-8');
    const qrPath = await generatePromissoryNoteQr(promissoryNote.id);
    const imgPath = path.resolve(__dirname, '../assets/membrete.jpg');
    const imgBase64 = fs.readFileSync(imgPath).toString('base64');
    const imgDataUri = `data:image/jpeg;base64,${imgBase64}`;
    const qrBase64 = fs.readFileSync(qrPath).toString('base64');
    const qrDataUri = `data:image/png;base64,${qrBase64}`;
    
    const html = generatePromissoryNotePrintableHtml(promissoryNote, qrDataUri, imgDataUri, css);
    const pdfBuffer = await generatePdfFromHtml(html);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Pagaré-${promissoryNote.id}.pdf`);
    res.send(pdfBuffer);
  },

  async generatePdf(req: AuthenticatedRequest, res: Response): Promise<void> {
     const promissoryNote = await PromissoryNoteService.getPromissoryNoteById(Number(req.params.id));
    if (!promissoryNote) {
      res.status(404).json({ error: "Pagaré no encontrado" });
      return;
    }
    const css = fs.readFileSync(path.resolve(__dirname, '../assets/style.css'), 'utf-8');
    const qrPath = await generatePromissoryNoteQr(promissoryNote.id);
    const imgPath = path.resolve(__dirname, '../assets/membrete.jpg');
    const imgBase64 = fs.readFileSync(imgPath).toString('base64');
    const imgDataUri = `data:image/jpeg;base64,${imgBase64}`;
    const qrBase64 = fs.readFileSync(qrPath).toString('base64');
    const qrDataUri = `data:image/png;base64,${qrBase64}`;
    
    const html = generatePromissoryNotePrintableHtml(promissoryNote, qrDataUri, imgDataUri, css);
    const pdfBuffer = await generatePdfFromHtml(html);
    
res.setHeader("Content-Type", "application/pdf");
res.setHeader(
  "Content-Disposition",
  `inline; filename="Pagaré-${promissoryNote.id}.pdf"`
);
res.end(pdfBuffer);
  },
};

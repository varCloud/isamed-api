import { Response } from "express";
import { QuotationService } from "../services/quotation.service";
import { AuthenticatedRequest } from "../types/express";
import { generatePdfFromHtml } from "../utils/pdf";
import { generateQuotationQr } from "../utils/qr";
import fs from "fs";
import path from "path";
import { generateQuotationPrintableHtml } from "../templates/quotation.printable";
import { setPdfDownloadHeaders } from "../middleware/pdf-security.middleware";

export const QuotationController = {
  async index(req: AuthenticatedRequest, res: Response) {
    const result = await QuotationService.getAllQuotations(req.query);
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

    const quotations = await QuotationService.getQuotationsByCustomer(query);
    res.json(quotations);
  },

  async show(req: AuthenticatedRequest, res: Response) {
    const quotation = await QuotationService.getQuotationById(Number(req.params.id));
    if (!quotation) {
       res.status(404).json({ error: "Cotización no encontrada" });
       return;
    }
    res.json(quotation);
  },

  async create(req: AuthenticatedRequest, res: Response) {
    const data = req.body;
    const userId = req.user?.id;
    const quotationData = {
      ...data,
      user_id: userId,
      created_at: new Date(),
    };
    const quotation = await QuotationService.createQuotation(quotationData);
    res.status(201).json(quotation);
  },

  async update(req: AuthenticatedRequest, res: Response) {
    const data = req.body;
    const quotation = await QuotationService.updateQuotation(Number(req.params.id), data);
    res.json(quotation);
  },

  async delete(req: AuthenticatedRequest, res: Response) {
    await QuotationService.deleteQuotation(Number(req.params.id));
    res.status(204).send();
  },

  async downloadPdf(req: AuthenticatedRequest, res: Response) {
    const quotation = await QuotationService.getQuotationById(Number(req.params.id));
    if (!quotation) {
       res.status(404).json({ error: "Cotización no encontrada" });
       return;
    }
    const css = fs.readFileSync(path.resolve(__dirname, '../assets/style.css'), 'utf-8');
    const qrPath = await generateQuotationQr(quotation.id);
    const imgPath = path.resolve(__dirname, '../assets/membrete.jpg');
    const imgBase64 = fs.readFileSync(imgPath).toString('base64');
    const imgDataUri = `data:image/jpeg;base64,${imgBase64}`;
    const qrBase64 = fs.readFileSync(qrPath).toString('base64');
    const qrDataUri = `data:image/png;base64,${qrBase64}`;


    const html = generateQuotationPrintableHtml(quotation, qrDataUri, imgDataUri, css);
    const pdfBuffer = await generatePdfFromHtml(html);

    setPdfDownloadHeaders(res, `Cotizacion-${quotation.id}.pdf`, false);
    res.send(pdfBuffer);
  },

  async generatePdf(req: AuthenticatedRequest, res: Response) {
        const quotation = await QuotationService.getQuotationById(Number(req.params.id));
    if (!quotation) {
       res.status(404).json({ error: "Cotización no encontrada" });
       return;
    }
    const css = fs.readFileSync(path.resolve(__dirname, '../assets/style.css'), 'utf-8');
    const qrPath = await generateQuotationQr(quotation.id);
    const imgPath = path.resolve(__dirname, '../assets/membrete.jpg');
    const imgBase64 = fs.readFileSync(imgPath).toString('base64');
    const imgDataUri = `data:image/jpeg;base64,${imgBase64}`;
    const qrBase64 = fs.readFileSync(qrPath).toString('base64');
    const qrDataUri = `data:image/png;base64,${qrBase64}`;


    const html = generateQuotationPrintableHtml(quotation, qrDataUri, imgDataUri, css);
    const pdfBuffer = await generatePdfFromHtml(html);

setPdfDownloadHeaders(res, `Cotizacion-${quotation.id}.pdf`, true);
res.end(pdfBuffer);
  },

  async downloadQr(req: AuthenticatedRequest, res: Response) {
    const quotation = await QuotationService.getQuotationById(Number(req.params.id));
    if (!quotation) {
       res.status(404).json({ error: "Cotización no encontrada" });
       return;
    }
    const qrPath = await generateQuotationQr(quotation.id);
    res.download(qrPath, `Cotizacion-${quotation.id}_QR.png`);
  },

  async createDelivery(req: AuthenticatedRequest, res: Response) {
    try {
      const delivery = await QuotationService.createDelivery(req.body);
      res.status(201).json('Información de entrega creada exitosamente');
    } catch (error) {
      console.error("Error creating delivery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async updateDelivery(req: AuthenticatedRequest, res: Response) {
    try {
      const delivery = await QuotationService.updateDelivery(Number(req.params.id), req.body);
      if (!delivery) {
           res.status(404).json({ message: "Delivery not found" });
           return;
      }
       res.status(200).json('Información de entrega actualizada exitosamente');
    } catch (error) {
      console.error("Error updating delivery:", error);
       res.status(500).json({ message: "Internal server error" });
       return;
    }
  }

};
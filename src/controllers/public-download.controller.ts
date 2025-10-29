import { Request, Response } from "express";
import { QuotationService } from "../services/quotation.service";
import { generatePdfFromHtml } from "../utils/pdf";
import { generateQuotationQr } from "../utils/qr";
import { setPdfDownloadHeaders } from "../middleware/pdf-security.middleware";
import { generateQuotationPrintableHtml } from "../templates/quotation.printable";
import fs from "fs";
import path from "path";

/**
 * Controlador para descargas públicas de PDFs (sin autenticación)
 * Estas rutas están diseñadas para ser usadas desde QR codes
 */
export const PublicDownloadController = {
  
  /**
   * Descarga pública de PDF de cotización
   * GET /public/quotations/:id/pdf
   */
  async downloadQuotationPdf(req: Request, res: Response) {
    try {
      const quotationId = Number(req.params.id);
      
      // Validar ID
      if (!quotationId || isNaN(quotationId)) {
        res.status(400).json({ error: "ID de cotización inválido" });
        return;
      }

      // Obtener cotización (sin información sensible adicional)
      const quotation = await QuotationService.getQuotationById(quotationId);
      if (!quotation) {
        res.status(404).json({ error: "Cotización no encontrada" });
        return;
      }

      // Validar que la cotización tenga datos necesarios
      if (!quotation.quote_items || quotation.quote_items.length === 0) {
        res.status(400).json({ error: "La cotización no tiene elementos para generar PDF" });
        return;
      }

      // Generar PDF
      const css = fs.readFileSync(path.resolve(__dirname, '../assets/style.css'), 'utf-8');
      const qrPath = await generateQuotationQr(quotation.id);
      const imgPath = path.resolve(__dirname, '../assets/membrete.jpg');
      const imgBase64 = fs.readFileSync(imgPath).toString('base64');
      const imgDataUri = `data:image/jpeg;base64,${imgBase64}`;
      const qrBase64 = fs.readFileSync(qrPath).toString('base64');
      const qrDataUri = `data:image/png;base64,${qrBase64}`;

      const html = generateQuotationPrintableHtml(quotation, qrDataUri, imgDataUri, css);
      const pdfBuffer = await generatePdfFromHtml(html);

      // Configurar headers de descarga
      setPdfDownloadHeaders(res, `Cotizacion-${quotation.id}.pdf`, true);
      res.end(pdfBuffer);

    } catch (error) {
      console.error('Error generando PDF público de cotización:', error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  /**
   * Descarga pública de PDF de orden
   * GET /public/orders/:id/pdf
   */
  async downloadOrderPdf(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.id);
      
      if (!orderId || isNaN(orderId)) {
        res.status(400).json({ error: "ID de orden inválido" });
        return;
      }

      // Importar servicios dinámicamente para evitar dependencias circulares
      const { getOrderById, getDeliveryByOrderId } = await import("../services/order.service");
      const { generateOrderQr } = await import("../utils/qr");
      const { generateOrderPrintableHtml } = await import("../templates/order.printable");

      const order = await getOrderById(orderId);
      if (!order) {
        res.status(404).json({ error: "Orden no encontrada" });
        return;
      }

      const delivery = await getDeliveryByOrderId(orderId);
      const qrPath = await generateOrderQr(orderId);
      const css = fs.readFileSync(path.resolve(__dirname, '../assets/style.css'), 'utf-8');
      const imgPath = path.resolve(__dirname, '../assets/membrete.jpg');
      const imgBase64 = fs.readFileSync(imgPath).toString('base64');
      const imgDataUri = `data:image/jpeg;base64,${imgBase64}`;
      const qrBase64 = fs.readFileSync(qrPath).toString('base64');
      const qrDataUri = `data:image/png;base64,${qrBase64}`;

      const html = generateOrderPrintableHtml(order, qrDataUri, imgDataUri, delivery, css);
      const pdfBuffer = await generatePdfFromHtml(html);

      setPdfDownloadHeaders(res, `Orden-${order.id}.pdf`, true);
      res.end(pdfBuffer);

    } catch (error) {
      console.error('Error generando PDF público de orden:', error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  /**
   * Descarga pública de PDF de viático
   * GET /public/per-diems/:id/pdf
   */
  async downloadPerDiemPdf(req: Request, res: Response) {
    try {
      const perDiemId = Number(req.params.id);
      
      if (!perDiemId || isNaN(perDiemId)) {
        res.status(400).json({ error: "ID de viático inválido" });
        return;
      }

      // Importar servicios dinámicamente
      const { PerDiemService } = await import("../services/per-diem.service");
      const { generatePerDiemQr } = await import("../utils/qr");
      const { generatePerDiemPrintableHtml } = await import("../templates/per-diem.printable");

      const perDiem = await PerDiemService.getPerDiemById(perDiemId);
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

      setPdfDownloadHeaders(res, `Viatico-${perDiem.id}.pdf`, true);
      res.end(pdfBuffer);

    } catch (error) {
      console.error('Error generando PDF público de viático:', error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
};
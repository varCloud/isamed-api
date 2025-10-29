import prisma from "../config/prisma";
import { Repair_report } from "@prisma/client";
import { AuthenticatedRequest } from "../types/express";
import { Response } from "express";
import { RepairReportService } from "../services/repair-report.service";
import { generateRepairReportQr } from "../utils/qr";
import { generatePdfFromHtml } from "../utils/pdf";
import { getOrderById } from "../services/order.service";
import fs  from "fs";
import path from "path";
import { generateRepairReportPrintableHtml } from "../templates/report.printable";

export const RepairReportController = {
    
    async updateRepairReport(req: AuthenticatedRequest, res: Response) {
        const { id } = req.params;
        const data: Partial<Omit<Repair_report, "id">> = req.body;

        try {
            const updatedReport = await RepairReportService.updateRepairReport(Number(id), data);
            if (!updatedReport) {
                 res.status(404).json({ message: "Repair report not found" });
                 return;
            }
             res.status(200).json(updatedReport);
        } catch (error) {
            console.error("Error updating repair report:", error);
             res.status(500).json({ message: "Internal server error" });
             return;
        }
    },
    
      async downloadPdf(req: AuthenticatedRequest, res: Response): Promise<void> {
        const repairId = +req.params.id;
        const repairReport = await RepairReportService.getRepairReportById(repairId);
   
        
        if (!repairReport) {
          res.status(404).send('Informe no encontrado');
          return;
        }
        const order = await getOrderById(repairReport.order_id || 0);
        const repair = {...repairReport, created_at: order?.created_at};


        const delivery = await RepairReportService.getDeliveryByRepairReportId(repairId);
        const qrPath = await generateRepairReportQr(repairId);
        const css = fs.readFileSync(path.resolve(__dirname, '../assets/style.css'), 'utf-8');
        const imgPath = path.resolve(__dirname, '../assets/membrete.jpg');
        const imgBase64 = fs.readFileSync(imgPath).toString('base64');
        const imgDataUri = `data:image/jpeg;base64,${imgBase64}`;
        const qrBase64 = fs.readFileSync(qrPath).toString('base64');
        const qrDataUri = `data:image/png;base64,${qrBase64}`;
        const html = generateRepairReportPrintableHtml(repair, qrDataUri, imgDataUri, delivery, css);
        const pdfBuffer = await generatePdfFromHtml(html);
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="Reporte-Reparacion_R-${repairId}.pdf"`,
        });
    
        res.send(pdfBuffer);
      },

      async generatePdf(req: AuthenticatedRequest, res: Response): Promise<void> {
                const repairId = +req.params.id;
        const repairReport = await RepairReportService.getRepairReportById(repairId);
   
        
        if (!repairReport) {
          res.status(404).send('Reporte no encontrado');
          return;
        }
        const order = await getOrderById(repairReport.order_id || 0);
        const repair = {...repairReport, created_at: order?.created_at};


        const delivery = await RepairReportService.getDeliveryByRepairReportId(repairId);
        const qrPath = await generateRepairReportQr(repairId);
        const css = fs.readFileSync(path.resolve(__dirname, '../assets/style.css'), 'utf-8');
        const imgPath = path.resolve(__dirname, '../assets/membrete.jpg');
        const imgBase64 = fs.readFileSync(imgPath).toString('base64');
        const imgDataUri = `data:image/jpeg;base64,${imgBase64}`;
        const qrBase64 = fs.readFileSync(qrPath).toString('base64');
        const qrDataUri = `data:image/png;base64,${qrBase64}`;
        const html = generateRepairReportPrintableHtml(repair, qrDataUri, imgDataUri, delivery, css);
        const pdfBuffer = await generatePdfFromHtml(html);
   res.setHeader("Content-Type", "application/pdf");
res.setHeader(
  "Content-Disposition",
  `inline; filename="Reporte_De_Reparación-${repairId}.pdf"`
);
res.end(pdfBuffer);
      },
      
        async downloadQr(req: AuthenticatedRequest, res: Response): Promise<void> {
          const repairId = +req.params.id;
          const qrPath = await generateRepairReportQr(repairId);
          res.download(qrPath, `Reporte-Reparacion_R-${repairId}_QR.png`);
        },

        async createDelivery(req: AuthenticatedRequest, res: Response): Promise<void> {

          try {
            const delivery = await RepairReportService.createReportDelivery(req.body);
            res.status(201).json('Información de entrega creada exitosamente');
          } catch (error) {
            console.error("Error creating delivery:", error);
            res.status(500).json({ message: "Internal server error" });
          }
        }
      
    

}
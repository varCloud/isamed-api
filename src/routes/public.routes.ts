import { Router } from "express";
import { PublicDownloadController } from "../controllers/public-download.controller";
import { applyPdfSecurityHeaders } from "../middleware/pdf-security.middleware";

/**
 * Rutas públicas para descarga de PDFs mediante QR codes
 * Estas rutas NO requieren autenticación
 */
const publicRouter = Router();

// Aplicar headers de seguridad a todas las rutas públicas de PDF
publicRouter.use(applyPdfSecurityHeaders);

// Rutas públicas para descargas de PDF
publicRouter.get("/quotations/:id/pdf", PublicDownloadController.downloadQuotationPdf);
publicRouter.get("/orders/:id/pdf", PublicDownloadController.downloadOrderPdf);
publicRouter.get("/per-diems/:id/pdf", PublicDownloadController.downloadPerDiemPdf);

export default publicRouter;
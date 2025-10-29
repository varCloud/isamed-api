import e, { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { RepairReportController } from "../controllers/repair-report.controller";

const repairReportRouter = Router();

repairReportRouter.put("/:id", requireAuth, RepairReportController.updateRepairReport);
repairReportRouter.get("/:id/generate-pdf", requireAuth, RepairReportController.downloadPdf);
repairReportRouter.get("/:id/download-pdf", requireAuth, RepairReportController.generatePdf);
repairReportRouter.get("/:id/download-qr", RepairReportController.downloadQr);
repairReportRouter.post("/:id/delivery", requireAuth, RepairReportController.createDelivery);

export default repairReportRouter;
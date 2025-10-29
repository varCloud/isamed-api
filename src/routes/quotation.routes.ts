import { Router } from "express";
import { QuotationController } from "../controllers/quotation.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { validateWithZod } from "../middleware/validate.middleware";

const quotationRouter = Router();
quotationRouter.get("/", requireAuth, authorize("admin", "agent"), QuotationController.index);
quotationRouter.get("/customer", requireAuth, authorize("admin", "agent", "engineer"), QuotationController.getByCustomerId);
quotationRouter.get("/:id", requireAuth, authorize("admin", "agent"), QuotationController.show);
quotationRouter.post("/:id/delivery", requireAuth, authorize("admin", "agent"), QuotationController.createDelivery);
quotationRouter.post("/", requireAuth, authorize("admin", "agent"), QuotationController.create);
quotationRouter.put("/:id/delivery", requireAuth, authorize("admin", "agent"), QuotationController.updateDelivery);
quotationRouter.put("/:id", requireAuth, authorize("admin", "agent"), QuotationController.update);
quotationRouter.delete("/:id", requireAuth, authorize("admin", "agent"), QuotationController.delete);
quotationRouter.get("/:id/generate-pdf", QuotationController.downloadPdf);
quotationRouter.get("/:id/download-pdf", QuotationController.generatePdf);
quotationRouter.get("/:id/qr", requireAuth, authorize("admin", "agent"), QuotationController.downloadQr);
export default quotationRouter;
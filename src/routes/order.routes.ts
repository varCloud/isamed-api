import { Router } from "express";

import { OrderController } from "../controllers/order.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { validateWithZod } from "../middleware/validate.middleware";
import { orderSchema } from "../validators/order.validator";

const orderRouter = Router();

orderRouter.get("/", requireAuth, authorize('agent', 'admin', 'engineer'), OrderController.index);
orderRouter.get("/customer", requireAuth, authorize('agent', 'admin', 'engineer'), OrderController.getByCustomerId);
orderRouter.post("/", requireAuth, validateWithZod(orderSchema), authorize('agent', 'admin', "engineer"), OrderController.create);
orderRouter.get("/monthly-printable", requireAuth, authorize('agent', 'admin', 'engineer'), OrderController.downloadMonthlyReport);
orderRouter.get("/:id", requireAuth, authorize('admin', 'agent', 'engineer'), OrderController.show);
orderRouter.get("/:id/generate-pdf", OrderController.downloadPdf);
orderRouter.get("/:id/download-pdf", OrderController.generatePdf);
orderRouter.get("/:id/download-qr", requireAuth, authorize('admin', 'engineer'), OrderController.downloadQr);
orderRouter.put("/:id", requireAuth, authorize('admin', 'engineer'), OrderController.update);
orderRouter.put("/:id/complete", requireAuth, authorize('admin', 'engineer'), OrderController.completeOrder);
orderRouter.put("/:id/cancel", requireAuth, authorize('admin', 'engineer'), OrderController.cancelOrder);
export default orderRouter;

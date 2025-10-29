import { Router } from "express";
import { PerDiemController } from "../controllers/per-diem.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

const perDiemRouter = Router();
perDiemRouter.get("/", requireAuth, authorize("admin", "agent", "engineer"), PerDiemController.index);
perDiemRouter.get("/customer", requireAuth, authorize("admin", "agent", "engineer"), PerDiemController.getByCustomerId);
perDiemRouter.get("/:id", requireAuth, authorize("admin", "agent", "engineer"), PerDiemController.show);
perDiemRouter.post("/", requireAuth, authorize("admin", "agent", "engineer"), PerDiemController.create);
perDiemRouter.put("/:id", requireAuth, authorize("admin", "agent", "engineer"), PerDiemController.update);
perDiemRouter.delete("/:id", requireAuth, authorize("admin", "agent", "engineer"), PerDiemController.delete);
perDiemRouter.get("/:id/generate-pdf", PerDiemController.downloadPdf);
perDiemRouter.get("/:id/download-pdf", PerDiemController.generatePdf);

export default perDiemRouter;

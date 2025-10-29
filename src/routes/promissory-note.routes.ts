import { Router } from "express";
import { PromissoryNoteController } from "../controllers/promissory-note.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

const promissoryNoteRouter = Router();

promissoryNoteRouter.get("/", requireAuth, authorize("admin", "agent"), PromissoryNoteController.index);
promissoryNoteRouter.get("/customer", requireAuth, authorize("admin", "agent", "engineer"), PromissoryNoteController.getByCustomerId);
promissoryNoteRouter.get("/:id", requireAuth, authorize("admin", "agent", "engineer"), PromissoryNoteController.show);
promissoryNoteRouter.post("/", requireAuth, authorize("admin", "agent"), PromissoryNoteController.create);
promissoryNoteRouter.put("/:id", requireAuth, authorize("admin", "agent"), PromissoryNoteController.update);
promissoryNoteRouter.delete("/:id", requireAuth, authorize("admin", "agent"), PromissoryNoteController.delete);
promissoryNoteRouter.get("/:id/generate-pdf", PromissoryNoteController.downloadPdf);
promissoryNoteRouter.get("/:id/download-pdf", PromissoryNoteController.generatePdf);

export default promissoryNoteRouter;

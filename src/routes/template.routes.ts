import { Router } from "express";
import { TemplateController } from "../controllers/template.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

const templateRouter = Router();

templateRouter.get("/", requireAuth, authorize("admin", "agent"), TemplateController.index);
templateRouter.get("/select", requireAuth, authorize("admin", "agent"), TemplateController.select);
templateRouter.get("/:id", requireAuth, authorize("admin", "agent"), TemplateController.show);
templateRouter.post("/", requireAuth, authorize("admin", "agent"), TemplateController.create);
templateRouter.put("/:id", requireAuth, authorize("admin", "agent"), TemplateController.update);
templateRouter.delete("/:id", requireAuth, authorize("admin", "agent"), TemplateController.delete);

export default templateRouter;

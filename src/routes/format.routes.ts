import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { FormatController } from "../controllers/format.controller";
import { validateWithZod } from "../middleware/validate.middleware";
import { uploadFormat } from "../utils/upload";
import { formatSchema } from "../validators/format.validator";
const formatRouter = Router();
formatRouter.get("/", requireAuth, authorize("admin", "agent"), FormatController.index);
formatRouter.post("/upload/:name", requireAuth, authorize("admin", "agent"), uploadFormat.single("file"), validateWithZod(formatSchema, true), FormatController.uploadFormat);
formatRouter.get("/:id/serve", requireAuth, authorize("admin", "agent"), FormatController.serveFormat);
formatRouter.delete("/:id", requireAuth, authorize("admin", "agent"), FormatController.delete);

export default formatRouter;
import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { PhotoController } from "../controllers/photo.controller";
import { authorize } from "../middleware/authorize.middleware";
import { validateWithZod } from "../middleware/validate.middleware";
import { photoSchema } from "../validators/photo.validator";
import { upload } from "../utils/upload";

const photoRouter = Router();
photoRouter.post("/upload/:entityType/:entityId", requireAuth, authorize("admin", "engineer"), upload.single('file'), validateWithZod(photoSchema, true), PhotoController.uploadPhoto);
photoRouter.get("/media/:id", requireAuth, PhotoController.serveMedia);
photoRouter.get("/:entityType/:entityId", requireAuth, PhotoController.getPhotosByEntity);
photoRouter.delete("/:id", requireAuth, PhotoController.deletePhoto);

export default photoRouter;
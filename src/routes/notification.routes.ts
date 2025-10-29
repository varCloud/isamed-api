import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { NotificationController } from "../controllers/notification.controller";

const notificationRouter = Router();

notificationRouter.get("/", requireAuth, NotificationController.listNotifications);
notificationRouter.post("/:notificationId/read", requireAuth, NotificationController.markAsRead);
notificationRouter.delete("/:notificationId", requireAuth, NotificationController.deleteNotification);
notificationRouter.delete("/", requireAuth, NotificationController.deleteAllNotifications); // ← al final

export default notificationRouter;

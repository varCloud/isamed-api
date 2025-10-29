import { AuthenticatedRequest } from "../types/express";

import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

export const NotificationController = {

    listNotifications: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const notifications = await NotificationService.getNotifications(req.user.id);
        res.status(200).json(notifications);
    },

    markAsRead: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { notificationId } = req.params;
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        await NotificationService.markAsRead(Number(notificationId), req.user.id);
        res.status(204).send();
    },

    deleteNotification: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { notificationId } = req.params;
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        await NotificationService.deleteNotification(Number(notificationId), req.user.id);
        res.status(204).send();
    },

    deleteAllNotifications: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        await NotificationService.deleteAllNotifications(req.user.id);
        res.status(204).send();
    }
};
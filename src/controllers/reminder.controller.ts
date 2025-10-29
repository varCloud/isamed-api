import { AuthenticatedRequest } from "../types/express";
import { Response } from "express";
import { ReminderService } from "../services/reminder.service";
import { NotificationService } from "../services/notification.service";
import { io } from "../server";
import prisma from "../config/prisma";

export const ReminderController = {
  async createReminder(req: AuthenticatedRequest, res: Response): Promise<void> {
    const data = req.body;
    if (!data || !data.remindable_id || !data.remindable_type || !data.content) {
      res.status(400).json({ error: "Invalid reminder data" });
      return;
    }

    try {
      const reminder = await ReminderService.createReminder(data);
      res.status(201).json(reminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getRemindersByEntity(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { entityId, entityType } = req.params;
    if (!entityId || !entityType) {
        res.status(400).json({ error: "Entity ID and type are required" });
        return;
        }
    try {
        const reminders = await ReminderService.getReminderByEntity(entityType, Number(entityId));
        res.status(200).json(reminders);
        }
    catch (error) {
        console.error("Error fetching reminders:", error);
        res.status(500).json({ error: "Internal server error" });
        }
    },

    async deleteReminder(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Reminder ID is required" });
      return;
    }
    try {
      const deletedReminder = await ReminderService.deleteReminder(Number(id));
      res.status(200).json(deletedReminder);
    }
    catch (error) {
        console.error("Error deleting reminder:", error);
        res.status(500).json({ error: "Internal server error" });
        }
    },

    async checkRemindersForToday(): Promise<void> {
        try {
            const reminders = await ReminderService.checkRemindersForToday();
            const users = await prisma.user.findMany();
          if(reminders){
              for (const reminder of reminders) {
                for (const user of users) {
                           
            await NotificationService.createNotification({
              id: undefined as unknown as number,
              user_id: user.id !== null ? user.id : 0,
              class: reminder.remindable_type,
              type: "Reminder",
              model_id: reminder.id.toString(),
              message: `${reminder.content}`,
              readed: 0,
              created_at: new Date(),
            });
                }
              }
          }
        } catch (error) {
            console.error("Error checking reminders for today:", error);
        }
    },
    

}
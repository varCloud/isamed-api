import prisma from "../config/prisma";
import { Reminder } from "@prisma/client";

export const ReminderService = {
  async createReminder(data: Omit<Reminder, "id">): Promise<Reminder> {
    return prisma.reminder.create({ data:{
      ...data,
      created_at: new Date(),
      reminded: 0
      
    } });
  },

   async getReminderByEntity(entityType: 'Order' | 'Repair_report', entityId: number): Promise<Reminder[]> {
    return prisma.reminder.findMany({
      where: { remindable_type: entityType, remindable_id: entityId },
      orderBy: { created_at: "desc" },
    });
  },

  async getReminderById(id: number): Promise<Reminder | null> {
    return prisma.reminder.findUnique({ where: { id } });
  },

  async updateReminder(id: number, data: Partial<Omit<Reminder, "id">>): Promise<Reminder> {
    return prisma.reminder.update({
      where: { id },
      data,
    });

  },

  async deleteReminder(id: number): Promise<Reminder> {
    return prisma.reminder.delete({ where: { id } });
  },
  async checkRemindersForToday(): Promise<Reminder[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    return prisma.reminder.findMany({
      where: {
        remind_at: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });
  },
}
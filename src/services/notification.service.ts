import prisma from "../config/prisma";
import { Notification } from "@prisma/client";
import { io } from '../server'; 


export const NotificationService =  {

    createNotification: async (data: Notification) => {
        const notification = await prisma.notification.create({
            data
        });
io.to(`user-${data.user_id}`).emit('new-notification', notification);
    return notification;
    },

    getNotifications: async (userId: number) => {
        const notifications = await prisma.notification.findMany({
            where: {
                user_id: userId
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        return notifications;
    },

     async markAsRead(notificationId: number, userId: number) {
    return prisma.notification.updateMany({
      where: {
        id: notificationId,
        user_id: userId,
        readed: 0,
      },
      data: { readed: 1 },
    });
  },

  async deleteNotification(notificationId: number, userId: number) {
    return prisma.notification.deleteMany({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });
  } ,

  async deleteAllNotifications(userId: number) {
    return prisma.notification.deleteMany({
      where: {
        user_id: userId,
      },
    });
  }


}
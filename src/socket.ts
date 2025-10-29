import { Server } from 'socket.io';
import { authenticateSocket } from './middleware/socket-auth.middleware';
import prisma from './config/prisma';

export function initSocketHandlers(io: Server) {
  io.use(authenticateSocket);
  io.on('connection', async (socket) => {
    const userId = socket.data.user.id;
    if (userId) {
      socket.join(`user-${userId}`);
      console.log(`Usuario ${userId} conectado`);
    }
      const storedNotifications = await prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
      socket.emit('bulk-notifications', storedNotifications);

    socket.on('disconnect', () => {
      console.log(`Socket desconectado: ${socket.id}`);
    });
  });
}


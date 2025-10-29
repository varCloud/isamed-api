import app from './app';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initSocketHandlers } from './socket';
import expressListEndpoints from 'express-list-endpoints';
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

const httpServer = createServer(app);

// Configuración de CORS para Socket.io según el ambiente
const socketOrigins = [
  'https://nuevo.idsamed.com',
  'https://192.168.1.148',
  'https://isamed-web.onrender.com/'
];

// Agregar orígenes de desarrollo si estamos en modo dev
if (process.env.DEV_MODE === 'true' || process.env.NODE_ENV === 'development') {
  socketOrigins.push('http://localhost:3001', 'http://localhost:3000');
}

export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: socketOrigins,
    credentials: true,
  }
});

initSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en ${APP_URL}`);

});

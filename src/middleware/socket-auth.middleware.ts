// socket-auth.middleware.ts
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;


function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(';').reduce((cookies: Record<string, string>, cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    cookies[name] = decodeURIComponent(rest.join('='));
    return cookies;
  }, {});
}

interface JWTPayload {
  id: number;
  role: string;
}

export function authenticateSocket(socket: Socket, next: (err?: Error) => void) {
      const rawCookie = socket.handshake.headers.cookie;
        if (!rawCookie) {
    return next(new Error('No se encontró la cookie de autenticación'));
  }
  const cookies = parseCookies(rawCookie);
  const token = cookies.accessToken;
  if (!token) {
    return next(new Error('Token de acceso no proporcionado'));
  }

  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    socket.data.user = decoded;
    next();
  } catch (err) {
    console.error('Error verificando JWT:', err);
    next(new Error('Token inválido'));
  }
}

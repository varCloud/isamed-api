// src/app.ts
import express from 'express';
import cors from 'cors';
import router from './routes';
import cookieParser from 'cookie-parser';
const app = express();

// Configuración de CORS según el ambiente
const allowedOrigins = [
  'https://nuevo.idsamed.com',
  'https://192.168.1.148'
];

// Agregar orígenes de desarrollo si estamos en modo dev
if (process.env.DEV_MODE === 'true' || process.env.NODE_ENV === 'development') {
  allowedOrigins.push('http://localhost:3001', 'http://localhost:3000');
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.set('trust proxy', true);
app.use(cookieParser());

// Configuración de rutas según el ambiente
const useApiPrefix = process.env.USE_API_PREFIX === 'true' || process.env.DEV_MODE === 'true';
if (useApiPrefix) {
  app.use('/api', router);
} else {
  app.use(router);
}

export default app;

// src/app.ts
import express from 'express';
import cors from 'cors';
import router from './routes';
import cookieParser from 'cookie-parser';
const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || '';

// Configuración de CORS según el ambiente
const allowedOrigins = [
  'https://nuevo.idsamed.com',
  'https://192.168.1.148',
  'https://isamed-web.onrender.com',
];

// Agregar orígenes de desarrollo si estamos en modo dev
if (process.env.DEV_MODE === 'true' || process.env.NODE_ENV === 'development') {
  allowedOrigins.push(
    'http://localhost:3001',
    'http://localhost:3000',
    'http://localhost:3200',
    FRONTEND_URL
  );
}

const corsOptions = {
  origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Permitir solicitudes sin origen (como aplicaciones móviles o Postman)
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
};

// Aplicar CORS a todas las rutas
app.use(cors(corsOptions));

// Manejar las solicitudes OPTIONS para Express 5 sin usar comodines
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).json({});
  }
  next();
});

app.use(express.json());

// Configuración más segura de trust proxy para rate limiting
// Solo confiar en proxies específicos como Render, Nginx, etc.
app.set('trust proxy', 
  process.env.NODE_ENV === 'production' 
    ? ['loopback', 'linklocal', 'uniquelocal'] 
    : false
);

app.use(cookieParser());
app.get('/', function (_, res) {
  res.send('Ready for TO DO APi...!! XD');
});

app.use('/api', router);

export default app;

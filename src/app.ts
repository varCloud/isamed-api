// src/app.ts
import express from 'express';
import cors from 'cors';
import router from './routes';
import cookieParser from 'cookie-parser';
const app = express();
const PORT = process.env.PORT || 3000;
const APP_URL =  `http://localhost:${PORT}`;

// Configuración de CORS según el ambiente
const allowedOrigins = [
  'https://nuevo.idsamed.com',
  'https://192.168.1.148',
  'https://isamed-web.onrender.com/'
];

// Agregar orígenes de desarrollo si estamos en modo dev
if (process.env.DEV_MODE === 'true' || process.env.NODE_ENV === 'development') {
  allowedOrigins.push('http://localhost:3001', 'http://localhost:3000', APP_URL);
}

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
// }));
app.options('*', cors());
app.use(express.json());
app.set('trust proxy', true);
app.use(cookieParser());
app.get('/', function(_, res) {
    res.send('Ready for TO DO APi...!! XD');
});

app.use('/api', router);

export default app;

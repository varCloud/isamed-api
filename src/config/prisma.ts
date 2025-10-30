import { PrismaClient } from '@prisma/client';

// Configuración para manejar mejor las conexiones y logging
const prisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'query', emit: 'event' }
  ]
});

// Logging de queries lentas (más de 2 segundos)
prisma.$on('query', (e: any) => {
  if (e.duration >= 2000) {
    console.warn('Consulta lenta detectada:', {
      query: e.query,
      duration: `${e.duration}ms`
    });
  }
});

// Logging de errores de Prisma
prisma.$on('error', (e: any) => {
  console.error('Error de Prisma:', e);
});

// Asegurarse de que la conexión se cierre al terminar el proceso
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit();
});

// Manejo de errores no capturados
process.on('unhandledRejection', async (error) => {
  console.error('Error no manejado:', error);
  await prisma.$disconnect();
});

export default prisma;
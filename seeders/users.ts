import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedUsers() {
  const adminExists = await prisma.user.count({ where: { role: 'admin' } });

  if (adminExists > 0) {
    console.log('Ya existe al menos un usuario administrador. Omitiendo seeder de usuarios.');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 12);

  await prisma.user.create({
    data: {
      name: 'ING. MIGUEL ANGEL GUZMAN MARCOS',
      email: 'admin@idsamed.com',
      password: hashedPassword,
      status: 'active',
      role: 'admin',
      created_at: new Date(),
    },
  });

  console.log('Usuario administrador creado correctamente.');
}

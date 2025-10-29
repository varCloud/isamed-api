import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedBrandCategories() {
  const brands = ['General Electric', 
    'Samsung', 
    'Medison', 
    'Mindray', 
    'Philips',
    'Siemens',
    'Chison',
    'Sonoscape',
    'Vinnio',
    'Biocare',
    'ALOKA',
    'CyberPower',
    'SONY',
    'EATON',
    'Sonolife',
    'APC',
    'EDAN',
    'MODULO CPU_B-FORMER VOLUSON 730',
    'CAVITATION MULTIPOLAR RF',
    'BTL',
  ];

  for (const name of brands) {
    const exists = await prisma.brand_cat.findFirst({ where: { name } });
    if (!exists) {
      await prisma.brand_cat.create({
        data: {
          name,
          created_at: new Date(),
        },
      });
    }
  }

  

  console.log('Categorías de marcas insertadas.');
}

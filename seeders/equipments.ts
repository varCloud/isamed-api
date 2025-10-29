import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedEquipmentCategories() {
  const categories = ['Ultrasonido', 
    'Transductor', 
    'Monitor', 
    'Impresora', 
    'Regulador',
    'Tarjeta electrónica',
    'Regulador+UPS',
    'Power Supply DSP',
    'COLPOSCOPIO',
    'MODULO DE PODER DPS PARA USG',
    'MODULO CPU_BFORMER VOLUSON 730',
    'ELIMINADOR / CARGADOR'
  ];

  for (const name of categories) {
    const exists = await prisma.equipment_cat.findFirst({ where: { name } });
    if (!exists) {
      await prisma.equipment_cat.create({
        data: {
          name,
          created_at: new Date(),
        },
      });
    }
  }

  console.log('Categorías de equipo insertadas.');
}

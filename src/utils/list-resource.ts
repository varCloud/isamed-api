import prisma from '../config/prisma';
import { buildPrismaWhere } from './filters';
import { Prisma } from '@prisma/client';

export async function listResource<T extends object>(
  model: keyof typeof prisma,
  query: Record<string, any>,
  allowedFilters: (keyof T)[],
  include?: object,
  defaultOrderBy: object = { created_at: 'desc' },
  extraWhere: object = {}
) {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 10, 50); // Máximo 50 registros por página
  
  try {
    const where = {
      ...buildPrismaWhere(query, allowedFilters as string[]),
      ...extraWhere,
    };

    // Obtener el modelo tipado de Prisma
    const prismaModel = prisma[model] as unknown as {
      findMany: (args: any) => Promise<any[]>;
      count: (args: any) => Promise<number>;
    };

    // Ejecutar las consultas en paralelo pero con mejor manejo de tipos
    const [data, total] = await Promise.all([
      prismaModel.findMany({
        where,
        include,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: defaultOrderBy,
      }),
      prismaModel.count({ where })
    ]);

    return {
      data,
      meta: {
        total,
        page,
        perPage: limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    // Manejo de errores específicos de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2024') { // Error de tiempo de conexión
        throw new Error('Tiempo de espera excedido al conectar con la base de datos');
      }
      if (error.code === 'P2025') { // Error de registro no encontrado
        return {
          data: [],
          meta: {
            total: 0,
            page,
            perPage: limit,
            lastPage: 0,
          },
        };
      }
    }

    console.error('Error en listResource:', {
      model,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      query: JSON.stringify(query)
    });
    
    // Lanzar un error genérico para el cliente
    throw new Error('Error al obtener la lista de recursos');
  }
}

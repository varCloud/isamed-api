import prisma from '../config/prisma';
import { buildPrismaWhere } from './filters';

export async function listResource<T extends object>(
  model: keyof typeof prisma,
  query: Record<string, any>,
  allowedFilters: (keyof T)[],
  include?: object,
  defaultOrderBy: object = { created_at: 'desc' },
  extraWhere: object = {}
) {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  const where = {
    ...buildPrismaWhere(query, allowedFilters as string[]),
    ...extraWhere,
  };

  const [data, total] = await Promise.all([
    (prisma[model] as any).findMany({
      where,
      include,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: defaultOrderBy,
    }),
    (prisma[model] as any).count({ where }),
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
}

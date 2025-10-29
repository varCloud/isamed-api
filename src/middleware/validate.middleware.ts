import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
export const validateWithZod = (
  schema: ZodSchema<any>,
  includeFile: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = includeFile ? { ...req.body, file: req.file } : req.body;
    const result = schema.safeParse(data);

    if (!result.success) {
      const formattedErrors = result.error.errors.reduce((acc, err) => {
        const field = err.path.join('.');
        acc[field] = { message: err.message };
        return acc;
      }, {} as Record<string, { message: string }>);

      res.status(400).json({ errors: formattedErrors });
      return;
    }

    req.body = result.data;
    next();
  };
};
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
       res.status(403).json({ message: 'Acceso denegado' });
       return;
    }

    next();
  };
};

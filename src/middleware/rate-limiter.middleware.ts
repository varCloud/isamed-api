import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 5 * 1000, 
  max: 100, 
  message: 'Demasiadas peticiones. Inténtalo de nuevo más tarde.',
  standardHeaders: true, 
  legacyHeaders: false, 
});

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { loginRateLimiter } from '../middleware/rate-limiter.middleware';

const authRouter = Router();

authRouter.post('/login', loginRateLimiter, AuthController.login);
authRouter.post('/logout', AuthController.logout);
authRouter.post('/refresh', AuthController.refresh);
authRouter.get('/me', requireAuth, AuthController.me);

export default authRouter;

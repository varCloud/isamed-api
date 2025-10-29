import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { AuthenticatedRequest } from '../types/express';
const jwtSecret: jwt.Secret = process.env.JWT_SECRET!;
const jwtRefreshSecret: jwt.Secret = process.env.JWT_REFRESH_SECRET!;

export const AuthController = {
  
  async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { email, password } = req.body;
const accessTokenExpiresIn = (process.env.JWT_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn'];
const refreshTokenExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'];

  const users = await prisma.user.findMany({ where: { email } });

if (!users || users.length === 0) {
  res.status(202).json({ message: 'Credenciales inválidas', success: false });
  return;
}

let user = null;

for (const u of users) {
  const isMatch = await bcrypt.compare(password, u.password ?? "");
  if (isMatch) {
    user = u;
    break;
  }
}

if (!user) {
  res.status(202).json({ message: 'Credenciales inválidas', success: false });
  return;
}

if (user.status !== 'active') {
  res.status(202).json({ message: 'Usuario deshabilitado', success: false });
  return;
}

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      jwtSecret,
      { expiresIn: accessTokenExpiresIn }
    );

const refreshToken = jwt.sign(
  { id: user.id },
  jwtRefreshSecret,
  { expiresIn: refreshTokenExpiresIn }
);

res.cookie('accessToken', accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 1000,
});

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000,
});


  res.status(200).json({
    message: 'Login exitoso',
    success: true,
  });
  },

  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ session: false });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      res.status(401).json({ session: false });
      return;
    }

     res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch {
     res.status(401).json({ session: false });
  }
},

  async refresh(req: Request, res: Response): Promise<void> {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(401).json({ error: 'No refresh token' });
      return;
    }

    try {
      const decoded = jwt.verify(token, jwtRefreshSecret) as any;
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });

      if (!user) {
        res.status(401).json({ error: 'Usuario no encontrado' });
        return;
      }

      const accessTokenExpiresIn = (process.env.JWT_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn'];

      const newAccessToken = jwt.sign(
        { id: user.id, role: user.role },
        jwtSecret,
        { expiresIn: accessTokenExpiresIn }
      );

res.cookie('accessToken', newAccessToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 1000, 
});

      res.json({
        message: 'Token de acceso renovado',
      });

    } catch {
       res.status(403).json({ error: 'Refresh token inválido' });
    }
  },

  logout(req: Request, res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    res.json({ message: 'Logout exitoso' });
  },

  test(req: Request, res: Response) {
    res.json({ message: 'Test de autenticación exitoso' });
  }

};




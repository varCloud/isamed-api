import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface DecodedUser extends JwtPayload {
  id: number;
  role: string;
}

export interface AuthenticatedRequest<
  Params = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: DecodedUser;
}

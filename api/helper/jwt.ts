import { verify } from 'jsonwebtoken';
import config from './secret_key.ts';
import { Request, Response, NextFunction } from 'express';

function jwtVerify(role: Array<any> = [], status: Array<any> = []) {

  if (typeof role === 'string') {
    role = [role];
  }

  if (typeof status === 'string') {
    status = [status];
  }

  const secret = config.secret;
  return [
    async (req: Request, res: Response, next: NextFunction) => {
      const header = req.headers.authorization;
      if (!header) {
        return res.status(401).send('Access Denied. No token provided.');
      }

      const parts = header.split(' ');
      if (parts.length !== 2) {
        return res.status(401).send('Invalid authorization header');
      }

      const token = parts[1];

      try {
        // Require HS256 explicitly to avoid algorithm confusion
        const verified = verify(token, secret as any, { algorithms: ['HS256'] }) as any;
        req.user = verified;
        return next();
      } catch (err: any) {
        return res.status(401).send('Invalid token');
      }
    }
  ]
}

export default jwtVerify;
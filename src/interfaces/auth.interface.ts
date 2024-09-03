import { User } from '@prisma/client';
import { Request } from 'express';

export interface DataStoredInToken {
  id: number;
  otp?: boolean;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

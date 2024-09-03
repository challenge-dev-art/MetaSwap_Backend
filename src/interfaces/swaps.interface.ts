import { Request, Response } from 'express';
import { User } from '@prisma/client';

export interface Swap {
  id: string;
  currencyFromId: string;
  currencyToId: string;
  userId: number;
  value: number;
}

export interface SwapCreateRequest {
  body: {
    currencyFromId: string;
    currencyToId: number;
    userId: number;
    value: number;
  };
}

export interface SwapsResponse extends Response {
  currencyFrom: string;
  currencyTo: number;
  rate: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface SwapsListing {
  items: Swap[];
}

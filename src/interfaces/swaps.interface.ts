import { Request, Response } from 'express';
import { User, SwapStatus } from '@prisma/client';

export interface Swap {
  id: string;
  sourceCurrency: string;
  destinationCurrency: string;
  sourceAmount: number;
  destinationAmount: number;
  userId: number;
  hashId: Number;
  state: SwapStatus;
}

export interface GetSwap {
  id: number;
  sourceCurrency: string;
  destinationCurrency: string;
  sourceAmount: number;
  destinationAmount: number;
  account: string;
  createdDate: string;
  // userId: number;
  // hashId: Number;
  state: SwapStatus;
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

export interface SwapPreDisplayRequest extends Request {
  body: {
    sourceCurrency: string;
    destinationCurrency: string;
    amount: number;
  };
}

export interface SwapPreDisplay {
  sourceCurrency: string;
  destinationCurrency: string;
  amount: number;
}

export interface SwapUpdateRequest {
  body: {
    id: number;
    hashId: number;
    state: SwapStatus;
    userId: number;
  };
}

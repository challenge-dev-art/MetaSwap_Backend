import { Request } from 'express';

export interface SwapCurrencyPair {
  name: string;
  feeCurrencyName: string;
  coinId: string;
  networkData: SwapNetworkData;
  scale: number;
  blockchainScale: number;
  garbageAmount?: number;
  crypto: boolean;
  blockchainName: string;
  contract?: string;
  enabled: boolean;
  active: boolean;
}

export interface SwapNetworkData {
  frontName: string;
  type?: string;
}

interface SwapCurrencyPairs {
  currecyPairs: SwapCurrencyPair[];
}

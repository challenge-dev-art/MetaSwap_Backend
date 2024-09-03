export interface DepositCurrency {
  id: string;
  type: 'CRYPTO';
  cryptoCode: string; // deprecated
  cryptoToken: string;
  cryptoChain: string;
  cryptoTokenName: string;
  cryptoChainName: string;
  decimals: number;
  lowerBound: number;
  lowerBoundUSD: number;
}

export interface DepositCurrencyListing {
  items: DepositCurrency[];
}

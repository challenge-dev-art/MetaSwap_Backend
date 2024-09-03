import { CurrencyType } from '@prisma/client';

export function getDepositLowerBoundUSD(currency: CurrencyType): number {
  switch (currency) {
    case CurrencyType.BTC:
    case CurrencyType.ETH: {
      return 50; // 50 USD
    }
    default: {
      return 10; // 10 USD
    }
  }
}

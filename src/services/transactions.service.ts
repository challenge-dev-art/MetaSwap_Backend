import { currencies } from '@/config/currencies';
import { Currency } from '@/interfaces/currencies.interface';
import {
  Transaction as TransactionView,
  TransactionListing,
  InternalTransferOutputTransaction,
  InternalTransferInputTransaction,
  Transaction,
  DepositTransaction,
  PayoutTransaction,
} from '@/interfaces/transactions.interface';
import { prisma } from '@/prisma-client';
import { assertNever } from '@/utils/assertNever';
import { logger } from '@/utils/logger';
import { BigNumber, FixedNumber } from '@ethersproject/bignumber';
import { parseUnits } from '@ethersproject/units';
import { CurrencyType, TransactionType } from '@prisma/client';
import { Service } from 'typedi';

export interface TransferInternallyOpts {
  userFrom: number;
  userTo: number;
  value: number;
  currencyId: CurrencyType;
}

export type TransferIntenallyResult =
  | {
      kind: 'OK';
      transactionId: string;
    }
  | {
      kind: 'INSUFFICIENT_FUNDS';
    }
  | {
      kind: 'CURRENCY_NOT_FOUND';
    };

export interface TransactionFilter {
  type?: Transaction['type'];
  cryptoToken?: (Currency & { type: 'CRYPTO' })['cryptoToken'];
  cryptoChain?: (Currency & { type: 'CRYPTO' })['cryptoChain'];
  category?: TransactionCategory[];
}

export type TransactionCategory = 'TRANSFER' | 'EXCHANGE' | 'OFFCHAIN' | 'INCOMING' | 'OUTCOMING';

type TransactionTypeFilter = TransactionType | { in: TransactionType[] } | undefined;

const ZERO_BN = BigNumber.from('0');

@Service()
export class TransactionsService {
  private _currencyIdToCurrency: Map<string, Currency>;

  constructor() {
    this._currencyIdToCurrency = new Map(currencies.map(currency => [currency.id, currency]));
  }

  public async getTransactionListingView(userId: number, filter?: TransactionFilter): Promise<TransactionListing> {
    const requiredCurrencies = filter && getTargetCryptoCurrencies(filter.cryptoToken, filter.cryptoChain);

    if (requiredCurrencies.length === 0) {
      return { items: [], nextToken: null } satisfies TransactionListing;
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: getTransactionTypeFilter(filter),
        OR: requiredCurrencies.length
          ? [
              {
                type: 'INTERNAL_TRANSFER_INPUT',
                currencyIdInput: { in: requiredCurrencies },
              },
              {
                type: 'INTERNAL_TRANSFER_OUTPUT',
                currencyIdOutput: { in: requiredCurrencies },
              },
              {
                type: 'DEPOSIT',
                currencyIdInput: { in: requiredCurrencies },
              },
              {
                type: 'PAYOUT',
                currencyIdOutput: { in: requiredCurrencies },
              },
            ]
          : undefined,
      },
      select: {
        id: true,
        type: true,
        createdAt: true,
      },
      orderBy: {
        id: 'desc', // сначала показывать новые
      },
    });

    const listingItems: TransactionView[] = [];

    for (const transaction of transactions) {
      switch (transaction.type) {
        case 'INTERNAL_TRANSFER_OUTPUT': {
          const relatedItem = await prisma.internalTransferTransaction.findFirst({
            where: {
              transactionOutputId: transaction.id,
            },
            select: {
              value: true,
              currencyId: true,
              userOutput: {
                select: {
                  publicId: true,
                },
              },
              userInput: {
                select: {
                  publicId: true,
                },
              },
            },
          });
          if (!relatedItem) {
            logger.error(`skip transaction: related item not found: transaction ID:${transaction.id}`);
            continue;
          }
          const currency = this._currencyIdToCurrency.get(relatedItem.currencyId);
          if (!currency) {
            logger.error(`skip transaction: currency not found: transaction ID:${transaction.id}`);
            continue;
          }
          const decimals = currency.decimals;
          const listingItem: InternalTransferOutputTransaction = {
            id: transaction.id.toString(),
            type: 'INTERNAL_TRANSFER_OUTPUT',
            userFrom: relatedItem.userOutput.publicId,
            userTo: relatedItem.userInput.publicId,
            currencyId: relatedItem.currencyId,
            currency,
            value: FixedNumber.fromValue(BigNumber.from(relatedItem.value), decimals).toUnsafeFloat(),
            createdAt: transaction.createdAt.toISOString(),
          };
          listingItems.push(listingItem);
          break;
        }
        case 'INTERNAL_TRANSFER_INPUT': {
          const relatedItem = await prisma.internalTransferTransaction.findFirst({
            where: {
              transactionInputId: transaction.id,
            },
            select: {
              value: true,
              currencyId: true,
              userOutput: {
                select: {
                  publicId: true,
                },
              },
              userInput: {
                select: {
                  publicId: true,
                },
              },
            },
          });
          if (!relatedItem) {
            logger.error(`skip transaction: related item not found: transaction ID:${transaction.id}`);
            continue;
          }
          const currency = this._currencyIdToCurrency.get(relatedItem.currencyId);
          if (!currency) {
            logger.error(`skip transaction: currency not found: transaction ID:${transaction.id}`);
            continue;
          }
          const decimals = currency.decimals;
          const listingItem: InternalTransferInputTransaction = {
            id: transaction.id.toString(),
            type: 'INTERNAL_TRANSFER_INPUT',
            userFrom: relatedItem.userOutput.publicId,
            userTo: relatedItem.userInput.publicId,
            currencyId: relatedItem.currencyId,
            currency,
            value: FixedNumber.fromValue(BigNumber.from(relatedItem.value), decimals).toUnsafeFloat(),
            createdAt: transaction.createdAt.toISOString(),
          };
          listingItems.push(listingItem);
          break;
        }
        case 'DEPOSIT': {
          const relatedItem = await prisma.deposit.findFirst({
            where: {
              transactionId: transaction.id,
            },
            select: {
              currencyId: true,
              totalDebitAmount: true,
              state: true,
            },
          });

          if (!relatedItem) {
            logger.error(`skip transaction: related item not found: transaction ID:${transaction.id}`);
            continue;
          }
          const currency = this._currencyIdToCurrency.get(relatedItem.currencyId);
          if (!currency) {
            logger.error(`skip transaction: currency not found: transaction ID:${transaction.id}`);
            continue;
          }
          const decimals = currency.decimals;
          let status: 'PENDING' | 'SUCCEED' | 'FAILED';
          switch (relatedItem.state) {
            case 'MEM_POOL_FOUND':
            case 'PENDING_PAYMENT':
            case 'PENDING_INTERVENTION':
            case 'PENDING_COMPLIANCE_CHECK':
            case 'PAID': {
              status = 'PENDING';
              break;
            }
            case 'COMPLETED': {
              status = 'SUCCEED';
              break;
            }
            case 'DECLINED':
            case 'EXPIRED': {
              status = 'FAILED';
              break;
            }
            case 'ARCHIVED': {
              status = 'FAILED'; // неожиданный статус
              break;
            }
            case 'CANCEL': {
              status = 'FAILED';
              break;
            }
            default: {
              assertNever(relatedItem.state);
            }
          }
          const listingItem: DepositTransaction = {
            id: transaction.id.toString(),
            type: 'DEPOSIT',
            status,
            depositState: relatedItem.state,
            currencyId: relatedItem.currencyId,
            currency,
            value: relatedItem.totalDebitAmount,
            createdAt: transaction.createdAt.toISOString(),
          };
          listingItems.push(listingItem);
          break;
        }
        case 'PAYOUT': {
          const relatedItem = await prisma.payout.findFirst({
            where: {
              transactionId: transaction.id,
            },
            select: {
              currencyId: true,
              state: true,
              depositAddress: true,
              frozenAmount: {
                select: {
                  amount: true,
                },
              },
            },
          });

          if (!relatedItem) {
            logger.error(`skip transaction: related item not found: transaction ID:${transaction.id}`);
            continue;
          }
          const currency = this._currencyIdToCurrency.get(relatedItem.currencyId);
          if (!currency) {
            logger.error(`skip transaction: currency not found: transaction ID:${transaction.id}`);
            continue;
          }
          let status: 'PENDING' | 'SUCCEED' | 'FAILED';
          const payoutState = relatedItem.state;
          switch (payoutState) {
            case 'IN_PROGRESS': {
              status = 'PENDING';
              break;
            }
            case 'COMPLETED': {
              status = 'SUCCEED';
              break;
            }
            case 'CANCELED':
            case 'FAILED': {
              status = 'FAILED';
              break;
            }
            case 'CONFIRMED':
            case 'CREATION_IN_PROGRESS':
            case 'PENDING_CONFIRMATION': {
              status = 'PENDING';
              break;
            }
            default: {
              assertNever(payoutState);
            }
          }
          const listingItem: PayoutTransaction = {
            id: transaction.id.toString(),
            type: 'PAYOUT',
            status,
            payoutState: relatedItem.state,
            currencyId: currency.id,
            currency,
            value: relatedItem.frozenAmount.amount,
            depositAddress: relatedItem.depositAddress,
            createdAt: transaction.createdAt.toISOString(), // date ISO 8601
          };
          listingItems.push(listingItem);
          break;
        }
      }
    }

    return { items: listingItems, nextToken: null };
  }

  public async transferInternally(opts: TransferInternallyOpts): Promise<TransferIntenallyResult> {
    const currency = currencies.find(currency => currency.id === opts.currencyId);
    if (!currency) {
      return { kind: 'CURRENCY_NOT_FOUND' };
    }

    return await prisma.$transaction<TransferIntenallyResult>(async (tx): Promise<TransferIntenallyResult> => {
      const assetFrom = await tx.asset.findUnique({
        where: {
          ownerId_currencyId: {
            ownerId: opts.userFrom,
            currencyId: opts.currencyId,
          },
        },
      });
      if (assetFrom === null) {
        return { kind: 'INSUFFICIENT_FUNDS' };
      }

      if (opts.value > assetFrom.amount) {
        return { kind: 'INSUFFICIENT_FUNDS' };
      }
      await tx.asset.update({
        where: {
          id: assetFrom.id,
        },
        data: {
          amount: { decrement: opts.value },
        },
      });
      await tx.asset.upsert({
        where: {
          ownerId_currencyId: {
            ownerId: opts.userTo,
            currencyId: opts.currencyId,
          },
        },
        update: {
          amount: { increment: opts.value },
        },
        create: {
          ownerId: opts.userTo,
          currencyId: opts.currencyId,
          amount: opts.value,
        },
      });

      const now = new Date();

      const outputTransaction = await tx.transaction.create({
        data: {
          type: TransactionType.INTERNAL_TRANSFER_OUTPUT,
          userId: opts.userFrom,
          currencyIdOutput: opts.currencyId,
          currencyIdInput: opts.currencyId,
          createdAt: now,
        },
        select: {
          id: true,
        },
      });

      const inputTransaction = await tx.transaction.create({
        data: {
          type: TransactionType.INTERNAL_TRANSFER_INPUT,
          userId: opts.userTo,
          currencyIdOutput: opts.currencyId,
          currencyIdInput: opts.currencyId,
          createdAt: now,
        },
        select: {
          id: true,
        },
      });

      await tx.internalTransferTransaction.create({
        data: {
          userOutputId: opts.userFrom,
          userInputId: opts.userTo,
          currencyId: opts.currencyId,
          value: parseUnits(opts.value.toString(), currency.decimals).toString(),
          transactionOutputId: outputTransaction.id,
          transactionInputId: inputTransaction.id,
          createdAt: now,
        },
        select: {
          id: true,
        },
      });

      return { kind: 'OK', transactionId: outputTransaction.id.toString() };
    });
  }
}

function getTargetCryptoCurrencies(cryptoCode?: string, cryptoChain?: string): CurrencyType[] {
  let filteredCurrencies = filterCryptoCurrencies(currencies);
  if (cryptoCode) {
    filteredCurrencies = filterCurrenciesByCryptoCode(filteredCurrencies, cryptoCode);
  }
  if (cryptoChain) {
    filteredCurrencies = filterCurrenciesByCryptoChain(filteredCurrencies, cryptoChain);
  }

  return Array.from(pickCurrencyId(filteredCurrencies));
}

function* filterCryptoCurrencies(currencies: Iterable<Currency>) {
  for (const currency of currencies) {
    if (currency.type === 'CRYPTO') {
      yield currency satisfies Currency & { type: 'CRYPTO' };
    }
  }
}

function* filterCurrenciesByCryptoCode(currencies: Iterable<Currency & { type: 'CRYPTO' }>, cryptoCode: string) {
  for (const currency of currencies) {
    if (currency.cryptoCode === cryptoCode) {
      yield currency;
    }
  }
}

function* filterCurrenciesByCryptoChain(currencies: Iterable<Currency & { type: 'CRYPTO' }>, cryptoChain: string) {
  for (const currency of currencies) {
    if (currency.cryptoChain === cryptoChain) {
      yield currency;
    }
  }
}

function* pickCurrencyId(currencies: Iterable<Currency & { type: 'CRYPTO' }>) {
  for (const currency of currencies) {
    yield currency.id;
  }
}

function getTransactionTypesByCategories(categories: TransactionCategory[]): TransactionType[] {
  const allTypes = categories.flatMap(category => getTransactionTypesByCategory(category));
  const uniqueTypes = new Set(allTypes);
  return Array.from(uniqueTypes);
}

function getTransactionTypesByCategory(category: TransactionCategory): TransactionType[] {
  switch (category) {
    case 'TRANSFER': {
      return ['INTERNAL_TRANSFER_OUTPUT', 'INTERNAL_TRANSFER_INPUT'];
    }
    case 'EXCHANGE': {
      return ['SWAP'];
    }
    case 'OFFCHAIN': {
      return ['INTERNAL_TRANSFER_OUTPUT', 'INTERNAL_TRANSFER_INPUT'];
    }
    case 'INCOMING': {
      return ['INTERNAL_TRANSFER_INPUT', 'DEPOSIT'];
    }
    case 'OUTCOMING': {
      return ['INTERNAL_TRANSFER_OUTPUT', 'PAYOUT'];
    }
    default: {
      assertNever(category);
    }
  }
}

function getTransactionTypeFilter(filter?: TransactionFilter): TransactionTypeFilter {
  if (!filter) {
    return undefined;
  }

  if (filter.type) {
    return filter.type;
  } else if (filter.category) {
    const types = getTransactionTypesByCategories(filter.category);
    if (types.length === 1) {
      return types[0];
    } else if (types.length > 1) {
      return { in: types };
    }
  }

  return undefined;
}

import Container, { Service } from 'typedi';
import { CalypsoService } from './calypso.service';
import { CalypsoEventsService } from './calypso-events.service';
import { CurrencyType } from '@prisma/client';
import { Payout, PayoutListing } from '@/interfaces/payouts.interface';
import { prisma } from '@/prisma-client';
import uniqid from 'uniqid';
import { randomUUID } from 'crypto';
import { Currency } from '@/interfaces/currencies.interface';
import { assertNever } from '@/utils/assertNever';
import { validate as validateCryptoAddress } from 'multicoin-address-validator';
import { payoutCurrencies } from '@/config/payout-currencies';
import { logger } from '@/utils/logger';

export interface CreatePayoutOpts {
  userId: number;
  value: number;
  currencyId: string;
  depositAddress: string;
  comment: string;
}

export type CreatePayoutResult =
  | {
      kind: 'OK';
      payout: Payout;
    }
  | {
      kind: 'INSUFFICIENT_FUNDS_ERR';
    }
  | {
      kind: 'UNSUPPORTED_CURRENCY_ERR';
    }
  | {
      kind: 'INVALID_ADDRESS_ERR';
    };

const PAYOUT_ID_PREFIX = 'payout:';

@Service()
export class PayoutsService {
  private _calypso = Container.get(CalypsoService);
  private _calypsoEvents = Container.get(CalypsoEventsService);
  private _tagName = 'PayoutsService';
  private _currencyIdToDecimals: Map<CurrencyType, number>;

  constructor() {
    this._currencyIdToDecimals = new Map(payoutCurrencies.map(currency => [currency.id, currency.decimals]));
  }

  public async getPayoutListingView(userId: number): Promise<PayoutListing> {
    const payouts = await prisma.payout.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        depositAddress: true,
        currencyId: true,
        comment: true,
        state: true,
        transactionId: true,
        frozenAmount: {
          select: {
            amount: true,
          },
        },
      },
    });

    const items: Payout[] = payouts.map((payoutRow): Payout => {
      const payout: Payout = {
        id: payoutRow.id.toString(),
        depositAddress: payoutRow.depositAddress,
        amount: payoutRow.frozenAmount.amount,
        currencyId: payoutRow.currencyId,
        comment: payoutRow.comment,
        state: payoutRow.state,
        transactionId: payoutRow.transactionId.toString(),
      };

      return payout;
    });

    return { items } satisfies PayoutListing;
  }

  public async createPayout(opts: CreatePayoutOpts): Promise<CreatePayoutResult> {
    const user = await prisma.user.findUnique({
      where: {
        id: opts.userId,
      },
      select: {
        publicId: true,
        telegramUsername: true,
      },
    });
    if (!user) {
      throw new Error('user not found');
    }

    const currency: Readonly<Currency> = payoutCurrencies.find(currency => currency.type === 'CRYPTO' && currency.id === opts.currencyId);
    if (!currency || currency.type !== 'CRYPTO') {
      return { kind: 'UNSUPPORTED_CURRENCY_ERR' };
    }

    const idempotencyKey = randomUUID();
    const externalId = PAYOUT_ID_PREFIX + uniqid();

    if (!isAddressValid(opts.depositAddress, currency.id)) {
      return { kind: 'INVALID_ADDRESS_ERR' };
    }

    const asset = await prisma.asset.findFirst({
      where: {
        ownerId: opts.userId,
        currencyId: currency.id,
      },
    });
    if (!asset) {
      return {
        kind: 'INSUFFICIENT_FUNDS_ERR',
      };
    }

    const internalPayout = await prisma.$transaction(async (tx): Promise<{ id: number; transactionId: number } | null> => {
      const currentAsset = await tx.asset.findUnique({
        where: { id: asset.id },
      });
      if (currentAsset.amount < opts.value) {
        return null;
      }
      const frozenAmount = await tx.frozenAmount.create({
        data: {
          userId: opts.userId,
          currencyId: currency.id,
          amount: opts.value,
        },
        select: {
          id: true,
        },
      });
      await tx.freezeTransaction.create({
        data: {
          userId: opts.userId,
          frozenAmountId: frozenAmount.id,
        },
      });
      const transaction = await tx.transaction.create({
        data: {
          type: 'PAYOUT',
          userId: opts.userId,
          currencyIdInput: null,
          currencyIdOutput: currency.id,
        },
        select: { id: true },
      });

      const payout = await tx.payout.create({
        data: {
          userId: opts.userId,
          transactionId: transaction.id,
          depositAddress: opts.depositAddress,
          idempotencyKey,
          externalId,
          frozenAmountId: frozenAmount.id,
          currencyId: currency.id,
          comment: opts.comment,
          state: 'CREATION_IN_PROGRESS',
        },
        select: { id: true, transactionId: true },
      });

      await tx.asset.update({
        where: {
          id: currentAsset.id,
        },
        data: {
          amount: { decrement: opts.value },
        },
      });

      return payout;
    });
    if (internalPayout === null) {
      return {
        kind: 'INSUFFICIENT_FUNDS_ERR',
      };
    }

    try {
      await this._calypso.createPayout({
        depositAddress: opts.depositAddress,
        amount: opts.value,
        currency: currency.id,
        comment: opts.comment,
        idempotencyKey,
        externalId,
      });
    } catch (error) {
      logger.error(`[${this._tagName}] failed to create payout: ${externalId} ${error}`);
    }

    return {
      kind: 'OK',
      payout: {
        id: internalPayout.id.toString(),
        depositAddress: opts.depositAddress,
        amount: opts.value,
        currencyId: opts.currencyId,
        comment: opts.comment,
        state: 'IN_PROGRESS',
        transactionId: internalPayout.transactionId.toString(),
      },
    };
  }

  public async syncPayouts() {
    for await (const localPayout of this._iterateUnsyncedPayouts()) {
      const getPayoutResult = await this._calypso.getPayout({
        idempotencyKey: localPayout.idempotencyKey,
      });
      switch (getPayoutResult.kind) {
        case 'API_ERROR': {
          logger.error(`[${this._tagName}] sync error: ${getPayoutResult.errorCode} ${getPayoutResult.traceId} ${getPayoutResult.message}`);
          continue;
        }
        case 'UNKNOWN_ERROR': {
          logger.error(`[${this._tagName}] sync error: ${getPayoutResult.message}`);
          continue;
        }
        case 'OK': {
          break;
        }
        default: {
          assertNever(getPayoutResult);
        }
      }

      const remotePayout = getPayoutResult.payload;
      if (localPayout.state === remotePayout.state) {
        logger.debug(`[${this._tagName}] sync: skip record ${localPayout.idempotencyKey}`);
        continue;
      }

      // Сохранить текущее обновление
      prisma.calypsoPayoutUpdate.create({
        data: {
          type: 'UNKNOWN',
          externalId: localPayout.externalId,
          body: remotePayout,
        },
      });

      if (remotePayout.state === 'CANCELED' || remotePayout.state === 'FAILED') {
        // Не удалось завершить исходящий платеж
        // Финализировать исходящий платеж и вернуть средства пользователю
        // После финализации не ожидаются изменения

        await prisma.$transaction(async tx => {
          // Финализировать
          await tx.payout.update({
            where: {
              id: localPayout.id,
            },
            data: {
              state: remotePayout.state,
              finalized: true,
            },
          });
          // Разморозить средства
          await tx.unfreezeTransaction.create({
            data: {
              userId: localPayout.userId,
              frozenAmountId: localPayout.frozenAmountId,
            },
          });
          const frozenAmount = await tx.frozenAmount.update({
            where: {
              id: localPayout.id,
            },
            data: {
              unfrozen: true,
            },
            select: {
              amount: true,
            },
          });
          // Вернуть средства
          await tx.asset.upsert({
            where: {
              ownerId_currencyId: {
                ownerId: localPayout.userId,
                currencyId: localPayout.currencyId,
              },
            },
            update: {
              amount: { increment: frozenAmount.amount },
            },
            create: {
              ownerId: localPayout.userId,
              currencyId: localPayout.currencyId,
              amount: frozenAmount.amount,
            },
          });
        });
      } else if (remotePayout.state === 'COMPLETED') {
        // Исходящий платеж завершен
        // Финализировать исходящий платеж, средства навсегда остаются замороженными
        // После финализации не ожидаются изменения

        // Финализировать
        await prisma.payout.update({
          where: {
            id: localPayout.id,
          },
          data: {
            state: remotePayout.state,
            finalized: true,
          },
        });
      } else {
        // Исходящий платеж все еще в обработке
        // Необходимо только обновить состояние

        await prisma.payout.update({
          where: {
            id: localPayout.id,
          },
          data: {
            state: remotePayout.state,
          },
        });
      }
    }
  }

  private async *_iterateUnsyncedPayouts() {
    let rows = await prisma.payout.findMany({
      take: 4,
      where: {
        finalized: false,
      },
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        idempotencyKey: true,
        externalId: true,
        state: true,
        currencyId: true,
        userId: true,
        frozenAmountId: true,
      },
    });
    yield* rows;
    let lastRow = rows[3];
    if (!lastRow) {
      return;
    }
    let cursor = lastRow.id;

    while (true) {
      rows = await prisma.payout.findMany({
        take: 4,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          finalized: false,
        },
        orderBy: {
          id: 'asc',
        },
        select: {
          id: true,
          idempotencyKey: true,
          externalId: true,
          state: true,
          currencyId: true,
          userId: true,
          frozenAmountId: true,
        },
      });
      yield* rows;
      lastRow = rows[3];
      if (!lastRow) {
        break;
      }
      cursor = lastRow.id;
    }
  }
}

function isAddressValid(address: string, currency: CurrencyType): boolean {
  switch (currency) {
    case CurrencyType.BTC: {
      return validateCryptoAddress(address, 'Bitcoin');
    }
    case CurrencyType.LTC: {
      return validateCryptoAddress(address, 'LiteCoin');
    }
    case CurrencyType.ETH: {
      return validateCryptoAddress(address, 'Ethereum');
    }
    case CurrencyType.USDT: {
      return validateCryptoAddress(address, 'Ethereum');
    }
    case CurrencyType.TRX: {
      return validateCryptoAddress(address, 'Tron');
    }
    case CurrencyType.USDT_TRX: {
      return validateCryptoAddress(address, 'Tron');
    }
    default: {
      assertNever(currency);
    }
  }
}

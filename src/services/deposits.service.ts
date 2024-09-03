import { Deposit, DepositListing } from '@/interfaces/deposits.interface';
import { prisma } from '@/prisma-client';
import Container, { Service } from 'typedi';
import { CalypsoService } from './calypso.service';
import { randomUUID } from 'node:crypto';
import { CalypsoInvoiceState, CurrencyType } from '@prisma/client';
import { CryptoCurrency as CalypsoCryptoCurrency } from '@/lib/calypso-api';
import { assertNever } from '@/utils/assertNever';
import { logger } from '@/utils/logger';
import { CalypsoEventsService, InvoiceExpiredEvent, InvoiceMempoolFoundEvent, InvoicePaidEvent } from './calypso-events.service';
import { parseUnits } from '@ethersproject/units';
import uniqid from 'uniqid';
import { config } from '@/config';
import { depositCurrencies } from '@/config/deposit-currencies';
import { BigNumber } from '@ethersproject/bignumber';
import { Invoice } from '@/lib/calypso-api/types';
import { getDepositLowerBoundUSD } from '@/config/deposit-limits';
import { CoinbaseService } from './coinbase.service';

export type GetDepositResult =
  | {
      kind: 'OK';
      deposit: Deposit;
    }
  | {
      kind: 'NOT_FOUND_ERR';
    };

export interface CreateDepositOpts {
  userId: number;
  currencyId: CurrencyType;
}

export type CreateDepositResult =
  | {
      kind: 'OK';
      deposit: Deposit;
    }
  | {
      kind: 'CURRENCY_NOT_FOUND';
    };

const DEPOSIT_ID_PREFIX = 'deposit:';

@Service()
export class DepositsService {
  private _calypso = Container.get(CalypsoService);
  private _coinbase = Container.get(CoinbaseService);
  private _tagName = 'DepositsService';
  private _currencyIdToDecimals: Map<CurrencyType, number>;

  constructor() {
    this._currencyIdToDecimals = new Map(depositCurrencies.map(currency => [currency.id, currency.decimals]));
  }

  public async getDepositListingView(userId: number): Promise<DepositListing> {
    const deposits = await prisma.deposit.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        address: true,
        currencyId: true,
        state: true,
        transactionId: true,
      },
    });

    const depositViews: Deposit[] = deposits.map((deposit): Deposit => {
      const depositView: Deposit = {
        id: deposit.id.toString(),
        address: deposit.address.toString(),
        addressQrUrl: createQrUrl(deposit.address),
        currencyId: deposit.currencyId,
        state: deposit.state,
        transactionId: deposit.transactionId.toString(),
      };
      return depositView;
    });

    const listing: DepositListing = {
      items: depositViews,
    };

    return listing;
  }

  public async getDeposit(userId: number, depositId: number): Promise<GetDepositResult> {
    const deposit = await prisma.deposit.findFirst({
      where: {
        id: depositId,
        userId,
      },
      select: {
        id: true,
        address: true,
        currencyId: true,
        state: true,
        transactionId: true,
      },
    });
    if (!deposit) {
      return { kind: 'NOT_FOUND_ERR' };
    }

    const depositView: Deposit = {
      id: deposit.id.toString(),
      address: deposit.address.toString(),
      addressQrUrl: createQrUrl(deposit.address),
      currencyId: deposit.currencyId,
      state: deposit.state,
      transactionId: deposit.transactionId.toString(),
    };

    return { kind: 'OK', deposit: depositView };
  }

  public async createDeposit(opts: CreateDepositOpts): Promise<CreateDepositResult> {
    const currency = depositCurrencies.find(currency => currency.id === opts.currencyId);
    if (!currency) {
      return { kind: 'CURRENCY_NOT_FOUND' };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: opts.userId,
      },
      select: {
        publicId: true,
        telegramUsername: true,
      },
    });

    const idempotencyKey = randomUUID();
    let description = `Top up account ${user.publicId}`;
    if (user.telegramUsername) {
      description += ` (@${user.telegramUsername})`;
    }
    const externalId = DEPOSIT_ID_PREFIX + uniqid();

    let lowerBound = 0;
    const lowerBoundUSD = getDepositLowerBoundUSD(currency.id);
    const exchangeRateResult = await this._coinbase.getCurrencyPriceByTypeCached(currency.id, 'USD');
    switch (exchangeRateResult.kind) {
      case 'NOT_FOUND_ERR': {
        throw new Error('failed to get currency price');
      }
      case 'OK': {
        // fix Calypso error: payload.lowerBound=[Scale incorrect. Must be less than or equal to 6]
        lowerBound = parseFloat((lowerBoundUSD / exchangeRateResult.price).toFixed(6));
        break;
      }
      default: {
        assertNever(exchangeRateResult);
      }
    }

    console.log('lowerBound', lowerBound);

    const createBoundInvoiceResult = await this._calypso.createBoundInvoice({
      lowerBound,
      currency: opts.currencyId,
      description,
      idempotencyKey: idempotencyKey,
      externalId: externalId,
      fiatAvailable: false,
    });

    let remoteInvoice: Invoice;
    switch (createBoundInvoiceResult.kind) {
      case 'API_ERROR': {
        throw new Error(`${createBoundInvoiceResult.errorCode} ${createBoundInvoiceResult.traceId} ${createBoundInvoiceResult.message}`);
      }
      case 'UNKNOWN_ERROR': {
        throw new Error(createBoundInvoiceResult.message);
      }
      case 'OK': {
        remoteInvoice = createBoundInvoiceResult.payload;
        break;
      }
      default: {
        assertNever(createBoundInvoiceResult);
      }
    }

    return await prisma.$transaction<CreateDepositResult>(async ctx => {
      const transaction = await ctx.transaction.create({
        data: {
          type: 'DEPOSIT',
          userId: opts.userId,
          currencyIdInput: opts.currencyId,
          currencyIdOutput: null,
        },
        select: { id: true },
      });

      const deposit = await ctx.deposit.create({
        data: {
          userId: opts.userId,
          currencyId: opts.currencyId,
          transactionId: transaction.id,
          address: remoteInvoice.invoiceAddress,
          idempotencyKey: remoteInvoice.idempotencyKey,
          externalId: externalId,
          valueMin: 0,
          totalDebitAmount: 0,
          state: 'PENDING_PAYMENT',
          finalized: false,
        },
        select: {
          id: true,
        },
      });

      return {
        kind: 'OK',
        deposit: {
          id: deposit.id.toString(),
          address: remoteInvoice.invoiceAddress,
          addressQrUrl: createQrUrl(remoteInvoice.invoiceAddress),
          currencyId: currency.id,
          state: 'PENDING_PAYMENT',
          transactionId: transaction.id.toString(),
        },
      } satisfies CreateDepositResult;
    });
  }

  public async syncDeposits() {
    for await (const deposit of this._iterateUnsyncedDeposits()) {
      const invoiceResult = await this._calypso.getInvoice({
        idempotencyKey: deposit.idempotencyKey,
      });
      switch (invoiceResult.kind) {
        case 'API_ERROR': {
          logger.error(`[${this._tagName}] sync error: ${invoiceResult.errorCode} ${invoiceResult.traceId} ${invoiceResult.message}`);
          continue;
        }
        case 'UNKNOWN_ERROR': {
          logger.error(`[${this._tagName}] sync error: ${invoiceResult.message}`);
          continue;
        }
        case 'OK': {
          break;
        }
        default: {
          assertNever(invoiceResult);
        }
      }

      const invoice = invoiceResult.payload;
      if (invoice.type !== 'BOUND') {
        logger.error(`[${this._tagName}] sync error: wrong type ${invoice.type}`);
        continue;
      }
      if (deposit.state === invoice.state && deposit.state !== 'COMPLETED') {
        logger.debug(`[${this._tagName}] sync: skip record ${invoice.idempotencyKey}`);
        continue;
      }

      const depositCurrency = depositCurrencies.find(currency => currency.id === deposit.currencyId);

      const [updatedDeposit, _update] = await prisma.$transaction([
        prisma.deposit.update({
          where: {
            id: deposit.id,
          },
          data: {
            state: invoice.state,
            amount: invoice.amount,
            totalDebitAmount: invoice.totalDebitAmount,
            fee: invoice.fee,
          },
        }),
        prisma.calypsoInvoiceUpdate.create({
          data: {
            type: invoice.type,
            externalId: deposit.externalId,
            body: invoice,
          },
        }),
      ]);

      if (updatedDeposit.state === 'COMPLETED') {
        await prisma.$transaction([
          prisma.asset.upsert({
            where: {
              ownerId_currencyId: {
                ownerId: deposit.userId,
                currencyId: deposit.currencyId,
              },
            },
            update: {
              amount: { increment: invoice.totalDebitAmount },
            },
            create: {
              ownerId: deposit.userId,
              currencyId: deposit.currencyId,
              amount: invoice.totalDebitAmount,
            },
          }),
          prisma.deposit.update({
            where: {
              id: deposit.id,
            },
            data: {
              finalized: true,
            },
          }),
        ]);
      }
    }
  }

  private async *_iterateUnsyncedDeposits() {
    let rows = await prisma.deposit.findMany({
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
      },
    });
    yield* rows;
    let lastRow = rows[3];
    if (!lastRow) {
      return;
    }
    let cursor = lastRow.id;

    while (true) {
      rows = await prisma.deposit.findMany({
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

function isDepositPublicId(externalId: string) {
  return externalId.startsWith(DEPOSIT_ID_PREFIX);
}

function createDepositQrUrl(depositId: number) {
  return config.PUBLIC_API_URL + '/deposit-qr/' + depositId.toString();
}

function createQrUrl(address: string) {
  return config.PUBLIC_API_URL + '/qr?text=' + encodeURIComponent(address);
}

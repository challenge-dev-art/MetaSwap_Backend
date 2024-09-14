import { config } from '@/config';
import { autoconvertCurrencies } from '@/config/autoconvert-currencies';
import { currencies } from '@/config/currencies';
import { AutoconvertListing as AutoconvertListingView, Autoconvert as AutoconvertView, AutoconvertExecute as AutoconvertList } from '@/interfaces/autoconverts.interface';
import { prisma } from '@/prisma-client';
import { Service } from 'typedi';

export interface CreateAutoconvertOpts {
  userId: number;
  currencyIdFrom: string;
  currencyIdTo: string;
  address: string;
}

export interface ExecuteAutoconvertOpts {
  userId: number;
  autoconvertId: number;
  amount: number;
}

export type CreateAutoconvertResult =
  | {
      kind: 'OK';
      autoconvert: AutoconvertView;
    }
  | {
      kind: 'UNSUPPORTED_CURRENCY_ERR';
    };

export type ExecuteAutoconvertResult =
  | {
    kind: 'OK';
    autoconvert: AutoconvertList;
    }
  | {
      kind: 'UNSUPPORTED_CURRENCY_ERR';
    };

@Service()
export class AutoconvertsService {
  private _idToCurrency = new Map(currencies.map(currency => [currency.id, currency]));
  private _idToAutoconvertCurrency = new Map(autoconvertCurrencies.map(currency => [currency.id as string, currency]));

  public async getAutoconverts(userId: number): Promise<AutoconvertListingView> {
    console.log("_idToCurrency: ", this._idToCurrency);
    console.log("_idToAutoconvertCurrency: ", this._idToAutoconvertCurrency);
    const autoconverts = await prisma.autoconvert.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        address: true,
        currencyIdFrom: true,
        currencyIdTo: true,
      },
    });

    const items: AutoconvertView[] = [];
    for (const autoconvert of autoconverts) {
      const currencyFrom = this._resolveCurrency(autoconvert.currencyIdFrom);
      if (!currencyFrom || currencyFrom.type !== 'CRYPTO') {
        continue;
      }
      const currencyTo = this._resolveCurrency(autoconvert.currencyIdTo);
      if (!currencyTo || currencyTo.type !== 'CRYPTO') {
        continue;
      }
      items.push({
        id: autoconvert.id.toString(),
        address: autoconvert.address,
        addressQrUrl: createQrUrl(autoconvert.address),
        currencyFrom,
        currencyTo,
      });
    }

    return { items } satisfies AutoconvertListingView;
  }

  public async createAutoconvert(opts: CreateAutoconvertOpts): Promise<CreateAutoconvertResult> {
    const currencyFrom = this._resolveAutoconvertCurrency(opts.currencyIdFrom);
    if (!currencyFrom) {
      return { kind: 'UNSUPPORTED_CURRENCY_ERR' };
    }
    const currencyTo = this._resolveAutoconvertCurrency(opts.currencyIdTo);
    if (!currencyTo) {
      return { kind: 'UNSUPPORTED_CURRENCY_ERR' };
    }

    const autoconvert = await prisma.autoconvert.create({
      data: {
        userId: opts.userId,
        address: opts.address,
        currencyIdFrom: currencyFrom.id,
        currencyIdTo: currencyTo.id,
      },
      select: {
        id: true,
        address: true
      },
    });

    return {
      kind: 'OK',
      autoconvert: {
        id: autoconvert.id.toString(),
        address: autoconvert.address,
        addressQrUrl: createQrUrl(autoconvert.address),
        currencyFrom,
        currencyTo,
      },
    };
  }

  public async executeAutoconvert(opts: ExecuteAutoconvertOpts): Promise<ExecuteAutoconvertResult> {
    const autoconvert = await prisma.autoconvert.findUnique({
      where: {
        id: opts.autoconvertId,
      },
      select: {
        id: true,
        address: true,
        currencyIdFrom: true,
        currencyIdTo: true,
      },
    });
    if (!autoconvert) {
      return { kind: 'UNSUPPORTED_CURRENCY_ERR' };
    }
    return {
      kind: 'OK',
      autoconvert: {
        id: autoconvert.id.toString(),
        address: autoconvert.address,
        addressQrUrl: createQrUrl(autoconvert.address),
        currencyFrom: autoconvert.currencyIdFrom,
        currencyTo: autoconvert.currencyIdTo,
        amount: opts.amount
      }
    };
  }

  private _resolveAutoconvertCurrency(currencyId: string) {
    return this._idToAutoconvertCurrency.get(currencyId);
  }

  private _resolveCurrency(currencyId: string) {
    return this._idToCurrency.get(currencyId);
  }
}

function createQrUrl(address: string) {
  return config.PUBLIC_API_URL + '/qr?text=' + encodeURIComponent(address);
}

import { Service } from 'typedi';
import { prisma } from '@/prisma-client';
import { Asset as AssetView, AssetListing as AssetListingView } from '@/interfaces/assets.interface';
import { currencies } from '@/config/currencies';
import { BigNumber, FixedNumber } from '@ethersproject/bignumber';
import { DEFAULT_PRICE_CURRENCY, priceCurrencies } from '@/config/price-currencies';
import { FiatCurrency } from '@/interfaces/currencies.interface';
import { Container } from 'typedi';
import { CoinbaseService, GetCurrencyPriceResult } from './coinbase.service';
import { assertNever } from '@/utils/assertNever';
import { logger } from '@/utils/logger';
import { DEFAULT_FIAT_DECIMALS } from '@/config';

@Service()
export class AssetsService {
  public asset = prisma.asset;

  private _coinbaseApi = Container.get(CoinbaseService);
  private _tagName = 'AssetsService';

  public async getAssetListingView(userId: number): Promise<AssetListingView> {
    const priceCurrency = await this._resolvePriceCurrency(userId);

    const existsAssets = await this.asset.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        currencyId: true,
        amount: true,
      },
    });
    const currencyIdToExistsAsset = new Map(existsAssets.map(asset => [asset.currencyId as string, asset]));

    const assetViews: AssetView[] = [];
    for (const currency of currencies) {
      const existsAsset = currencyIdToExistsAsset.get(currency.id);
      if (!existsAsset) {
        const assetView: AssetView = {
          id: currency.id,
          type: currency.type,
          currencyId: currency.id,
          currency,
          value: 0,
          price: 0,
          priceCurrency: priceCurrency,
        };
        assetViews.push(assetView);
      } else {
        let currencyPrice = -1;
        let currencyPriceResult: GetCurrencyPriceResult | null = null;
        try {
          currencyPriceResult =
            currency.type === 'CRYPTO'
              ? await this._coinbaseApi.getCurrencyPriceByTypeCached(currency.id, priceCurrency.code)
              : await this._coinbaseApi.getCurrencyPriceCached(currency.code, priceCurrency.code);
        } catch (error) {
          logger.error(`[${this._tagName}] failed to fetch currency rate ${currency.id}-${priceCurrency.code}`);
        }
        if (currencyPriceResult && currencyPriceResult.kind === 'OK') {
          currencyPrice = currencyPriceResult.price;
        }

        let decimals: number;
        if (currency.type === 'CRYPTO') {
          decimals = currency.decimals;
        } else if (currency.type === 'FIAT') {
          decimals = DEFAULT_FIAT_DECIMALS;
        }

        const value = existsAsset.amount;
        const price = currencyPrice === -1 ? -1 : value * currencyPrice;
        const assetView: AssetView = {
          id: currency.id,
          type: currency.type,
          currencyId: currency.id,
          currency,
          value: parseFloat(value.toFixed(4)),
          price: parseFloat(price.toFixed(2)),
          priceCurrency: priceCurrency,
        };
        assetViews.push(assetView);
      }
    }

    return { items: assetViews };
  }

  private async _resolvePriceCurrency(userId: number): Promise<FiatCurrency> {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        priceCurrency: true,
      },
    });

    const priceCurrency = user.priceCurrency
      ? priceCurrencies.find(({ id }) => id === user.priceCurrency) ?? DEFAULT_PRICE_CURRENCY
      : DEFAULT_PRICE_CURRENCY;

    return priceCurrency;
  }
}

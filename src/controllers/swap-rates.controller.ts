import { NextFunction, Response } from 'express';
import { SwapRatesRequest, SwapRatesResponse } from '@/interfaces/swap-rates.interface';
import { convertCryptoAmount } from '@/utils/getCryptoRates';

export class SwapRatesController {
  public getRates = async (_req: SwapRatesRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { currencyFrom, currencyTo } = _req.body;
      const response = await convertCryptoAmount(currencyFrom, currencyTo);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

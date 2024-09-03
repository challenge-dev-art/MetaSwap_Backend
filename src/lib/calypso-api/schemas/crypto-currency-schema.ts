import { literal, union } from 'zod';

export const CryptoCurrencySchema = union([
  literal('BTC'),
  literal('XDG'),
  literal('ETH'),
  literal('MATIC'),
  literal('USDT'),
  literal('FRAX'),
  literal('DAI'),
  literal('USDC'),
  literal('TRX'),
  literal('USDT_TRX'),
  literal('USDC_TRX'),
  literal('BNB'),
  literal('USDT_BSC'),
  literal('USDT_MATIC'),
  literal('LTC'),
]);

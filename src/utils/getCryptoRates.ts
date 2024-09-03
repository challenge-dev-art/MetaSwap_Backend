import axios from 'axios';

enum CurrencyType {
  BTC = 'bitcoin',
  ETH = 'ethereum',
  USDT = 'tether',
  LTC = 'litecoin',
  TRX = 'tron',
}

// Конфигурация криптовалют
const cryptoIds = {
  BTC: CurrencyType.BTC,
  ETH: CurrencyType.ETH,
  USDT: CurrencyType.USDT,
  LTC: CurrencyType.LTC,
  TRX: CurrencyType.TRX,
};

// Получение курсов обмена
async function getCryptoExchangeRates(): Promise<Record<string, number>> {
  try {
    const ids = Object.values(cryptoIds).join(',');
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids,
        vs_currencies: 'usd',
      },
    });

    const rates = response.data;
    const exchangeRates: Record<string, number> = {};

    for (const [key, value] of Object.entries(cryptoIds)) {
      exchangeRates[key] = rates[value]?.usd ?? 0;
    }

    return exchangeRates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
}

// Конвертация суммы из одной криптовалюты в другую
export async function convertCryptoAmount(
  currencyFrom: string,
  currencyTo: number,
): Promise<{ rate: number; currencyTo: number; currencyFrom: string }> {
  const rates = await getCryptoExchangeRates();

  if (!rates[currencyFrom] || !rates[currencyTo]) {
    throw new Error('Invalid currency symbol');
  }
  const fromRate = rates[currencyFrom];
  const toRate = rates[currencyTo];

  const rate = fromRate / toRate;
  // const convertedAmount = amount * exchangeRate;

  return {
    currencyFrom,
    currencyTo,
    rate,
  };
}

import AppError from '../errors/AppError';

interface Company {
  symbol: string;
  pricePerShare: number;
}
const data: Company[] = [
  {
    symbol: 'AAPL',
    pricePerShare: 125.0,
  },
  {
    symbol: 'TSLA',
    pricePerShare: 600.0,
  },
  {
    symbol: 'AMZN',
    pricePerShare: 150.0,
  },
];

const getPrice = (symbol: string): number => {
  for (const i of data) {
    if (i.symbol === symbol) {
      return i.pricePerShare;
    }
  }

  throw new Error(`${symbol} is not a valid symbol`);
};

export { getPrice };

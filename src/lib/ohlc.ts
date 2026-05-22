export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateCandles(id: string, basePrice: number, count = 84): Candle[] {
  const rand = seededRand(hashSeed(id));
  const now = Date.now();
  const candles: Candle[] = [];
  let price = basePrice;

  for (let i = count; i >= 0; i--) {
    const volatility = price * 0.04;
    const change = (rand() - 0.5) * volatility * 2;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + rand() * volatility * 0.6;
    const low = Math.min(open, close) - rand() * volatility * 0.6;
    const volume = (rand() * 0.8 + 0.2) * basePrice * 50000;

    candles.push({
      time: now - i * 3600 * 1000,
      open: Math.max(open, 0.0001),
      high: Math.max(high, 0.0001),
      low: Math.max(low, 0.0001),
      close: Math.max(close, 0.0001),
      volume,
    });

    price = close;
  }

  return candles;
}

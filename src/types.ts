export type Stage = 'pre-bonding' | 'bonding' | 'launched' | 'graduated';

export interface Compound {
  id: string;
  name: string;
  symbol: string;
  description: string;
  stage: Stage;
  location: string;
  holders: number;
  volume24h: number;
  price: number;
  bondingProgress: number;
  funding: number;
  fundingTarget: number;
  elationPoints: number;
  marketCap: number;
  priceChange24h: number;
}

export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  label: string;
  pnl: number;
  trades: number;
  elationPoints: number;
  favoriteVial: string;
}

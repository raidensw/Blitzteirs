export enum TierRank {
  HT1 = 'HT1',
  LT1 = 'LT1',
  HT2 = 'HT2',
  LT2 = 'LT2',
  HT3 = 'HT3',
  LT3 = 'LT3',
  HT4 = 'HT4',
  LT4 = 'LT4',
  HT5 = 'HT5',
  LT5 = 'LT5',
  UNRANKED = '-'
}

export enum GameMode {
  OVERALL = 'Overall',
  BLISS = 'Bliss',
  STRENGTH = 'Strength',
  SPEED_BOXING = 'Speed Boxing',
  QUICKDROP = 'Quickdrop',
  REGEAR = 'Regear',
  BLITZMACE = 'Blitzmace',
  SKY_WARS = 'Sky wars',
  INFUSE = 'Infuse'
}

export type ViewState = 'TIERLIST' | 'GUIDE' | 'MOD' | 'API' | 'PROFILE';

export interface PlayerStats {
  points: number;
  wins: number;
  losses: number;
  wlr: number;
  kills: number;
  deaths: number;
  kdr: number;
}

export interface Player {
  id: string;
  rank: number;
  username: string;
  uuid: string;
  region: string;
  role: string;
  stats: PlayerStats;
  tiers: Partial<Record<GameMode, TierRank>>;
  badges: string[];
  password?: string;
}
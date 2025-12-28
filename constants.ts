import { TierRank, GameMode } from './types';

// Point values based on user request
export const TIER_POINTS: Record<TierRank, number> = {
  [TierRank.HT1]: 60,
  [TierRank.LT1]: 45,
  [TierRank.HT2]: 30,
  [TierRank.LT2]: 20,
  [TierRank.HT3]: 10, 
  [TierRank.LT3]: 6,
  [TierRank.HT4]: 4,
  [TierRank.LT4]: 3, 
  [TierRank.HT5]: 2, 
  [TierRank.LT5]: 1, 
  [TierRank.UNRANKED]: 0
};

export const TIER_STYLE: Record<string, string> = {
  'HT1': 'text-[#FFD700] border-[#FFD700] bg-[#FFD700]/10', // Gold
  'LT1': 'text-[#E5E4E2] border-[#E5E4E2] bg-[#E5E4E2]/10', // Platinum/White
  'HT2': 'text-[#A0A0A0] border-[#A0A0A0] bg-[#A0A0A0]/10', // Silver
  'LT2': 'text-[#A0A0A0] border-[#A0A0A0] bg-[#A0A0A0]/10',
  'HT3': 'text-[#CD7F32] border-[#CD7F32] bg-[#CD7F32]/10', // Bronze
  'LT3': 'text-[#CD7F32] border-[#CD7F32] bg-[#CD7F32]/10',
  'HT4': 'text-[#505050] border-[#505050] bg-[#505050]/10', // Iron
  'LT4': 'text-[#505050] border-[#505050] bg-[#505050]/10',
  'HT5': 'text-[#404040] border-[#404040] bg-[#404040]/10', // Coal
  '-': 'text-gray-700 border-gray-700 bg-transparent opacity-20'
};

// Icons mapping for the new modes
// Using URLs for Minecraft items and SVG paths for UI icons (Overall/Regear)
export const GAMEMODE_ICONS: Record<GameMode, string> = {
  // SVG Path for Trophy
  [GameMode.OVERALL]: "M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm8 8c-1.65 0-3-1.35-3-3V5h4v8c0 1.65-1.35 3-3 3zm6-5.18V7h2v1c0 1.3-.84 2.4-2 2.82V10.82z", 
  
  [GameMode.BLISS]: "https://minecraft.wiki/images/Amethyst_Shard_JE2_BE1.png",
  [GameMode.STRENGTH]: "https://minecraft.wiki/images/Potion_of_Strength_JE2_BE2.png",
  [GameMode.SPEED_BOXING]: "https://minecraft.wiki/images/Sugar_JE2_BE2.png",
  [GameMode.QUICKDROP]: "https://minecraft.wiki/images/Shield_JE2_BE1.png",
  
  // SVG Path for Regear (Archive Box) - Reliable and clean
  [GameMode.REGEAR]: "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z",
  
  [GameMode.BLITZMACE]: "https://minecraft.wiki/images/Mace_JE1_BE1.png",
  [GameMode.SKY_WARS]: "https://minecraft.wiki/images/Grass_Block_JE7_BE6.png",
  [GameMode.INFUSE]: "https://minecraft.wiki/images/Iron_Sword_JE2_BE2.png"
};
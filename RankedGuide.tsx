import React, { useState } from 'react';
import { TierRank } from '../types';
import { TIER_POINTS, TIER_STYLE } from '../constants';

export const RankedGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TITLES' | 'POINTS'>('POINTS');

  // Specific order for the points table based on the user screenshot request
  const tierLevels = [
    { name: 'Tier 1', high: { rank: TierRank.HT1, pts: 60 }, low: { rank: TierRank.LT1, pts: 45 }, icon: '🏆' },
    { name: 'Tier 2', high: { rank: TierRank.HT2, pts: 30 }, low: { rank: TierRank.LT2, pts: 20 }, icon: '🥈' },
    { name: 'Tier 3', high: { rank: TierRank.HT3, pts: 10 }, low: { rank: TierRank.LT3, pts: 6 }, icon: '🥉' },
    { name: 'Tier 4', high: { rank: TierRank.HT4, pts: 4 }, low: { rank: TierRank.LT4, pts: 3 }, icon: '' },
    { name: 'Tier 5', high: { rank: TierRank.HT5, pts: 2 }, low: { rank: TierRank.LT5, pts: 1 }, icon: '' },
  ];

  const titles = [
    { name: 'Combat Grandmaster', req: '400+', color: 'text-yellow-400', icon: '✨' },
    { name: 'Combat Master', req: '250+', color: 'text-yellow-500', icon: '💠' },
    { name: 'Combat Ace', req: '100+', color: 'text-red-400', icon: '♦' },
    { name: 'Combat Specialist', req: '50+', color: 'text-purple-400', icon: '⚛' },
    { name: 'Combat Cadet', req: '20+', color: 'text-blue-400', icon: '🔹' },
    { name: 'Combat Novice', req: '10+', color: 'text-blue-300', icon: '🔹' },
    { name: 'Rookie', req: '< 10', color: 'text-gray-400', icon: '⚪' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-[#111115] border border-[#2a2a2e] rounded-xl overflow-hidden shadow-2xl">
        
        {/* Header Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#18181b] border-b border-[#2a2a2e]">
             <button 
                onClick={() => setActiveTab('TITLES')}
                className={`py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'TITLES' ? 'bg-[#2a2a2e] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
             >
                Titles
             </button>
             <button 
                onClick={() => setActiveTab('POINTS')}
                className={`py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'POINTS' ? 'bg-[#2a2a2e] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
             >
                Points
             </button>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
            
            {activeTab === 'POINTS' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-white font-bold mb-1">How ranking points are calculated</h3>
                    <p className="text-xs text-gray-500 mb-6">Points are awarded based on your highest tier in each gamemode.</p>
                    
                    <div className="space-y-6">
                        {tierLevels.map((tier, idx) => (
                            <div key={idx}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{tier.icon}</span>
                                    <span className="text-gray-300 font-bold text-sm">{tier.name}</span>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-[#18181b] border border-[#2a2a2e] rounded p-2 flex items-center justify-between group hover:border-mc-gold/30 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-8 bg-mc-gold rounded-full"></div>
                                            <span className="text-xs text-mc-gold font-bold">High Tier</span>
                                        </div>
                                        <span className="text-mc-gold font-bold">{tier.high.pts} Points</span>
                                    </div>
                                    <div className="flex-1 bg-[#18181b] border border-[#2a2a2e] rounded p-2 flex items-center justify-between group hover:border-gray-500/30 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-8 bg-gray-500 rounded-full"></div>
                                            <span className="text-xs text-gray-400 font-bold">Low Tier</span>
                                        </div>
                                        <span className="text-gray-400 font-bold">{tier.low.pts} Points</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'TITLES' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-white font-bold mb-1">How to obtain Achievement Titles</h3>
                    <p className="text-xs text-gray-500 mb-6">Titles are automatically assigned based on your total points sum.</p>

                    <div className="space-y-4">
                        {titles.map((t, i) => (
                            <div key={i} className="flex items-center gap-4 bg-[#18181b] p-3 rounded-lg border border-[#2a2a2e] hover:bg-[#202023] transition-colors">
                                <div className="text-xl">{t.icon}</div>
                                <div>
                                    <div className={`font-bold text-sm ${t.color}`}>{t.name}</div>
                                    <div className="text-xs text-gray-500">Obtained {t.req} total points.</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
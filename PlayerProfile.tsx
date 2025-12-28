import React, { useState, useEffect } from 'react';
import { Player, GameMode, TierRank } from '../types';
import { TIER_STYLE, GAMEMODE_ICONS, TIER_POINTS } from '../constants';

interface PlayerProfileProps {
  player: Player;
  isAdmin: boolean;
  onBack: () => void;
  onUpdate: (player: Player) => void;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ player, isAdmin, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Player>(player);

  // Reset form when player changes
  useEffect(() => {
    setEditForm(player);
    setIsEditing(false);
  }, [player]);

  const handleToggleAdmin = () => {
      // Logic removed: We don't need role-based admin assignment anymore since it's password based.
      // Keeping function stub if we want to add badges later.
  };

  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Player, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (field: keyof Player['stats'], value: number) => {
    setEditForm(prev => ({
      ...prev,
      stats: { ...prev.stats, [field]: value }
    }));
  };

  const handleTierChange = (mode: GameMode, rank: TierRank) => {
    setEditForm(prev => {
      const updatedTiers = { ...prev.tiers, [mode]: rank };
      
      // Auto-calculate points based on new tiers
      let newPoints = 0;
      Object.values(updatedTiers).forEach(tierRank => {
          // Ensure we look up the points correctly, handling potential undefined
          if (tierRank && TIER_POINTS[tierRank as TierRank] !== undefined) {
              newPoints += TIER_POINTS[tierRank as TierRank];
          }
      });

      return {
        ...prev,
        tiers: updatedTiers,
        stats: {
            ...prev.stats,
            points: newPoints
        }
      };
    });
  };

  // Helper to determine title based on points
  const getPlayerTitle = (points: number) => {
    if (points >= 400) return { name: 'Combat Grandmaster', color: 'text-yellow-400', border: 'border-yellow-400/50 bg-yellow-400/10', icon: '✨' };
    if (points >= 250) return { name: 'Combat Master', color: 'text-yellow-500', border: 'border-yellow-500/50 bg-yellow-500/10', icon: '💠' };
    if (points >= 100) return { name: 'Combat Ace', color: 'text-red-400', border: 'border-red-400/50 bg-red-400/10', icon: '♦' };
    if (points >= 50) return { name: 'Combat Specialist', color: 'text-purple-400', border: 'border-purple-400/50 bg-purple-400/10', icon: '⚛' };
    if (points >= 20) return { name: 'Combat Cadet', color: 'text-blue-400', border: 'border-blue-400/50 bg-blue-400/10', icon: '🔹' };
    if (points >= 10) return { name: 'Combat Novice', color: 'text-blue-300', border: 'border-blue-300/50 bg-blue-300/10', icon: '🔹' };
    return { name: 'Rookie', color: 'text-gray-400', border: 'border-gray-400/50 bg-gray-400/10', icon: '⚪' };
  };

  const currentTitle = getPlayerTitle(editForm.stats.points);

  // Helper to render icon
  const renderModeIcon = (mode: GameMode) => {
    const iconSource = GAMEMODE_ICONS[mode] || GAMEMODE_ICONS[GameMode.OVERALL];
    if (iconSource.startsWith('http')) {
        return <img src={iconSource} className="w-8 h-8 mb-2 object-contain" alt={mode} />;
    }
    return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 mb-2 fill-current text-gray-400">
            <path d={iconSource} />
        </svg>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 mt-4">
      <div className="flex justify-between items-center mb-8">
        <button 
            onClick={onBack}
            className="text-gray-500 hover:text-white text-sm font-bold flex items-center gap-2"
        >
            &larr; BACK TO RANKINGS
        </button>

        {isAdmin && !isEditing && (
            <button 
                onClick={() => setIsEditing(true)}
                className="bg-mc-gold hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded text-sm transition-colors"
            >
                EDIT PROFILE
            </button>
        )}

        {isEditing && (
             <div className="flex gap-2">
                <button 
                    onClick={() => setIsEditing(false)}
                    className="bg-[#2a2a2e] hover:bg-[#3f3f46] text-white font-bold px-4 py-2 rounded text-sm transition-colors"
                >
                    CANCEL
                </button>
                <button 
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded text-sm transition-colors"
                >
                    SAVE CHANGES
                </button>
             </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col: Avatar & Basic Info */}
        <div className="md:col-span-1 space-y-4">
            <div className="bg-[#18181b] border border-[#2a2a2e] rounded-lg p-6 flex flex-col items-center text-center">
                <div className="relative group">
                    <img 
                        src={`https://minotar.net/skin/${editForm.username}`} 
                        alt="skin"
                        className="w-32 h-64 object-contain mb-4 drop-shadow-2xl"
                    />
                    {/* Rank Badge Floating */}
                    <div className="absolute top-0 right-0 bg-[#0f0f13] text-white text-xs font-bold px-2 py-1 rounded border border-[#2a2a2e]">
                        #{player.rank}
                    </div>
                </div>
                
                {isEditing ? (
                    <div className="w-full mb-4">
                        <label className="text-xs text-gray-500 font-bold uppercase block text-left mb-1">Username</label>
                        <input 
                            type="text" 
                            value={editForm.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                            className="w-full bg-black/20 border border-[#2a2a2e] rounded px-2 py-1 text-white text-center font-bold focus:outline-none focus:border-mc-gold"
                        />
                    </div>
                ) : (
                    <h1 className="text-2xl font-bold text-white mb-1">{player.username}</h1>
                )}

                {/* DYNAMIC TITLE DISPLAY */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 ${currentTitle.color} ${currentTitle.border}`}>
                    <span className="text-lg">{currentTitle.icon}</span>
                    <span className="font-bold text-sm uppercase tracking-wide">{currentTitle.name}</span>
                </div>

                <div className="flex gap-2 mb-4 flex-wrap justify-center">
                    {/* Badge Display */}
                    {player.badges.map(b => (
                        <span key={b} className="text-[10px] font-bold bg-mc-gold/10 text-mc-gold px-2 py-1 rounded border border-mc-gold/20 uppercase tracking-wide">
                            {b}
                        </span>
                    ))}
                </div>
                
                <div className="w-full h-px bg-[#2a2a2e] my-4"></div>
                
                <div className="grid grid-cols-2 gap-4 w-full text-sm">
                    <div>
                        <div className="text-gray-500 text-xs uppercase font-bold">Region</div>
                        {isEditing ? (
                             <select 
                                value={editForm.region}
                                onChange={(e) => handleChange('region', e.target.value)}
                                className="w-full bg-black/20 border border-[#2a2a2e] rounded px-1 py-1 text-white text-xs mt-1"
                             >
                                <option value="NA">NA</option>
                                <option value="EU">EU</option>
                                <option value="AS">AS</option>
                                <option value="SA">SA</option>
                             </select>
                        ) : (
                            <div className="text-white font-mono">{player.region}</div>
                        )}
                    </div>
                     <div>
                        <div className="text-gray-500 text-xs uppercase font-bold">Points</div>
                        {isEditing ? (
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={editForm.stats.points}
                                    readOnly
                                    className="w-full bg-black/20 border border-[#2a2a2e] rounded px-1 py-1 text-gray-400 text-xs mt-1 text-center font-mono cursor-not-allowed"
                                    title="Points are calculated automatically from tiers"
                                />
                                <div className="text-[10px] text-gray-600 mt-1">Auto-calculated</div>
                            </div>
                        ) : (
                            <div className="text-white font-mono">{player.stats.points}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Right Col: Detailed Stats & Tiers */}
        <div className="md:col-span-2 space-y-6">
            
            {/* Tiers Grid */}
            <div className="bg-[#18181b] border border-[#2a2a2e] rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Tier Overview</h3>
                    {isEditing && <span className="text-xs text-mc-gold animate-pulse">EDITING TIERS</span>}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.values(GameMode).filter(m => m !== GameMode.OVERALL).map(mode => {
                         const rank = editForm.tiers[mode] || TierRank.UNRANKED;
                         const style = TIER_STYLE[rank] || TIER_STYLE['-'];
                         const isUnranked = rank === TierRank.UNRANKED;
                         
                         return (
                            <div key={mode} className={`bg-[#0f0f13] rounded-xl p-4 border ${isEditing ? 'border-mc-gold/50' : 'border-[#2a2a2e]'} flex flex-col items-center justify-between min-h-[140px] hover:border-gray-600 transition-colors group`}>
                                {/* Icon */}
                                <div className="group-hover:scale-110 transition-transform duration-300">
                                    {renderModeIcon(mode)}
                                </div>
                                
                                <span className="text-xs text-gray-500 font-bold uppercase text-center">{mode}</span>
                                
                                {isEditing ? (
                                    <select 
                                        value={rank}
                                        onChange={(e) => handleTierChange(mode, e.target.value as TierRank)}
                                        className="w-full mt-2 bg-[#18181b] text-white text-xs border border-[#2a2a2e] rounded px-1 py-1 focus:border-mc-gold focus:outline-none appearance-none text-center font-bold"
                                    >
                                        {Object.values(TierRank).map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className={`mt-2 w-full text-center py-1 rounded font-black text-sm border ${style.replace('bg-', 'bg-opacity-20 bg-')}`}>
                                        {isUnranked ? '-' : rank}
                                    </div>
                                )}
                            </div>
                         );
                    })}
                </div>
            </div>

            {/* Combat Stats */}
            <div className="bg-[#18181b] border border-[#2a2a2e] rounded-lg p-6">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Combat Record</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {isEditing ? (
                        <>
                             <StatInput label="Wins" value={editForm.stats.wins} onChange={(v) => handleStatChange('wins', v)} />
                             <StatInput label="Losses" value={editForm.stats.losses} onChange={(v) => handleStatChange('losses', v)} />
                             <StatInput label="Kills" value={editForm.stats.kills} onChange={(v) => handleStatChange('kills', v)} />
                             <StatInput label="Deaths" value={editForm.stats.deaths} onChange={(v) => handleStatChange('deaths', v)} />
                        </>
                    ) : (
                        <>
                            <StatItem label="Wins" value={player.stats.wins} />
                            <StatItem label="Losses" value={player.stats.losses} />
                            <StatItem label="W/L Ratio" value={player.stats.wlr} />
                            <StatItem label="K/D Ratio" value={player.stats.kdr} />
                        </>
                    )}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value }: { label: string, value: string | number }) => (
    <div>
        <div className="text-xs text-gray-600 font-bold uppercase mb-1">{label}</div>
        <div className="text-2xl font-mono text-white tracking-tight">{value}</div>
    </div>
);

const StatInput = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => (
    <div>
        <div className="text-xs text-mc-gold font-bold uppercase mb-1">{label}</div>
        <input 
            type="number" 
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            className="w-full bg-black/20 border border-[#2a2a2e] rounded px-2 py-1 text-white font-mono text-xl focus:border-mc-gold focus:outline-none"
        />
    </div>
);

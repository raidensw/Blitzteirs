import React, { useState } from 'react';
import { db } from '../services/db';
import { Player } from '../types';

interface AuthProps {
  onLoginSuccess: (player: Player) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState<Player['region']>('NA');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const user = await db.login(username, password);
        onLoginSuccess(user);
      } else {
        const user = await db.register(username, password, region);
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-[#18181b] border border-[#2a2a2e] rounded-xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black italic text-white mb-2">
            {isLogin ? 'WELCOME BACK' : 'JOIN THE FIGHT'}
          </h2>
          <p className="text-gray-500 text-sm">
            {isLogin ? 'Sign in to manage your profile' : 'Create an account to start ranking'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Minecraft Username</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-[#0f0f13] border border-[#2a2a2e] rounded px-4 py-3 text-white focus:border-mc-gold focus:outline-none transition-colors"
                placeholder="Steve"
                required
              />
              {/* Skin Preview */}
              <div className="w-12 h-12 bg-[#0f0f13] border border-[#2a2a2e] rounded flex items-center justify-center overflow-hidden shrink-0">
                {username ? (
                  <img src={`https://minotar.net/helm/${username}/40.png`} alt="Skin" className="w-full h-full" />
                ) : (
                  <div className="text-gray-700">?</div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0f0f13] border border-[#2a2a2e] rounded px-4 py-3 text-white focus:border-mc-gold focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Region</label>
              <select 
                value={region}
                onChange={(e) => setRegion(e.target.value as Player['region'])}
                className="w-full bg-[#0f0f13] border border-[#2a2a2e] rounded px-4 py-3 text-white focus:border-mc-gold focus:outline-none transition-colors appearance-none"
              >
                <option value="NA">North America (NA)</option>
                <option value="EU">Europe (EU)</option>
                <option value="AS">Asia (AS)</option>
                <option value="SA">South America (SA)</option>
              </select>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-mc-gold hover:bg-yellow-500 text-black font-bold py-3 rounded transition-transform hover:scale-[1.02] mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'LOADING...' : (isLogin ? 'LOG IN' : 'CREATE ACCOUNT')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setUsername('');
                setPassword('');
            }}
            className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};
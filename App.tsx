import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TierTable } from './components/TierTable';
import { PlayerProfile } from './components/PlayerProfile';
import { ModDownload } from './components/ModDownload';
import { ApiDocs } from './components/ApiDocs';
import { RankedGuide } from './components/RankedGuide';
import { ViewState, Player } from './types';
import { db } from './services/db';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('TIERLIST'); 
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Real-time subscription to Firebase
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = db.subscribePlayers(
      (updatedPlayers) => {
        setPlayers(updatedPlayers);
        setIsLoading(false);
        setDbError(null);
      },
      (error) => {
        console.error("DB Error:", error);
        setIsLoading(false);
        setDbError(error.message || "Unknown Database Error");
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentView === 'PROFILE' && !selectedPlayer) {
      setCurrentView('TIERLIST');
    }
  }, [currentView, selectedPlayer]);

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setCurrentView('PROFILE');
  };

  const handleAdminClick = () => {
      if (isAdmin) {
          setIsAdmin(false);
          return;
      }
      setShowAdminModal(true);
      setAdminPassword('');
  };

  const submitAdminLogin = () => {
      if (adminPassword === "12/18/26-steve") {
          setIsAdmin(true);
          setShowAdminModal(false);
      } else {
          alert("Incorrect Password");
      }
  };

  const handlePlayerUpdate = async (updatedPlayer: Player) => {
      // Optimistic update locally
      setSelectedPlayer(updatedPlayer);

      // Send to DB
      try {
        await db.updatePlayer(updatedPlayer);
      } catch (e) {
        console.error("Failed to update player", e);
      }
  };

  const renderContent = () => {
    // 1. Error State
    if (dbError) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] text-center p-8 animate-in fade-in">
                <div className="text-yellow-500 text-6xl mb-4">🛠️</div>
                <h2 className="text-2xl font-bold text-white mb-2">Setup Required</h2>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    The app is ready, but it needs to connect to your database to store player data.
                </p>
                
                <div className="bg-[#18181b] p-6 rounded-lg text-left border border-[#2a2a2e] max-w-lg w-full shadow-2xl">
                    <p className="text-sm text-mc-gold font-bold mb-3 uppercase tracking-wider">Quick Fix:</p>
                    <ol className="list-decimal list-inside text-sm text-gray-400 space-y-3 mb-6">
                        <li>Go to <a href="https://console.firebase.google.com" target="_blank" className="text-blue-400 hover:underline">Firebase Console</a>.</li>
                        <li>Create a project (or use <strong>bliz-teirs</strong>).</li>
                        <li>Create a <strong>Firestore Database</strong>.</li>
                        <li>Go to <strong>Rules</strong> tab and set them to test mode (allow read/write).</li>
                    </ol>
                    <div className="text-xs text-gray-600 italic border-t border-[#2a2a2e] pt-3 break-all">
                        Technical Error: {dbError}
                    </div>
                </div>
            </div>
        );
    }

    // 2. Loading State
    if (isLoading && players.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-[50vh] gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mc-gold"></div>
          <p className="text-gray-500 text-sm animate-pulse">Syncing with server...</p>
        </div>
      );
    }

    // 3. Main Content
    switch (currentView) {
      case 'TIERLIST':
        return <TierTable players={players} onSelectPlayer={handlePlayerSelect} isAdmin={isAdmin} />;
      case 'PROFILE':
        return selectedPlayer ? (
          <PlayerProfile 
            player={selectedPlayer} 
            isAdmin={isAdmin}
            onUpdate={handlePlayerUpdate}
            onBack={() => setCurrentView('TIERLIST')} 
          />
        ) : null;
      case 'MOD':
        return <ModDownload />;
      case 'GUIDE':
         return <RankedGuide />;
      case 'API':
         if (isAdmin) {
            return <ApiDocs />;
         } else {
             return (
                 <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
                     <div className="text-red-500 text-6xl mb-4">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                     </div>
                     <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                     <p className="text-gray-500">You need Admin Mode enabled.</p>
                 </div>
             );
         }
      default:
        return <div>Not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white font-sans selection:bg-mc-gold selection:text-black pb-10 relative">
      <Navbar 
        currentView={currentView} 
        setView={setCurrentView} 
        isAdmin={isAdmin}
        onAdminLogin={handleAdminClick}
      />
      <main>
        {renderContent()}
      </main>

      {/* Admin Login Modal */}
      {showAdminModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-[#18181b] border border-[#2a2a2e] p-8 rounded-lg max-w-sm w-full shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">Admin Access</h3>
                  <input 
                    type="password" 
                    placeholder="Enter Password" 
                    autoFocus
                    className="w-full bg-[#0f0f13] border border-[#2a2a2e] rounded px-4 py-2 text-white mb-4 focus:border-mc-gold outline-none"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitAdminLogin()}
                  />
                  <div className="flex gap-2">
                      <button 
                        onClick={() => setShowAdminModal(false)}
                        className="flex-1 bg-[#2a2a2e] hover:bg-[#3f3f46] text-white py-2 rounded font-bold"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={submitAdminLogin}
                        className="flex-1 bg-mc-gold hover:bg-yellow-500 text-black py-2 rounded font-bold"
                      >
                        Unlock
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

export default App;
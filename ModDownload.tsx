import React from 'react';

export const ModDownload: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 mt-12">
      <div className="bg-[#18181b] border border-[#2a2a2e] rounded-lg p-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Blize Tiers Mod</h2>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            A lightweight Fabric client mod that displays tier information in the tab list and above player nametags.
        </p>

        <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-[#0f0f13] border border-[#2a2a2e] p-6 rounded">
                <h3 className="font-bold text-white mb-2">Fabric 1.20.x</h3>
                <p className="text-xs text-gray-500 mb-4">Includes Nametag & Tab integration.</p>
                <button className="bg-[#2a2a2e] hover:bg-[#3f3f46] text-white text-sm font-bold py-2 px-4 rounded w-full">
                    Download .jar
                </button>
            </div>
            <div className="bg-[#0f0f13] border border-[#2a2a2e] p-6 rounded opacity-50">
                <h3 className="font-bold text-white mb-2">Lunar Client</h3>
                <p className="text-xs text-gray-500 mb-4">Pending Approval.</p>
                <button disabled className="bg-[#2a2a2e] text-gray-500 text-sm font-bold py-2 px-4 rounded w-full cursor-not-allowed">
                    Unavailable
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

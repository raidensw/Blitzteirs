import React, { useState } from 'react';

export const ApiDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DOCS' | 'BOT'>('BOT'); // Default to BOT since that's what the user wants
  const [userBotToken, setUserBotToken] = useState('');

  // This is the functional bot code that connects to the same DB as the website
  const botCode = `const { Client, GatewayIntentBits, Events } = require('discord.js');
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc 
} = require('firebase/firestore');

// --- CONFIGURATION ---
const BOT_TOKEN = '${userBotToken || 'YOUR_DISCORD_BOT_TOKEN_HERE'}';

// 1. Firebase Configuration (Matches your Website)
const firebaseConfig = {
  apiKey: "AIzaSyCxlljCw6o4Y6LolBxP4CszfT768j0ZeuU", 
  authDomain: "bliz-teirs.firebaseapp.com",
  projectId: "bliz-teirs",
  storageBucket: "bliz-teirs.firebasestorage.app",
  messagingSenderId: "122827537828",
  appId: "1:122827537828:web:55a24b5b8e5fca5a039531"
};

// Initialize DB Connection
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Discord Client
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

client.once(Events.ClientReady, c => {
  console.log(\`✅ Bot logged in as \${c.user.tag}\`);
  console.log(\`✅ Connected to Blize Tiers Database\`);
  c.user.setActivity('Analyzing PvP Skills');
});

client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;

  // COMMAND: !promote <username> <gamemode> <tier>
  // Example: !promote Steve Sword HT1
  if (message.content.startsWith('!promote')) {
    const args = message.content.split(' ');
    
    // Validation
    if (args.length < 4) {
        return message.reply('❌ **Usage:** \`!promote <username> <mode> <tier>\`\\nExample: \`!promote Notch Sword HT1\`');
    }

    const targetUser = args[1];
    const targetMode = args[2]; // e.g., 'Sword', 'Axe'
    const targetTier = args[3]; // e.g., 'HT1', 'LT2'

    // Map common input names to Database keys if necessary, or pass raw
    // Note: Inputs must match your GameMode enum (Sword, Axe, Crystal, etc) strictly or you can add a mapper here.

    try {
        message.channel.sendTyping();

        // 1. Find the player in Firestore
        const playersRef = collection(db, 'players');
        const q = query(playersRef, where("username", "==", targetUser));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return message.reply(\`❌ Player **\${targetUser}** not found in database. Register on the website first.\`);
        }

        // 2. Update the Doc
        const playerDoc = querySnapshot.docs[0];
        const playerData = playerDoc.data();
        
        // Construct update object (e.g., { "tiers.Sword": "HT1" })
        const fieldPath = \`tiers.\${targetMode}\`;
        
        await updateDoc(playerDoc.ref, {
            [fieldPath]: targetTier
        });

        // 3. Confirm
        message.reply({
            embeds: [{
                color: 0x57F287, // Green
                title: 'Tier Updated',
                description: \`Successfully updated **\${targetUser}**.\`,
                fields: [
                    { name: 'Gamemode', value: targetMode, inline: true },
                    { name: 'New Tier', value: targetTier, inline: true },
                    { name: 'Website', value: 'Rank/Points will update automatically.', inline: false }
                ],
                thumbnail: { url: \`https://minotar.net/helm/\${targetUser}/100.png\` },
                footer: { text: 'Blize Tiers Automation' }
            }]
        });

    } catch (error) {
        console.error(error);
        message.reply(\`❌ Database Error: \${error.message}\`);
    }
  }

  // COMMAND: !profile <username>
  if (message.content.startsWith('!profile')) {
      const username = message.content.split(' ')[1];
      if (!username) return message.reply('Usage: !profile <username>');

      const playersRef = collection(db, 'players');
      const q = query(playersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return message.reply('Player not found.');

      const data = querySnapshot.docs[0].data();
      const tiersList = Object.entries(data.tiers || {})
        .map(([m, t]) => \`**\${m}**: \${t}\`)
        .join('\\n');

      message.reply({
          embeds: [{
              color: 0xFBBF24,
              title: \`Profile: \${data.username}\`,
              thumbnail: { url: \`https://minotar.net/helm/\${data.username}/100.png\` },
              description: \`**Points:** \${data.stats.points}\\n**Region:** \${data.region}\`,
              fields: [
                  { name: 'Current Tiers', value: tiersList || 'No ranks yet.' }
              ]
          }]
      });
  }
});

client.login(BOT_TOKEN);`;

  const packageJsonCode = `{
  "name": "blize-tiers-bot",
  "version": "1.0.0",
  "description": "Discord bot for Blize Tiers",
  "main": "bot.js",
  "scripts": {
    "start": "node bot.js"
  },
  "dependencies": {
    "firebase": "^10.7.1",
    "discord.js": "^14.14.0"
  }
}`;

  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element); // Clean up
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 mt-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Developer API</h1>
            <p className="text-gray-500">Connect your tools to the Blize Tiers infrastructure.</p>
        </div>
        <div className="flex gap-2 bg-[#18181b] p-1 rounded-lg border border-[#2a2a2e]">
             <button 
                onClick={() => setActiveTab('BOT')}
                className={`px-4 py-1.5 text-sm font-bold rounded transition-colors ${activeTab === 'BOT' ? 'bg-[#5865F2] text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
                Discord Bot
            </button>
            <button 
                onClick={() => setActiveTab('DOCS')}
                className={`px-4 py-1.5 text-sm font-bold rounded transition-colors ${activeTab === 'DOCS' ? 'bg-[#2a2a2e] text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
                Documentation
            </button>
        </div>
      </div>

      {activeTab === 'DOCS' ? (
        <div className="grid gap-8">
            <div className="bg-[#18181b] border border-[#2a2a2e] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">REST Endpoints (Read Only)</h2>
                <div className="p-8 text-center text-gray-500">
                    REST API is currently disabled. Please use the Discord Bot integration for read/write access.
                </div>
            </div>
        </div>
      ) : (
        <div className="grid gap-8">
            <div className="bg-[#18181b] border border-[#2a2a2e] rounded-lg p-8">
                 <h2 className="text-2xl font-bold text-white mb-4">Discord Bot Integration</h2>
                 <p className="text-gray-400 mb-6">
                    This bot script connects directly to your Blize Tiers database. 
                    Running this bot allows you to manage tiers directly from Discord using commands.
                 </p>
                
                 {/* Step 1: Config */}
                 <div className="mb-8">
                     <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                        <span className="bg-[#2a2a2e] w-6 h-6 rounded flex items-center justify-center text-xs">1</span>
                        Get Bot Token
                     </h3>
                     <div className="bg-[#0f0f13] border border-mc-gold/30 p-4 rounded relative overflow-hidden">
                        <label className="text-xs font-bold text-mc-gold uppercase mb-2 block relative z-10">Paste Token Here (Optional)</label>
                        <input 
                            type="text" 
                            value={userBotToken}
                            onChange={(e) => setUserBotToken(e.target.value)}
                            placeholder="MTE4..."
                            className="w-full bg-black/40 border border-[#2a2a2e] rounded px-3 py-2 text-white text-xs font-mono focus:border-mc-gold outline-none relative z-10 placeholder-gray-600"
                        />
                        <p className="text-[10px] text-gray-400 mt-2 relative z-10">
                            Pasting your token here will auto-fill it in the code below.
                        </p>
                    </div>
                 </div>

                 {/* Step 2: Download */}
                 <div className="mb-8">
                     <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                        <span className="bg-[#2a2a2e] w-6 h-6 rounded flex items-center justify-center text-xs">2</span>
                        Download & Install
                     </h3>
                     <div className="flex gap-4">
                        <button 
                            onClick={() => downloadFile('bot.js', botCode)}
                            className="flex-1 bg-[#0f0f13] border border-[#2a2a2e] hover:border-mc-gold p-4 rounded text-left group transition-colors"
                        >
                            <div className="font-bold text-white group-hover:text-mc-gold mb-1">Download bot.js</div>
                            <div className="text-xs text-gray-500">
                                Contains logic to connect to your Firebase DB and update ranks.
                            </div>
                        </button>
                         <button 
                            onClick={() => downloadFile('package.json', packageJsonCode)}
                            className="flex-1 bg-[#0f0f13] border border-[#2a2a2e] hover:border-mc-gold p-4 rounded text-left group transition-colors"
                        >
                            <div className="font-bold text-white group-hover:text-mc-gold mb-1">Download package.json</div>
                            <div className="text-xs text-gray-500">Dependencies (discord.js, firebase).</div>
                        </button>
                     </div>
                 </div>

                 {/* Commands Preview */}
                 <div className="mt-8 border-t border-[#2a2a2e] pt-8">
                    <h3 className="text-white font-bold mb-4">Available Bot Commands</h3>
                    <div className="space-y-3">
                        <div className="bg-[#0f0f13] p-3 rounded border border-[#2a2a2e] flex items-center justify-between">
                            <code className="text-mc-gold text-sm font-bold">!promote &lt;user&gt; &lt;mode&gt; &lt;tier&gt;</code>
                            <span className="text-gray-500 text-xs">Sets a player's tier. Points update automatically.</span>
                        </div>
                        <div className="bg-[#0f0f13] p-3 rounded border border-[#2a2a2e] flex items-center justify-between">
                            <code className="text-mc-gold text-sm font-bold">!profile &lt;user&gt;</code>
                            <span className="text-gray-500 text-xs">View a player's current stats and tiers.</span>
                        </div>
                    </div>
                 </div>

            </div>
            
            {/* Preview Code Block */}
            <div className="bg-[#18181b] border border-[#2a2a2e] rounded-lg overflow-hidden mt-8 opacity-80">
                <div className="bg-[#0f0f13] px-4 py-2 border-b border-[#2a2a2e] flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">PREVIEW: bot.js logic</span>
                </div>
                <div className="p-4 max-h-64 overflow-y-auto">
                    <pre className="text-xs text-gray-500 font-mono whitespace-pre-wrap">
{`// Example logic inside the bot:
if (message.content.startsWith('!promote')) {
  // 1. Finds player in YOUR database
  const q = query(collection(db, 'players'), where("username", "==", args[1]));
  
  // 2. Updates the tier
  await updateDoc(doc, { ["tiers." + mode]: tier });
  
  // 3. Website automatically recalculates points!
}`}
                    </pre>
                </div>
            </div>

        </div>
      )}
    </div>
  );
};
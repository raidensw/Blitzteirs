import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  getDocs,
  where
} from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { Player } from '../types';

// The collection name in your database
const COLLECTION_NAME = 'players';

export const db = {
  // 1. LISTEN FOR CHANGES (Real-time connection)
  subscribePlayers: (
    callback: (players: Player[]) => void, 
    onError?: (error: Error) => void
  ) => {
    // Safety check: if firestore failed to init, return error immediately
    if (!firestore) {
        if (onError) onError(new Error("Firebase not initialized. Check configuration."));
        return () => {};
    }

    try {
      const q = query(collection(firestore, COLLECTION_NAME));
      
      // This function runs automatically whenever the database changes
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const players: Player[] = [];
        snapshot.forEach((doc) => {
          players.push({ id: doc.id, ...doc.data() } as Player);
        });

        // Sort by points (Highest first)
        players.sort((a, b) => (b.stats?.points || 0) - (a.stats?.points || 0));
        
        // Assign ranks based on sorted position
        players.forEach((p, i) => p.rank = i + 1);

        callback(players);
      }, (error) => {
        console.error("Database Error:", error);
        if (onError) onError(error);
      });

      return unsubscribe;
    } catch (e: any) {
      if (onError) onError(e);
      return () => {};
    }
  },

  // 2. ADD PLAYER (Admin)
  createPlayer: async (username: string, region: string): Promise<Player> => {
    if (!firestore) throw new Error("Database unavailable");

    // Check if player exists first
    const playersRef = collection(firestore, COLLECTION_NAME);
    const q = query(playersRef, where("username", "==", username));
    const existing = await getDocs(q);
    
    if (!existing.empty) {
        throw new Error("Player already exists");
    }

    const newPlayer: Omit<Player, 'id'> = {
        rank: 999, // Will be auto-calculated
        username,
        uuid: username,
        region,
        role: 'USER',
        stats: {
            points: 0,
            wins: 0,
            losses: 0,
            wlr: 0,
            kills: 0,
            deaths: 0,
            kdr: 0
        },
        tiers: {},
        badges: ['NEW']
    };

    const docRef = await addDoc(collection(firestore, COLLECTION_NAME), newPlayer);
    return { id: docRef.id, ...newPlayer } as Player;
  },

  // 3. UPDATE PLAYER
  updatePlayer: async (updatedPlayer: Player) => {
    if (!firestore) throw new Error("Database unavailable");
    const playerRef = doc(firestore, COLLECTION_NAME, updatedPlayer.id);
    // Remove the ID from the data we send to Firestore
    const { id, ...data } = updatedPlayer;
    await updateDoc(playerRef, data);
  },

  // 4. AUTH (Stubs for now, using Admin Password in UI)
  login: async (username: string, password?: string): Promise<Player> => { 
     if (!firestore) throw new Error("Database unavailable");
     // For now, we just look up the user. Real auth can be added later.
     const q = query(collection(firestore, COLLECTION_NAME), where("username", "==", username));
     const snapshot = await getDocs(q);
     if (snapshot.empty) throw new Error("User not found");
     return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Player;
  },
  
  register: async (username: string, password?: string, region: string = 'NA'): Promise<Player> => {
      return db.createPlayer(username, region);
  }
};
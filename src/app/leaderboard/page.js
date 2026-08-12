"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Medal, Home, User, Flame } from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// TODO: Paste your Firebase Config here!
const firebaseConfig = {
  apiKey: "AIzaSyBO1jti5EPkPnlGU5rbX5a8ec-bQ0MC92c",
  authDomain: "salute-india-11453.firebaseapp.com",
  projectId: "salute-india-11453",
  storageBucket: "salute-india-11453.firebasestorage.app",
  messagingSenderId: "216529251442",
  appId: "1:216529251442:web:de95117cf0c5236ea066eb"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function Leaderboard() {
  const router = useRouter();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // 1. Fetch all participants
        const querySnapshot = await getDocs(collection(db, "participants"));
        
        const participants = [];
        querySnapshot.forEach((doc) => {
          participants.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // 2. Sort them by score (Highest to Lowest) in JavaScript memory
        participants.sort((a, b) => (b.score || 0) - (a.score || 0));

        setLeaders(participants);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    
    // Auto-refresh the leaderboard every 30 seconds for the TV display!
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans pb-24">
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 pt-12 pb-8 px-6 text-center shadow-xl shadow-black/50 border-b border-slate-800">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-white to-green-500"></div>
        
        <Trophy className="w-16 h-16 mx-auto text-orange-400 mb-4 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
        <h1 className="text-3xl font-extrabold tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-400">
          Live Rankings
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
          The top patriot wins the Drone on August 15th!
        </p>
      </div>

      {/* Leaderboard List */}
      <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No patriots have joined the challenge yet.</div>
        ) : (
          leaders.map((user, index) => (
            <div 
              key={user.id} 
              className={`relative flex items-center p-4 rounded-2xl border ${
                index === 0 ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 
                index === 1 ? 'bg-slate-400/10 border-slate-400/50' :
                index === 2 ? 'bg-amber-700/10 border-amber-700/50' :
                'bg-slate-900 border-slate-800'
              }`}
            >
              {/* Rank Badge */}
              <div className="w-10 flex-shrink-0 text-center mr-2">
                {index === 0 ? <Medal className="w-8 h-8 text-orange-400 mx-auto" /> :
                 index === 1 ? <Medal className="w-7 h-7 text-slate-300 mx-auto" /> :
                 index === 2 ? <Medal className="w-6 h-6 text-amber-600 mx-auto" /> :
                 <span className="text-lg font-bold text-slate-500">#{index + 1}</span>}
              </div>

              {/* Avatar */}
              <div className="w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-slate-700 mr-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.name || 'U'}&background=1e293b&color=f97316`} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-grow min-w-0">
                <h3 className={`font-bold truncate ${index === 0 ? 'text-orange-400 text-lg' : 'text-slate-200'}`}>
                  {user.name}
                </h3>
                {index === 0 && (
                  <div className="flex items-center text-xs text-orange-500 mt-1 font-medium">
                    <Flame className="w-3 h-3 mr-1" /> CURRENT LEADER
                  </div>
                )}
              </div>

              {/* Score */}
              <div className="text-right ml-4">
                <span className={`text-2xl font-black ${
                  index === 0 ? 'text-orange-400' : 
                  index === 1 ? 'text-slate-300' : 
                  index === 2 ? 'text-amber-600' : 
                  'text-slate-100'
                }`}>
                  {user.score || 0}
                </span>
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">PTS</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FIXED BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 pb-safe pt-2 px-2 z-50">
        <div className="flex justify-around items-center p-2 max-w-md mx-auto">
          <button onClick={() => router.push('/')} className="flex flex-col items-center text-slate-400 hover:text-white transition-colors">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold tracking-wider">HOME</span>
          </button>
          
          <button className="flex flex-col items-center text-orange-500">
            <Trophy className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold tracking-wider">RANK</span>
          </button>

          {/* FIXED: Now reads the user's ID from memory to take them back to their profile! */}
          <button 
            onClick={() => {
              const userId = localStorage.getItem('userId');
              if (userId) {
                router.push(`/dashboard?id=${userId}`);
              } else {
                router.push('/login');
              }
            }} 
            className="flex flex-col items-center text-slate-400 hover:text-white transition-colors"
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold tracking-wider">PROFILE</span>
          </button>
        </div>
      </div>
      
    </main>
  );
}
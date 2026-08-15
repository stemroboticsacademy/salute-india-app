"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Home, User, BadgeCheck, Zap } from 'lucide-react';
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
        const querySnapshot = await getDocs(collection(db, "participants"));
        const participants = [];
        querySnapshot.forEach((doc) => {
          participants.push({ id: doc.id, ...doc.data() });
        });
        participants.sort((a, b) => (b.score || 0) - (a.score || 0));
        setLeaders(participants);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#0B1121] text-white font-sans pb-24">
      
      {/* Sci-Fi Gauge Header */}
      <div className="relative pt-12 pb-6 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        
        {/* Speedometer Arc Graphic Simulation */}
        <div className="relative w-48 h-24 mx-auto overflow-hidden mb-4">
          <div className="absolute w-48 h-48 border-[12px] border-slate-800 rounded-full top-0 left-0"></div>
          <div className="absolute w-48 h-48 border-[12px] border-t-orange-500 border-l-yellow-400 border-r-slate-800 border-b-transparent rounded-full top-0 left-0 transform -rotate-45"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-[#0B1121] p-3 rounded-t-full">
             <Trophy className="w-12 h-12 text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
          </div>
        </div>

        <h1 className="text-2xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          Live Rankings
        </h1>
      </div>

      {/* Leaderboard List */}
      <div className="max-w-md mx-auto px-4 pt-2 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No patriots have joined yet.</div>
        ) : (
          leaders.map((user, index) => (
            <div 
              key={user.id} 
              className="bg-[#151C2F] border border-slate-800 rounded-2xl p-3 flex items-center shadow-lg"
            >
              {/* Rank Block */}
              <div className={`w-8 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mr-3 font-black text-lg ${
                index === 0 ? 'bg-amber-500 text-[#0B1121]' : 
                index === 1 ? 'bg-slate-300 text-[#0B1121]' :
                index === 2 ? 'bg-amber-800 text-white' :
                'bg-slate-800 text-slate-400'
              }`}>
                {index + 1}
              </div>

              {/* Circular Avatar */}
              <div className="relative w-12 h-12 flex-shrink-0 mr-4">
                <img 
                  src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.name || 'U'}&background=1e293b&color=f97316`} 
                  alt={user.name} 
                  className="w-full h-full object-cover rounded-full border-2 border-slate-700"
                />
                <BadgeCheck className="absolute -bottom-1 -right-1 w-5 h-5 text-blue-500 bg-[#151C2F] rounded-full" />
              </div>

              {/* Name & Title */}
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-slate-100 text-sm truncate flex items-center">
                  {user.name}
                </h3>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {index === 0 ? "Grand Champion Status" : "Tricolor Challenger"}
                </p>
              </div>

              {/* Score Right Align */}
              <div className="text-right ml-2 flex flex-col items-end">
                <span className={`text-xl font-black ${
                  index === 0 ? 'text-amber-400 drop-shadow-md' : 
                  index === 1 ? 'text-slate-200' : 
                  index === 2 ? 'text-amber-600' : 
                  'text-orange-500'
                }`}>
                  {user.score || 0}
                </span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">PTS</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FIXED BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0B1121]/90 backdrop-blur-md border-t border-slate-800 pb-safe pt-3 px-4 z-50">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button onClick={() => router.push('/')} className="flex flex-col items-center text-slate-500 hover:text-white w-16">
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold tracking-wider">HOME</span>
          </button>
          
          {/* Active Tab */}
          <button className="flex flex-col items-center text-orange-500 w-16 relative">
            <div className="absolute -top-3 w-10 h-1 bg-orange-500 rounded-b-full"></div>
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold tracking-wider">RANK</span>
          </button>

          <button 
            onClick={() => {
              const userId = localStorage.getItem('userId');
              if (userId) router.push(`/dashboard?id=${userId}`);
              else router.push('/login');
            }} 
            className="flex flex-col items-center text-slate-500 hover:text-white w-16"
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold tracking-wider">PROFILE</span>
          </button>
        </div>
      </div>
      
    </main>
  );
}
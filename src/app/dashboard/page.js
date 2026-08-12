"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Camera, Trophy, User, Home, Sparkles, Paintbrush, Hammer, ChevronRight, LogOut } from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// TODO: Paste your Firebase Config from Step 3 here!
const firebaseConfig = {
  apiKey: "AIzaSyBO1jti5EPkPnlGU5rbX5a8ec-bQ0MC92c",
  authDomain: "salute-india-11453.firebaseapp.com",
  projectId: "salute-india-11453",
  storageBucket: "salute-india-11453.firebasestorage.app",
  messagingSenderId: "216529251442",
  appId: "1:216529251442:web:de95117cf0c5236ea066eb"
};

// Safely initialize Firebase (Prevents duplicate app errors during hot-reloads)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // NEW: Read ID from URL, but if it's missing, grab it from local storage!
  const urlId = searchParams.get('id');
  const [id, setId] = useState(urlId);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ find: 0, create: 0, build: 0 });

  useEffect(() => {
    // Check local storage if URL parameter is missing
    const storedId = localStorage.getItem('userId');
    if (!id && storedId) {
      setId(storedId);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const docRef = doc(db, "participants", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }

        // NEW: Fetch user's approved submissions to update the activity counters
        const q = query(collection(db, "submissions"), where("userId", "==", id));
        const subSnap = await getDocs(q);
        
        let counts = { find: 0, create: 0, build: 0 };
        subSnap.forEach((doc) => {
          const data = doc.data();
          // Only count it if the Admin has approved it!
          if (data.status === 'approved') {
            if (data.category === 'find') counts.find++;
            if (data.category === 'create') counts.create++;
            if (data.category === 'build') counts.build++;
          }
        });
        setStats(counts);

      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Participant Not Found</h1>
        <p className="text-slate-400 mb-6">We couldn't find your profile. Please register again.</p>
        <button 
          onClick={() => router.push('/register')}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold"
        >
          Go to Registration
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans pb-24">
      
      {/* HEADER / VIP TRADING CARD AVATAR SECTION */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 pt-10 pb-8 px-6 text-center shadow-xl shadow-black/50 border-b border-slate-800">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-white to-green-500"></div>
        
        {/* LOGOUT BUTTON */}
        <button 
          onClick={() => {
            localStorage.removeItem('userId'); // Clear memory on logout
            router.push('/');
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white flex items-center text-xs font-bold bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-1" />
          LOGOUT
        </button>

        <div className="relative inline-block mb-4 mt-4">
          {/* VIP Trading Card Shape (w-32 h-44) */}
          <div className="w-32 h-44 mx-auto rounded-xl border-4 border-slate-700 overflow-hidden shadow-2xl relative bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={userData.avatar_url || `https://ui-avatars.com/api/?name=${userData.name || 'User'}&background=1e293b&color=f97316&size=256`} 
              alt={userData.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${userData.name || 'User'}&background=1e293b&color=f97316&size=256`;
              }}
            />
          </div>
          <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-slate-950 shadow-lg">
            RANK: TBD
          </div>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mt-2">
          {userData.name}
        </h1>
        <p className="text-orange-500 font-bold text-lg tracking-wider drop-shadow-md">
          Score: {userData.score || 0} PTS
        </p>
      </div>

      {/* ACTION BUTTON */}
      <div className="px-6 -mt-6 relative z-10">
        <button 
          onClick={() => router.push(`/capture?id=${id}`)}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 flex items-center justify-center transition-transform active:scale-95 border border-green-400/50"
        >
          <Camera className="w-6 h-6 mr-2" />
          SUBMIT TRICOLOR DISCOVERY
        </button>
      </div>

      {/* STATS SECTION */}
      <div className="px-6 pt-8 space-y-4">
        <h3 className="text-slate-400 font-bold tracking-widest text-xs uppercase mb-4">Your Activity</h3>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center">
            <div className="bg-orange-500/20 p-2 rounded-lg mr-3 border border-orange-500/30">
              <Sparkles className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Natural Discoveries</h4>
              <p className="text-slate-500 text-xs">Find existing tricolors (+1)</p>
            </div>
          </div>
          <span className="text-xl font-black text-slate-300">{stats.find}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center">
            <div className="bg-slate-500/20 p-2 rounded-lg mr-3 border border-slate-500/30">
              <Paintbrush className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Creative Creations</h4>
              <p className="text-slate-500 text-xs">Arrange objects (+2)</p>
            </div>
          </div>
          <span className="text-xl font-black text-slate-300">{stats.create}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-500/20 p-2 rounded-lg mr-3 border border-green-500/30">
              <Hammer className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">STEM Builds</h4>
              <p className="text-slate-500 text-xs">Engineer something (+3)</p>
            </div>
          </div>
          <span className="text-xl font-black text-slate-300">{stats.build}</span>
        </div>
      </div>

      {/* FIXED BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 pb-safe pt-2 px-2 z-50">
        <div className="flex justify-around items-center p-2 max-w-md mx-auto">
          <button onClick={() => router.push('/')} className="flex flex-col items-center text-slate-400 hover:text-white transition-colors">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold tracking-wider">HOME</span>
          </button>
          
          <button onClick={() => router.push('/leaderboard')} className="flex flex-col items-center text-slate-400 hover:text-white transition-colors">
            <Trophy className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold tracking-wider">RANK</span>
          </button>

          <button className="flex flex-col items-center text-orange-500">
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold tracking-wider">PROFILE</span>
          </button>
        </div>
      </div>
      
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
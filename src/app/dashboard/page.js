"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Trophy, User, Home, Sparkles, Paintbrush, Hammer, LogOut, Bell, Menu, BadgeCheck, Shield, Rocket } from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

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

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const urlId = searchParams.get('id');
  const [id, setId] = useState(urlId);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ find: 0, create: 0, build: 0 });

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (!id && storedId) setId(storedId);
  }, [id]);

  useEffect(() => {
    if (!id) { setLoading(false); return; }

    const fetchUser = async () => {
      try {
        const docRef = doc(db, "participants", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) setUserData(docSnap.data());

        const q = query(collection(db, "submissions"), where("userId", "==", id));
        const subSnap = await getDocs(q);
        
        let counts = { find: 0, create: 0, build: 0 };
        subSnap.forEach((doc) => {
          const data = doc.data();
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

  if (loading) return (
    <div className="min-h-screen bg-[#0B1121] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );

  if (!userData) return (
    <div className="min-h-screen bg-[#0B1121] flex flex-col items-center justify-center text-white px-6 text-center">
      <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
      <button onClick={() => router.push('/register')} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold mt-4">Go to Registration</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0B1121] text-white font-sans pb-24">
      
      {/* Top App Bar */}
      <div className="flex justify-between items-center px-6 pt-8 pb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-blue-500" />
          <h1 className="text-lg font-black tracking-widest text-slate-200">STEM <span className="text-blue-500 font-bold text-sm">ROBOTICS</span></h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-slate-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0B1121]"></span>
          </div>
          <button onClick={() => { localStorage.removeItem('userId'); router.push('/'); }}>
            <Menu className="w-6 h-6 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Profile Card (Sci-Fi Aesthetic) */}
      <div className="px-4">
        <div className="bg-[#151C2F] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800 relative">
          
          {/* Tech Header Background */}
          <div className="h-32 bg-gradient-to-r from-blue-900/40 via-slate-800 to-blue-900/40 relative overflow-hidden">
             {/* Optional: Add a real tech background image here like your screenshot */}
             {/* <img src="/tech-bg.png" className="w-full h-full object-cover opacity-50 absolute inset-0" /> */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          </div>

          {/* Avatar Component */}
          <div className="absolute top-12 left-6">
            <div className="relative w-24 h-24 rounded-full border-4 border-[#151C2F] overflow-hidden bg-slate-800 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={userData.avatar_url || `https://ui-avatars.com/api/?name=${userData.name || 'User'}&background=1e293b&color=f97316`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <BadgeCheck className="absolute bottom-0 right-0 w-8 h-8 text-green-500 bg-[#151C2F] rounded-full p-1" />
          </div>

          {/* Profile Info */}
          <div className="pt-6 px-6 pb-6">
            <div className="flex justify-between items-start mt-2">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">{userData.name}</h2>
                <p className="text-slate-400 text-xs mt-1">Real Robotics Challenge</p>
                <div className="flex text-amber-500 text-[10px] mt-2 space-x-1">
                  ★ ★ ★ <span className="text-slate-500 ml-1">★ ★</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">SCORE</span>
                <span className="text-3xl font-black text-white">{userData.score || 0} <span className="text-sm text-slate-500">PTS</span></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button 
                onClick={() => router.push(`/capture?id=${id}`)}
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all text-sm uppercase tracking-wider flex items-center justify-center"
              >
                + ADD PTS
              </button>
              <button 
                onClick={() => router.push('/leaderboard')}
                className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/20 transition-all text-sm uppercase tracking-wider flex items-center justify-center"
              >
                RANKINGS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity List Section */}
      <div className="px-4 pt-8">
        <h3 className="text-slate-400 font-bold tracking-widest text-[11px] uppercase mb-4 ml-2">ACTIVITY</h3>
        
        <div className="space-y-4">
          {/* Activity Item 1 */}
          <div className="bg-[#151C2F] border border-slate-800 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden group">
            <div className="flex items-center z-10">
              <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20 mr-4">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200 text-sm">Natural</h4>
                <p className="text-slate-500 text-xs mt-1">Natural Discovery (+1)</p>
                {/* Visual Progress Bar */}
                <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-orange-500 w-[60%]"></div>
                </div>
              </div>
            </div>
            <span className="text-2xl font-black text-slate-700 mr-2 z-10">{stats.find}</span>
            <div className="absolute right-[-20px] top-[-20px] opacity-5">
              <Sparkles className="w-32 h-32" />
            </div>
          </div>

          {/* Activity Item 2 */}
          <div className="bg-[#151C2F] border border-slate-800 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden group">
            <div className="flex items-center z-10">
              <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 mr-4">
                <Paintbrush className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200 text-sm">Creative</h4>
                <p className="text-slate-500 text-xs mt-1">Arrange objects (+2)</p>
                <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-blue-500 w-[30%]"></div>
                </div>
              </div>
            </div>
            <span className="text-2xl font-black text-slate-700 mr-2 z-10">{stats.create}</span>
          </div>

          {/* Activity Item 3 */}
          <div className="bg-[#151C2F] border border-slate-800 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden group">
            <div className="flex items-center z-10">
              <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20 mr-4">
                <Rocket className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200 text-sm">STEM Build</h4>
                <p className="text-slate-500 text-xs mt-1">Engineer something (+3)</p>
                <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-green-500 w-[10%]"></div>
                </div>
              </div>
            </div>
            <span className="text-2xl font-black text-slate-700 mr-2 z-10">{stats.build}</span>
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM NAVIGATION (Matching the Screenshot) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0B1121]/90 backdrop-blur-md border-t border-slate-800 pb-safe pt-3 px-4 z-50">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button onClick={() => router.push('/')} className="flex flex-col items-center text-slate-500 hover:text-white w-16">
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold tracking-wider">HOME</span>
          </button>
          
          <button onClick={() => router.push('/leaderboard')} className="flex flex-col items-center text-slate-500 hover:text-white w-16">
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold tracking-wider">RANK</span>
          </button>

          {/* Active Tab */}
          <button className="flex flex-col items-center text-orange-500 w-16 relative">
            <div className="absolute -top-3 w-10 h-1 bg-orange-500 rounded-b-full"></div>
            <User className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold tracking-wider">PROFILE</span>
          </button>
        </div>
      </div>
      
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B1121] text-white flex items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
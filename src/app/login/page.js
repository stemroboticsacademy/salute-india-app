"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, LogIn, ArrowLeft, Lock } from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

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

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone) return;

    setIsSubmitting(true);
    setError('');

    try {
      const q = query(collection(db, "participants"), where("phone", "==", phone), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid mobile number or password. Please check and try again!");
        setIsSubmitting(false);
        return;
      }

      // If found, grab their ID and send them to their dashboard!
      const userId = querySnapshot.docs[0].id;
      
      // NEW: Save the ID to the phone's local storage!
      localStorage.setItem('userId', userId);

      router.push(`/dashboard?id=${userId}`);

    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong verifying your account.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-orange-500 selection:text-white pb-20 pt-8 px-6">
      
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <button onClick={() => router.push('/')} className="text-slate-400 hover:text-white mb-8 flex items-center">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Home
        </button>

        <div className="text-center mb-10">
          <div className="bg-slate-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <LogIn className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm">
            Enter your registered mobile number to access your Tricolor Challenge Dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            
            <label className="font-bold text-slate-200 mb-3 block text-sm uppercase tracking-wider">Mobile Number</label>
            <div className="relative mb-5">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-500" />
              </div>
              <input 
                type="tel" 
                required 
                placeholder="Enter 10-digit number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="block w-full pl-10 pr-3 py-4 border border-slate-700 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
              />
            </div>

            <label className="font-bold text-slate-200 mb-3 block text-sm uppercase tracking-wider">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input 
                type="password" 
                required 
                placeholder="Enter your secret password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="block w-full pl-10 pr-3 py-4 border border-slate-700 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
              />
            </div>

          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-medium p-4 rounded-xl text-center shadow-lg">
              {error}
            </div>
          )}

          {}
          <button 
            type="submit" 
            disabled={isSubmitting || !phone || !password}
            className={`flex items-center justify-center w-full py-4 px-8 font-bold text-lg text-white transition-all duration-200 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)] ${
              isSubmitting || !phone || !password 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 active:scale-95'
            }`}
          >
            {isSubmitting ? 'VERIFYING...' : 'LOGIN TO DASHBOARD'}
          </button>
        </form>

      </div>
    </main>
  );
}
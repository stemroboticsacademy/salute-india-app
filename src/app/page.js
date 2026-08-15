"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, MapPin, LogIn, ExternalLink, Sparkles, Paintbrush, Hammer, ArrowRight, PlayCircle } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      setIsLoggedIn(true);
      setUserId(storedId);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#0B1121] text-white font-sans selection:bg-orange-500 selection:text-white pb-20">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <div className="relative w-full h-72 md:h-[500px] bg-[#131B2F] border-b border-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/hero-banner.png" 
          alt="STEM Robotics Tricolor Challenge" 
          className="w-full h-full object-cover opacity-60"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.classList.add('bg-gradient-to-br', 'from-slate-900', 'to-orange-900');
          }}
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1121] via-[#0B1121]/60 to-transparent"></div>

        {/* Hero Content positioned at the bottom of the image */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-center">
          <div className="inline-flex items-center justify-center text-[10px] md:text-xs font-black tracking-widest text-white bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-4 uppercase">
            August 13th - 15th, 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 uppercase drop-shadow-xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-green-400">
              Win a Drone!
            </span>
          </h1>
          <p className="text-slate-300 text-sm md:text-lg font-medium drop-shadow-md max-w-xl mx-auto">
            The STEM Robotics Tricolor Challenge
          </p>
        </div>
      </div>

      {/* 2. SMART ACTION BUTTONS (Responsive Grid) */}
      <div className="px-6 -mt-4 relative z-10 max-w-md md:max-w-3xl mx-auto flex flex-col md:flex-row gap-4">
        {isLoggedIn ? (
          <button 
            onClick={() => router.push(`/dashboard?id=${userId}`)}
            className="flex items-center justify-center w-full py-4 px-8 font-black text-lg text-white transition-all bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/50 hover:scale-105"
          >
            RETURN TO DASHBOARD
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        ) : (
          <>
            <Link 
              href="/register" 
              className="flex items-center justify-center w-full py-4 px-8 font-black text-lg text-white transition-all bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl shadow-[0_0_25px_rgba(249,115,22,0.4)] border border-orange-400/50 hover:scale-105"
            >
              JOIN THE CHALLENGE
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>

            <Link 
              href="/login" 
              className="flex items-center justify-center w-full py-4 px-8 font-bold text-slate-300 transition-all bg-[#131B2F] border border-slate-700 rounded-xl hover:bg-slate-800 hover:scale-105"
            >
              <LogIn className="mr-2 w-5 h-5" />
              ALREADY REGISTERED?
            </Link>
          </>
        )}
      </div>

      {/* 3. VISUAL MISSION BRIEFING (Responsive Slider to Grid) */}
      <div className="pt-16 pb-6 max-w-6xl mx-auto">
        <div className="px-6 flex items-center justify-between mb-6">
          <h3 className="text-slate-200 font-black tracking-widest text-lg md:text-xl uppercase flex items-center">
            How to Play
          </h3>
          {/* Only show "Swipe" text on mobile */}
          <span className="text-xs text-slate-500 flex items-center md:hidden animate-pulse">
            Swipe <ArrowRight className="w-3 h-3 ml-1" />
          </span>
        </div>
        
        {/* Mobile: Horizontal Scroll | Desktop: 4-Column Grid */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 snap-x snap-mandatory gap-6 px-6 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Level 1 Card */}
          <div className="snap-center shrink-0 w-72 md:w-full bg-[#131B2F] rounded-2xl overflow-hidden border border-slate-800 shadow-xl transition-transform hover:-translate-y-2">
            <div className="h-40 bg-slate-800 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/level1-find.png" alt="Find Tricolor" className="w-full h-full object-cover opacity-80" 
                onError={(e) => e.target.style.display = 'none'} />
              <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black tracking-wider px-3 py-1 rounded-full border border-orange-400 shadow-lg">
                LEVEL 1 (+1 PT)
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-orange-400 flex items-center mb-2 text-lg">
                <Sparkles className="w-5 h-5 mr-2" /> Discover
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">Find naturally occurring tricolors in your environment and snap a selfie!</p>
            </div>
          </div>

          {/* Level 2 Card */}
          <div className="snap-center shrink-0 w-72 md:w-full bg-[#131B2F] rounded-2xl overflow-hidden border border-slate-800 shadow-xl transition-transform hover:-translate-y-2">
            <div className="h-40 bg-slate-800 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/level2-create.png" alt="Create Tricolor" className="w-full h-full object-cover opacity-80" 
                onError={(e) => e.target.style.display = 'none'} />
              <div className="absolute top-3 left-3 bg-blue-500 text-white text-[10px] font-black tracking-wider px-3 py-1 rounded-full border border-blue-400 shadow-lg">
                LEVEL 2 (+2 PTS)
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-blue-400 flex items-center mb-2 text-lg">
                <Paintbrush className="w-5 h-5 mr-2" /> Create
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">Arrange toys, stationery, or household items to build a creative tricolor composition.</p>
            </div>
          </div>

          {/* Level 3 Card */}
          <div className="snap-center shrink-0 w-72 md:w-full bg-[#131B2F] rounded-2xl overflow-hidden border border-slate-800 shadow-xl transition-transform hover:-translate-y-2">
            <div className="h-40 bg-slate-800 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/level3-build.png" alt="Build Tricolor" className="w-full h-full object-cover opacity-80" 
                onError={(e) => e.target.style.display = 'none'} />
              <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-black tracking-wider px-3 py-1 rounded-full border border-green-400 shadow-lg">
                LEVEL 3 (+3 PTS)
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-green-400 flex items-center mb-2 text-lg">
                <Hammer className="w-5 h-5 mr-2" /> STEM Build
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">Use engineering! Build a Tricolor using LEGO, electronics, or paper mechanics.</p>
            </div>
          </div>

          {/* Finale Card */}
          <div className="snap-center shrink-0 w-72 md:w-full bg-gradient-to-br from-slate-900 to-[#0B1121] rounded-2xl overflow-hidden border border-slate-700 shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-transform hover:-translate-y-2">
            <div className="h-40 bg-slate-800 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/level4-salute.png" alt="AI Salute" className="w-full h-full object-cover opacity-80" 
                onError={(e) => e.target.style.display = 'none'} />
              <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black tracking-wider px-3 py-1 rounded-full border border-amber-400 shadow-lg">
                GRAND FINALE (+5 PTS)
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-amber-400 flex items-center mb-2 text-lg">
                The AI Salute
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">Visit STEM Robotics Academy on August 15th to perform the AI Salute in front of our smart cameras!</p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. VIDEO & ACADEMY INFO SECTION (Responsive 2-Column Grid) */}
      <div className="px-6 pb-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Video Demo */}
        <div className="bg-[#131B2F] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-center">
          <div className="flex items-center justify-center mb-6">
            <PlayCircle className="w-6 h-6 text-orange-500 mr-2" />
            <h3 className="font-black text-slate-200 text-lg uppercase tracking-wider">Watch the Demo</h3>
          </div>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#0B1121] border border-slate-700 shadow-inner">
            <video 
              controls 
              className="w-full h-full object-cover"
              src="/demo-video.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-sm text-slate-400 mt-6 text-center leading-relaxed">
            See how easy it is to upload your discoveries and climb the leaderboard!
          </p>
        </div>

        {/* Premium About the Academy */}
        <div className="bg-gradient-to-b from-[#131B2F] to-[#0B1121] border border-slate-800 rounded-3xl p-8 md:p-10 text-center shadow-2xl relative overflow-hidden flex flex-col justify-center">
          
          <div className="inline-flex items-center justify-center p-5 bg-[#0B1121] rounded-2xl border border-slate-800 mb-6 shadow-inner mx-auto">
            <img src="/logo.png" alt="STEM Logo" className="w-16 h-16 object-contain" 
                 onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
            <Hammer className="w-16 h-16 text-slate-400 hidden" />
          </div>
          
          <h3 className="font-black text-3xl text-white mb-4 uppercase tracking-wide">
            STEM Robotics Academy
          </h3>
          <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-md mx-auto">
            Empowering the next generation of innovators in Anakapalli. Turn your curiosity into elite engineering and AI skills.
          </p>
          
          <div className="inline-flex items-center justify-center text-slate-300 text-sm font-bold bg-[#0B1121] px-5 py-3 rounded-xl border border-slate-800 mb-8 mx-auto">
            <MapPin className="w-5 h-5 mr-2 text-green-400" />
            Anakapalli, Andhra Pradesh
          </div>

          <a 
            href="https://stemroboticsacademy.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-4 px-6 font-bold text-white transition-all bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 active:scale-95 shadow-lg max-w-sm mx-auto"
          >
            VISIT OFFICIAL WEBSITE
            <ExternalLink className="ml-2 w-5 h-5 text-slate-400" />
          </a>
        </div>
      </div>

    </main>
  );
}
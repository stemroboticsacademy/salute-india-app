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
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-orange-500 selection:text-white pb-20">
      
      {/* 1. CINEMATIC HERO SECTION (Uses your new landscape hero-banner.png) */}
      <div className="relative w-full h-72 md:h-96 bg-slate-900 border-b border-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/hero-banner.png" 
          alt="STEM Robotics Tricolor Challenge" 
          className="w-full h-full object-cover opacity-60"
          onError={(e) => {
            // Fallback gradient if you haven't generated the image yet
            e.target.style.display = 'none';
            e.target.parentElement.classList.add('bg-gradient-to-br', 'from-slate-900', 'to-orange-900');
          }}
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

        {/* Hero Content positioned at the bottom of the image */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-center">
          <div className="inline-flex items-center justify-center text-[10px] font-black tracking-widest text-white bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 mb-3 uppercase">
            August 13th - 15th, 2026
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-1 uppercase drop-shadow-xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-green-400">
              Win a Drone!
            </span>
          </h1>
          <p className="text-slate-300 text-sm font-medium drop-shadow-md">
            The STEM Robotics Tricolor Challenge
          </p>
        </div>
      </div>

      {/* 2. SMART ACTION BUTTONS (Moved up so they are instantly clickable) */}
      <div className="px-6 -mt-2 relative z-10 space-y-3 max-w-md mx-auto">
        {isLoggedIn ? (
          <button 
            onClick={() => router.push(`/dashboard?id=${userId}`)}
            className="flex items-center justify-center w-full py-4 px-8 font-black text-lg text-white transition-all bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/50"
          >
            RETURN TO DASHBOARD
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        ) : (
          <>
            <Link 
              href="/register" 
              className="flex items-center justify-center w-full py-4 px-8 font-black text-lg text-white transition-all bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl shadow-[0_0_25px_rgba(249,115,22,0.4)] border border-orange-400/50"
            >
              JOIN THE CHALLENGE
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>

            <Link 
              href="/login" 
              className="flex items-center justify-center w-full py-4 px-8 font-bold text-slate-300 transition-all bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800"
            >
              <LogIn className="mr-2 w-5 h-5" />
              ALREADY REGISTERED?
            </Link>
          </>
        )}
      </div>

      {/* 3. VISUAL MISSION BRIEFING (Swipeable Carousel) */}
      <div className="pt-12 pb-6">
        <div className="px-6 flex items-center justify-between mb-4 max-w-md mx-auto">
          <h3 className="text-slate-200 font-black tracking-widest text-lg uppercase flex items-center">
            How to Play
          </h3>
          <span className="text-xs text-slate-500 flex items-center animate-pulse">
            Swipe <ArrowRight className="w-3 h-3 ml-1" />
          </span>
        </div>
        
        {/* Horizontal Scroll Container (Hides scrollbar) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Level 1 Card */}
          <div className="snap-center shrink-0 w-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <div className="h-40 bg-slate-800 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/level1-find.png" alt="Find Tricolor" className="w-full h-full object-cover opacity-80" 
                onError={(e) => e.target.style.display = 'none'} />
              <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded border border-orange-400">
                LEVEL 1 (+1 PT)
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-orange-400 flex items-center mb-1">
                <Sparkles className="w-4 h-4 mr-1" /> Discover
              </h4>
              <p className="text-slate-400 text-xs">Find naturally occurring tricolors in your environment and snap a selfie!</p>
            </div>
          </div>

          {/* Level 2 Card */}
          <div className="snap-center shrink-0 w-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <div className="h-40 bg-slate-800 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/level2-create.png" alt="Create Tricolor" className="w-full h-full object-cover opacity-80" 
                onError={(e) => e.target.style.display = 'none'} />
              <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded border border-blue-400">
                LEVEL 2 (+2 PTS)
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-blue-400 flex items-center mb-1">
                <Paintbrush className="w-4 h-4 mr-1" /> Create
              </h4>
              <p className="text-slate-400 text-xs">Arrange toys, stationery, or household items to build a creative tricolor composition.</p>
            </div>
          </div>

          {/* Level 3 Card */}
          <div className="snap-center shrink-0 w-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <div className="h-40 bg-slate-800 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/level3-build.png" alt="Build Tricolor" className="w-full h-full object-cover opacity-80" 
                onError={(e) => e.target.style.display = 'none'} />
              <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded border border-green-400">
                LEVEL 3 (+3 PTS)
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-green-400 flex items-center mb-1">
                <Hammer className="w-4 h-4 mr-1" /> STEM Build
              </h4>
              <p className="text-slate-400 text-xs">Use engineering! Build a Tricolor using LEGO, electronics, or paper mechanics.</p>
            </div>
          </div>

          {/* Finale Card */}
          <div className="snap-center shrink-0 w-64 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
            <div className="h-40 bg-slate-800 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/level4-salute.png" alt="AI Salute" className="w-full h-full object-cover opacity-80" 
                onError={(e) => e.target.style.display = 'none'} />
              <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded border border-amber-400">
                GRAND FINALE (+5 PTS)
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-amber-400 flex items-center mb-1">
                The AI Salute
              </h4>
              <p className="text-slate-400 text-xs">Visit STEM Robotics Academy on August 15th to perform the AI Salute in front of our smart cameras!</p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. VIDEO DEMO SECTION */}
      <div className="px-6 pb-12 max-w-md mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <PlayCircle className="w-5 h-5 text-orange-500 mr-2" />
            <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Watch the Demo</h3>
          </div>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shadow-inner">
            <video 
              controls 
              className="w-full h-full object-cover"
              src="/demo-video.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">
            See how easy it is to upload your discoveries and climb the leaderboard!
          </p>
        </div>
      </div>

      {/* 5. PREMIUM ABOUT THE ACADEMY SECTION */}
      <div className="px-6 pb-12 max-w-md mx-auto">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          
          <div className="inline-flex items-center justify-center p-4 bg-slate-950 rounded-2xl border border-slate-800 mb-5 shadow-inner">
            <img src="/logo.png" alt="STEM Logo" className="w-12 h-12 object-contain" 
                 onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
            <Hammer className="w-12 h-12 text-slate-400 hidden" /> {/* Fallback icon if no logo */}
          </div>
          
          <h3 className="font-black text-2xl text-white mb-3 uppercase tracking-wide">
            STEM Robotics Academy
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Empowering the next generation of innovators in Anakapalli. Turn your curiosity into elite engineering and AI skills.
          </p>
          
          <div className="inline-flex items-center justify-center text-slate-300 text-xs font-bold bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 mb-6">
            <MapPin className="w-4 h-4 mr-2 text-green-400" />
            Anakapalli, Andhra Pradesh
          </div>

          <a 
            href="https://stemroboticsacademy.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-4 px-6 font-bold text-white transition-all bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 active:scale-95 shadow-lg"
          >
            VISIT OFFICIAL WEBSITE
            <ExternalLink className="ml-2 w-5 h-5 text-slate-400" />
          </a>
        </div>
      </div>

    </main>
  );
}
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Camera, UploadCloud, X, ChevronRight, AlertTriangle, Smartphone, Home, Trophy, User } from 'lucide-react';
import Link from 'next/link';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// TODO: Paste your actual Firebase Config here!
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

function CaptureForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [userId, setUserId] = useState(null);
  const [isMobile, setIsMobile] = useState(null); // null = checking, true = mobile, false = desktop
  
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const categories = [
    { id: "natural", name: "Natural Discovery", points: 1, color: "text-orange-400" },
    { id: "creative", name: "Creative Creation", points: 2, color: "text-blue-400" },
    { id: "build", name: "STEM Build", points: 3, color: "text-green-400" }
  ];

  useEffect(() => {
    // 1. Get User ID
    const urlId = searchParams.get('id');
    const localId = localStorage.getItem('userId');
    
    if (urlId) {
      setUserId(urlId);
    } else if (localId) {
      setUserId(localId);
    } else {
      router.push('/login');
    }

    // 2. STRICT Mobile OS Detection (Blocks touch-screen laptops)
    const checkMobileOS = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      // Check specifically for Android, iOS devices
      if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
        setIsMobile(true);
      } else {
        setIsMobile(false); // It's a PC/Mac
      }
    };
    
    checkMobileOS();
  }, [router, searchParams]);

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async () => {
    if (!photoFile || !selectedCategory) {
      setSubmitError("Please capture a photo and select a category.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // 1. Upload to Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/go8qtuqx/image/upload`;
      const imageFormData = new FormData();
      imageFormData.append('file', photoFile);
      imageFormData.append('upload_preset', 'salute_india'); // MUST MATCH

      const cloudinaryRes = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: imageFormData
      });
      
      const cloudinaryData = await cloudinaryRes.json();
      if (!cloudinaryRes.ok) {
        throw new Error(cloudinaryData.error?.message || "Cloudinary Upload Failed.");
      }
      
      const imageUrl = cloudinaryData.secure_url;

      // 2. Save submission to Firebase (pending status)
      await addDoc(collection(db, "submissions"), {
        userId: userId,
        imageUrl: imageUrl,
        category: selectedCategory,
        status: 'pending', // Admin must approve!
        submittedAt: serverTimestamp()
      });

      // 3. Redirect back to dashboard
      router.push(`/dashboard?id=${userId}&success=true`);

    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error.message);
      setIsSubmitting(false);
    }
  };

  // If still checking device type, show a dark loading screen
  if (isMobile === null) {
    return <div className="min-h-screen bg-[#0B1121] flex items-center justify-center text-white">Loading Systems...</div>;
  }

  // STRICT BLOCKER: If they are on desktop, absolutely refuse to show the camera input
  if (isMobile === false) {
    return (
      <main className="min-h-screen bg-[#0B1121] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-black mb-3">Mobile Required</h1>
        <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
          To ensure fairness in the challenge, you must take live photos of your Tricolor discoveries. Pre-existing photos from a computer gallery are not allowed.
        </p>
        <div className="bg-[#131B2F] border border-slate-800 p-6 rounded-2xl w-full max-w-sm">
          <Smartphone className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-sm text-slate-300 font-bold mb-2">Scan the QR code or visit:</p>
          <p className="text-orange-500 font-mono text-sm bg-[#0B1121] p-3 rounded-lg border border-slate-800">
            salute-india-app.vercel.app
          </p>
          <p className="text-xs text-slate-500 mt-3">on your mobile phone to complete missions.</p>
        </div>
        <button 
          onClick={() => router.push(`/dashboard?id=${userId}`)}
          className="mt-8 text-slate-400 hover:text-white font-bold text-sm"
        >
          RETURN TO DASHBOARD
        </button>
      </main>
    );
  }

  // MOBILE UI: Only rendered if verified as a mobile OS
  return (
    <main className="min-h-screen bg-[#0B1121] text-white pb-24">
      {/* Header */}
      <div className="p-6 pt-10 pb-6 bg-[#131B2F] border-b border-slate-800 sticky top-0 z-20 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black uppercase tracking-wide">Submit Mission</h1>
          <button onClick={() => router.push(`/dashboard?id=${userId}`)} className="p-2 bg-slate-800 rounded-full">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        
        {/* Step 1: Camera UI */}
        <div>
          <h2 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Step 1: Capture Evidence</h2>
          
          {!photoPreview ? (
            <div className="relative">
              {/* Force rear camera on mobile with capture="environment" */}
              <input 
                type="file" 
                id="camera-upload"
                accept="image/*"
                capture="environment" 
                className="hidden" 
                onChange={handlePhotoSelect}
              />
              <label 
                htmlFor="camera-upload" 
                className="block w-full aspect-square rounded-2xl border-2 border-dashed border-slate-700 bg-[#131B2F] hover:border-orange-500 flex flex-col items-center justify-center cursor-pointer transition-colors shadow-lg"
              >
                <div className="w-20 h-20 bg-[#0B1121] rounded-full flex items-center justify-center mb-4 shadow-inner border border-slate-800">
                  <Camera className="w-8 h-8 text-orange-500" />
                </div>
                <span className="font-bold text-slate-200 text-lg">Open Scanner</span>
                <span className="text-xs text-slate-500 mt-2">Take a live photo of your tricolor</span>
              </label>
            </div>
          ) : (
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-700 bg-[#131B2F] shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={clearPhoto}
                className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white p-2 rounded-full border border-white/20 shadow-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Category Selection */}
        <div className={`transition-opacity duration-300 ${photoPreview ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <h2 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Step 2: Mission Type</h2>
          <div className="space-y-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-[#131B2F] border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                    : 'bg-[#131B2F] border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-bold text-slate-200">{cat.name}</span>
                  <span className={`text-xs font-bold ${cat.color}`}>+{cat.points} Points</span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedCategory === cat.id ? 'border-orange-500' : 'border-slate-600'
                }`}>
                  {selectedCategory === cat.id && <div className="w-3 h-3 bg-orange-500 rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {submitError && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-400 text-sm font-bold text-center">
            {submitError}
          </div>
        )}

        {/* Step 3: Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!photoPreview || !selectedCategory || isSubmitting}
          className={`w-full py-5 rounded-xl font-black text-lg transition-all flex items-center justify-center shadow-lg ${
            !photoPreview || !selectedCategory || isSubmitting
              ? 'bg-[#131B2F] text-slate-500 border border-slate-800'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-95'
          }`}
        >
          {isSubmitting ? (
            <span className="animate-pulse">UPLOADING DATA...</span>
          ) : (
            <>
              <UploadCloud className="w-5 h-5 mr-2" />
              SUBMIT FOR REVIEW
            </>
          )}
        </button>
      </div>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0F1629]/90 backdrop-blur-md border-t border-slate-800 pb-safe pt-2 px-6 z-50">
        <div className="flex justify-between items-center max-w-md mx-auto h-16">
          <Link href={`/dashboard?id=${userId}`} className="flex flex-col items-center justify-center w-1/3 text-slate-500 hover:text-slate-300 transition-colors">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold tracking-wider">HOME</span>
          </Link>
          
          <Link href={`/capture?id=${userId}`} className="flex flex-col items-center justify-center w-1/3 text-orange-500 relative -top-3">
            <div className="bg-[#131B2F] p-3 rounded-full border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold tracking-wider mt-1">SCAN</span>
          </Link>
          
          <Link href={`/leaderboard?id=${userId}`} className="flex flex-col items-center justify-center w-1/3 text-slate-500 hover:text-slate-300 transition-colors">
            <Trophy className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold tracking-wider">RANK</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function Capture() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B1121] flex items-center justify-center text-orange-500 font-bold">LOADING MISSION...</div>}>
      <CaptureForm />
    </Suspense>
  );
}
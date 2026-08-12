"use client";

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Camera, ArrowLeft, Upload, Sparkles, Paintbrush, Hammer, Smartphone } from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

function CaptureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('id');

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [category, setCategory] = useState('find'); // find, create, build
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if the user is using a smartphone or tablet
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    setIsMobile(mobileRegex.test(userAgent));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setSubmitError("User ID missing. Please return to your dashboard.");
      return;
    }
    if (!photoFile) {
      setSubmitError("Please capture a photo first!");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // 1. Upload raw photo to Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/go8qtuqx/image/upload`;
      const imageFormData = new FormData();
      imageFormData.append('file', photoFile);
      imageFormData.append('upload_preset', 'salute_india'); 

      const cloudinaryRes = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: imageFormData
      });
      const cloudinaryData = await cloudinaryRes.json();
      
      if (!cloudinaryRes.ok) {
        throw new Error(cloudinaryData.error?.message || "Image Upload Failed");
      }

      const imageUrl = cloudinaryData.secure_url;

      // 2. Save submission to Firebase with 'pending' status for Admin approval!
      await addDoc(collection(db, "submissions"), {
        userId: userId,
        imageUrl: imageUrl,
        category: category,
        status: 'pending', 
        createdAt: serverTimestamp()
      });

      setIsSubmitting(false);
      
      // 3. Go back to dashboard with a success message
      alert("Mission Accomplished! Your photo is waiting for Admin approval to get points.");
      router.push(`/dashboard?id=${userId}`);
      
    } catch (error) {
      console.error("Error submitting:", error);
      setSubmitError(error.message || "Something went wrong! Try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans pb-20">
      {}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center sticky top-0 z-50">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-400">
          Submit Discovery
        </h1>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        
        {}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg text-center">
          <h3 className="font-bold text-slate-200 mb-4 text-sm uppercase tracking-wider">1. Take a Selfie with the Tricolor</h3>
          
          {!isMobile ? (
            <div className="bg-slate-950 border border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center">
              <Smartphone className="w-12 h-12 text-orange-500 mb-4" />
              <h4 className="text-lg font-bold text-slate-200 mb-2">Mobile Phone Required</h4>
              <p className="text-sm text-slate-400">To prevent cheating, live photo captures must be taken using a smartphone. Please open your dashboard on your phone to submit discoveries!</p>
            </div>
          ) : (
            <label className={`relative block w-full aspect-[4/5] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors ${photoPreview ? 'border-green-500' : 'border-slate-600 hover:border-orange-500 bg-slate-950'}`}>
              {/* NOTICE capture="environment" forces the mobile camera to open! */}
              <input 
                type="file" 
                accept="image/*"
                capture="environment" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPhotoFile(file);
                    setPhotoPreview(URL.createObjectURL(file));
                  }
                }}
              />
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover pointer-events-none" />
              ) : (
                <div className="flex flex-col items-center text-slate-400 pointer-events-none p-6">
                  <Camera className="w-12 h-12 mb-3 opacity-70 text-orange-400" />
                  <span className="text-lg font-bold text-slate-300">Open Camera</span>
                  <span className="text-xs mt-2 text-slate-500">Live photos only to prevent cheating!</span>
                </div>
              )}
            </label>
          )}
        </div>

        {}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="font-bold text-slate-200 mb-4 text-sm uppercase tracking-wider">2. What did you do?</h3>
          
          <div className="space-y-3">
            <button 
              type="button"
              onClick={() => setCategory('find')}
              className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${category === 'find' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}
            >
              <div className={`p-2 rounded-lg mr-4 ${category === 'find' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-slate-100">Found a Tricolor</h4>
                <p className="text-xs text-slate-400">Natural objects, walls, etc (+1 pt)</p>
              </div>
            </button>

            <button 
              type="button"
              onClick={() => setCategory('create')}
              className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${category === 'create' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}
            >
              <div className={`p-2 rounded-lg mr-4 ${category === 'create' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <Paintbrush className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-slate-100">Arranged a Tricolor</h4>
                <p className="text-xs text-slate-400">Toys, food, clothes (+2 pts)</p>
              </div>
            </button>

            <button 
              type="button"
              onClick={() => setCategory('build')}
              className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${category === 'build' ? 'border-green-500 bg-green-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}
            >
              <div className={`p-2 rounded-lg mr-4 ${category === 'build' ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <Hammer className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-slate-100">STEM Creation</h4>
                <p className="text-xs text-slate-400">Electronics, LEGO, papercraft (+3 pts)</p>
              </div>
            </button>
          </div>
        </div>

        {submitError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-medium p-4 rounded-xl text-center">
            {submitError}
          </div>
        )}

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || !photoPreview}
          className={`w-full py-4 px-8 font-bold text-lg text-white transition-all duration-200 rounded-xl ${
            isSubmitting || !photoPreview 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 shadow-lg shadow-green-500/30 active:scale-95'
          }`}
        >
          {isSubmitting ? 'UPLOADING...' : 'SUBMIT FOR APPROVAL'}
        </button>

      </div>
    </main>
  );
}

export default function Capture() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <CaptureContent />
    </Suspense>
  );
}
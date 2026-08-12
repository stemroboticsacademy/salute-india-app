"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, MapPin, Camera, ChevronRight, CheckSquare, Upload, Lock, ArrowLeft, PlayCircle } from 'lucide-react';
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

export default function Register() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    password: '',
  });
  
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateAvatarLocally = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const userImg = new Image();
        userImg.onload = () => {
          const frameImg = new Image();
          frameImg.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 1. Set canvas to match the exact size of your rectangular frame.png!
            canvas.width = frameImg.width;
            canvas.height = frameImg.height;

            // 2. Draw the user's photo to fill the canvas (zoomed in to cover it)
            const scale = Math.max(canvas.width / userImg.width, canvas.height / userImg.height);
            const x = (canvas.width / 2) - (userImg.width / 2) * scale;
            const y = (canvas.height / 2) - (userImg.height / 2) * scale;
            
            ctx.drawImage(userImg, x, y, userImg.width * scale, userImg.height * scale);

            // 3. Draw your beautiful frame on top!
            ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

            const finalDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            resolve(finalDataUrl);
          };
          frameImg.src = '/frame.png';
        };
        userImg.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      // Show instant preview while background generates
      setPhotoPreview(URL.createObjectURL(file)); 
      
      // Generate the VIP card
      const generatedAvatar = await generateAvatarLocally(file);
      setAvatarUrl(generatedAvatar);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      let finalImageUrl = "";

      // 1. Upload to Cloudinary if they took a selfie
      if (avatarUrl) {
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/go8qtuqx/image/upload`;
        
        const imageFormData = new FormData();
        imageFormData.append('file', avatarUrl);
        imageFormData.append('upload_preset', 'salute_india'); // MUST MATCH EXACTLY

        const cloudinaryRes = await fetch(cloudinaryUrl, {
          method: 'POST',
          body: imageFormData
        });
        
        const cloudinaryData = await cloudinaryRes.json();
        
        // If Cloudinary rejects it, throw an error to stop the process!
        if (!cloudinaryRes.ok) {
          throw new Error(cloudinaryData.error?.message || "Cloudinary Upload Failed. Check your unsigned preset.");
        }

        finalImageUrl = cloudinaryData.secure_url;
      }

      // 2. Save lead data to Firebase Firestore
      const docRef = await addDoc(collection(db, "participants"), {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        password: formData.password, // Save their secret password
        avatar_url: finalImageUrl,
        score: 0,
        status: 'active',
        registeredAt: serverTimestamp()
      });

      // 3. Save the ID to the phone's local storage so it remembers them!
      localStorage.setItem('userId', docRef.id);

      // 4. Send them to their new dashboard!
      router.push(`/dashboard?id=${docRef.id}`);

    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(error.message || "Something went wrong! Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-orange-500 selection:text-white pb-20 pt-8 px-6">
      
      <div className="max-w-md mx-auto">
        <button onClick={() => router.push('/')} className="text-slate-400 hover:text-white mb-8 flex items-center">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Home
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">
            Join the Challenge
          </h1>
          <p className="text-slate-400 text-sm">
            Create your STEM Patriot profile to compete for the drone.
          </p>
        </div>

        {/* Video Demo Section */}
        <div className="mb-10 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <PlayCircle className="w-5 h-5 text-orange-500 mr-2" />
            <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">How to Upload & Play</h3>
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
            Watch this quick demo before you generate your avatar!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-lg">
            <h3 className="font-bold text-slate-200 mb-4 text-sm uppercase tracking-wider">Create Your VIP Avatar</h3>
            
            {/* Split input and label for max compatibility */}
            <input 
              type="file" 
              id="photo-upload"
              accept="image/*"
              capture="user"
              className="hidden" 
              onChange={handlePhotoSelect}
            />
            
            <label htmlFor="photo-upload" className="block w-48 h-64 mx-auto rounded-xl border-2 border-dashed border-slate-600 hover:border-orange-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors bg-slate-950 relative shadow-2xl">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover opacity-50" />
              ) : (
                <div className="flex flex-col items-center text-slate-400 p-4">
                  <Camera className="w-10 h-10 mb-2 text-orange-400" />
                  <span className="text-sm font-bold text-slate-300">Take Selfie</span>
                </div>
              )}
            </label>
            <p className="text-xs text-slate-500 mt-4">We will instantly generate your Tricolor Patriot Card!</p>
          </div>

          {/* Form Fields */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <input type="text" name="name" required placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors" />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-500" />
              </div>
              <input type="tel" name="phone" required placeholder="Mobile Number" value={formData.phone} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors" />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input type="email" name="email" required placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors" />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-500" />
              </div>
              <input type="text" name="location" required placeholder="Area / Location (e.g., Anakapalli)" value={formData.location} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors" />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input type="password" name="password" required placeholder="Create a Secret Password" value={formData.password} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors" />
            </div>
          </div>

          {submitError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-medium p-4 rounded-xl text-center shadow-lg">
              {submitError}
            </div>
          )}

          <div className="flex items-start px-1">
            <div className="flex-shrink-0 mt-1">
              <CheckSquare className="h-4 w-4 text-green-500" />
            </div>
            <p className="ml-2 text-xs text-slate-400 leading-relaxed">
              I agree to the challenge rules and understand that I must be present on August 15th to claim any physical prizes.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`flex items-center justify-center w-full py-4 px-8 font-bold text-lg text-white transition-all duration-200 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)] ${
              isSubmitting 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 active:scale-95'
            }`}
          >
            {isSubmitting ? 'GENERATING PROFILE...' : 'START MISSION'}
            {!isSubmitting && <ChevronRight className="ml-2 w-5 h-5" />}
          </button>

        </form>
      </div>
    </main>
  );
}
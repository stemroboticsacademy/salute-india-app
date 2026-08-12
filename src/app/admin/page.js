"use client";

import { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, RefreshCcw, Camera } from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, increment, getDoc } from 'firebase/firestore';

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

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchPendingSubmissions = async () => {
    setLoading(true);
    try {
      // 1. Get all pending submissions
      const q = query(collection(db, "submissions"), where("status", "==", "pending"));
      const querySnapshot = await getDocs(q);
      
      const pendingData = [];
      for (const document of querySnapshot.docs) {
        const subData = document.data();
        
        // 2. Fetch the user's name so you know who submitted it!
        let userName = "Unknown Patriot";
        if (subData.userId) {
          const userDoc = await getDoc(doc(db, "participants", subData.userId));
          if (userDoc.exists()) {
            userName = userDoc.data().name;
          }
        }

        pendingData.push({
          id: document.id,
          userName: userName,
          ...subData
        });
      }
      
      // Sort so oldest is first in the queue
      setSubmissions(pendingData.sort((a, b) => a.createdAt - b.createdAt));
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const handleAction = async (submission, action) => {
    setProcessingId(submission.id);
    try {
      // 1. Update the submission status to 'approved' or 'rejected'
      await updateDoc(doc(db, "submissions", submission.id), {
        status: action
      });

      // 2. If approved, add points to the user's profile!
      if (action === 'approved') {
        let pointsToAdd = 0;
        if (submission.category === 'find') pointsToAdd = 1;
        if (submission.category === 'create') pointsToAdd = 2;
        if (submission.category === 'build') pointsToAdd = 3;

        await updateDoc(doc(db, "participants", submission.userId), {
          score: increment(pointsToAdd)
        });
      }

      // 3. Remove from the local queue on the screen
      setSubmissions(prev => prev.filter(sub => sub.id !== submission.id));
      
    } catch (error) {
      console.error("Error processing submission:", error);
      alert("Something went wrong processing this image.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-6 pb-20">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-400 flex items-center">
            <ShieldCheck className="w-8 h-8 mr-2 text-orange-500" />
            MISSION CONTROL
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review Tricolor Challenge Submissions</p>
        </div>
        <button 
          onClick={fetchPendingSubmissions}
          className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-xl transition-colors"
        >
          <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin text-orange-500' : ''}`} />
        </button>
      </div>

      {/* Main Queue */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading incoming transmissions...</div>
        ) : submissions.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <Camera className="w-16 h-16 text-slate-700 mb-4" />
            <h3 className="text-xl font-bold text-slate-300">Queue is empty!</h3>
            <p className="text-slate-500 mt-2">All caught up. Waiting for patriots to submit discoveries.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
                
                {/* Image */}
                <div className="relative aspect-[4/5] bg-slate-950 border-b border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={sub.imageUrl} 
                    alt="Submission" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Category Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg border backdrop-blur-md
                    ${sub.category === 'find' ? 'bg-orange-500/80 border-orange-400 text-white' : 
                      sub.category === 'create' ? 'bg-blue-500/80 border-blue-400 text-white' : 
                      'bg-green-500/80 border-green-400 text-white'}`}>
                    {sub.category.toUpperCase()} 
                    ({sub.category === 'find' ? '+1' : sub.category === 'create' ? '+2' : '+3'} PT)
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-slate-200 mb-4 uppercase tracking-wide truncate">
                    {sub.userName}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button 
                      onClick={() => handleAction(sub, 'rejected')}
                      disabled={processingId === sub.id}
                      className="flex items-center justify-center py-3 px-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 rounded-xl transition-all font-bold text-sm"
                    >
                      <X className="w-5 h-5 mr-1" /> REJECT
                    </button>
                    
                    <button 
                      onClick={() => handleAction(sub, 'approved')}
                      disabled={processingId === sub.id}
                      className="flex items-center justify-center py-3 px-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/50 rounded-xl transition-all font-bold text-sm"
                    >
                      <Check className="w-5 h-5 mr-1" /> APPROVE
                    </button>
                  </div>
                </div>
                
                {/* Processing Overlay */}
                {processingId === sub.id && (
                  <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-10">
                    <RefreshCcw className="w-8 h-8 text-orange-500 animate-spin" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
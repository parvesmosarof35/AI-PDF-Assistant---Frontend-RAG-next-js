"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Lock, Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_AUTH_URL || "https://ai-pdf-assistant-authservicego-kkuhec-86a036-35-180-95-158.sslip.io";
      
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Reset failed");
      }

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
          <Sparkles className="text-green-400" size={24} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Password Reset!</h2>
        <p className="text-slate-400 text-sm mb-6">Your password has been successfully updated.</p>
        <Link href="/login" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-xl transition-all">
          Proceed to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
          <Sparkles className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white">New Password</h2>
        <p className="text-slate-400 text-sm mt-1 text-center">Please enter your new password below.</p>
      </div>

      {!token && (
        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-3 rounded-lg text-sm text-center mb-6">
          Missing reset token in URL. Please use the link sent to your email.
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              disabled={!token}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !token}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-70 mt-6"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Save Password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPassword() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

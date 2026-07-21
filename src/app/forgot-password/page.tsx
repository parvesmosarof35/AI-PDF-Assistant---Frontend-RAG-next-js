"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8002";
      
      const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <div className="mb-6">
          <Link href="/login" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors w-fit">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <Sparkles className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <p className="text-slate-400 text-sm mt-1 text-center">Enter your email and we'll send you a link to reset your password</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center mb-6">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-sm text-center mb-6">
            {message}
          </div>
        )}

        <form onSubmit={handleForgot} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !!message}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-70 mt-6"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

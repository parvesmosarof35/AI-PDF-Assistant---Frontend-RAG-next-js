"use client";

import { useState } from "react";
import { X, User, Mail, Lock, Loader2, ShieldCheck } from "lucide-react";

type UserType = {
  name?: string;
  email?: string;
  is_verified?: boolean;
};

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onUpdate: (user: UserType) => void;
};

export default function ProfileModal({ isOpen, onClose, user, onUpdate }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  
  // Profile State
  const [name, setName] = useState(user?.name || "");
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  // Password State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);
  
  const [message, setMessage] = useState({ text: "", type: "" });

  if (!isOpen) return null;

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8002";
      
      const res = await fetch(`${apiUrl}/api/user/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      onUpdate(data.user);
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage({ text: err.message, type: "error" });
      } else {
        setMessage({ text: "An unknown error occurred", type: "error" });
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPassword(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8002";
      
      const res = await fetch(`${apiUrl}/api/user/password`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      setOldPassword("");
      setNewPassword("");
      setMessage({ text: "Password changed successfully!", type: "success" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage({ text: err.message, type: "error" });
      } else {
        setMessage({ text: "An unknown error occurred", type: "error" });
      }
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User size={18} className="text-blue-400" /> My Account
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          <button 
            onClick={() => { setActiveTab("profile"); setMessage({ text: "", type: "" }); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "profile" ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
          >
            Profile
          </button>
          <button 
            onClick={() => { setActiveTab("password"); setMessage({ text: "", type: "" }); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "password" ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
          >
            Security
          </button>
        </div>

        <div className="p-6">
          {message.text && (
            <div className={`p-3 rounded-lg text-sm text-center mb-6 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {message.text}
            </div>
          )}

          {activeTab === "profile" ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email (Read Only)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    value={user?.email || ""}
                    disabled
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-400 outline-none cursor-not-allowed"
                  />
                  {user?.is_verified && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 text-green-400 text-xs font-medium">
                      <ShieldCheck size={14} /> Verified
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loadingProfile || name === user?.name}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50 mt-6"
              >
                {loadingProfile ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                  <input 
                    type="password" 
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                  <input 
                    type="password" 
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loadingPassword || !oldPassword || !newPassword}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50 mt-6"
              >
                {loadingPassword ? <Loader2 size={18} className="animate-spin" /> : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

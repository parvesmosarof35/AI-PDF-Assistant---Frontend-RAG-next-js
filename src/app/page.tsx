"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PdfUploader from "@/components/PdfUploader";
import ChatInterface from "@/components/ChatInterface";
import ProfileModal from "@/components/ProfileModal";
import { Sparkles, MessageSquare, Plus, LogOut, Settings } from "lucide-react";

type Session = {
  _id: string;
  title?: string;
};

type UserType = {
  name?: string;
  email?: string;
  is_verified?: boolean;
};

export default function Home() {
  const [uploadedPdf, setUploadedPdf] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchSessions();
  }, [router]);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ai-pdf-assistant-backend-vasqdq-11c032-35-180-95-158.sslip.io";
      
      const res = await fetch(`${apiUrl}/api/chat/history`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (e) {
      console.error("Failed to fetch sessions", e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <main className="max-w-7xl mx-auto p-4 md:p-8 h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">AI PDF Assistant</h1>
              <p className="text-sm text-slate-400">Upload documents and get instant answers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all text-sm font-medium text-slate-300"
            >
              <Settings size={16} /> Profile
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all text-sm font-medium"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 grid md:grid-cols-12 gap-8 min-h-0">
          {/* Sidebar (History & Upload) */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
            <div className="shrink-0">
              <PdfUploader onUploadSuccess={(filename) => setUploadedPdf(filename)} />
            </div>
            
            {/* History Section */}
            <div className="flex-1 overflow-y-auto bg-slate-900 rounded-2xl border border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0">
                <h3 className="font-semibold text-white">Chat History</h3>
                <button 
                  onClick={() => setCurrentSessionId(null)}
                  className="p-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg transition-colors"
                  title="New Chat"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="p-2 space-y-1">
                {sessions.map((session) => (
                  <button
                    key={session._id}
                    onClick={() => setCurrentSessionId(session._id)}
                    className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors ${currentSessionId === session._id ? 'bg-slate-800 border border-slate-700' : 'hover:bg-slate-800/50 border border-transparent'}`}
                  >
                    <MessageSquare size={16} className={`mt-0.5 shrink-0 ${currentSessionId === session._id ? 'text-blue-400' : 'text-slate-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${currentSessionId === session._id ? 'text-white' : 'text-slate-300'}`}>
                        {session.title || "New Conversation"}
                      </p>
                    </div>
                  </button>
                ))}
                {sessions.length === 0 && (
                  <div className="text-center p-6 text-sm text-slate-500">
                    No chat history yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-7 lg:col-span-8 h-[600px] md:h-full">
            <ChatInterface 
              isPdfUploaded={!!uploadedPdf || !!currentSessionId} 
              currentSessionId={currentSessionId}
              onSessionUpdate={(id) => {
                setCurrentSessionId(id);
                fetchSessions();
              }}
            />
          </div>
        </div>
      </main>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={user}
        onUpdate={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }}
      />
    </div>
  );
}

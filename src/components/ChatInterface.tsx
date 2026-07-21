"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, BookOpen } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  sources?: any[];
};

export default function ChatInterface({ isPdfUploaded }: { isPdfUploaded: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! Upload a PDF first, then ask me anything about it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to get answer");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.answer,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "ai", content: `Error: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
        <Bot className="text-blue-400" />
        <h2 className="text-lg font-bold text-white">AI Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${msg.role === "user" ? "bg-blue-600" : "bg-slate-700"}`}>
              {msg.role === "user" ? <User size={16} className="text-white" /> : <Bot size={16} className="text-blue-400" />}
            </div>
            
            <div className={`max-w-[80%] flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                ${msg.role === "user" 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"}`}>
                {msg.content}
              </div>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {msg.sources.map((src, i) => (
                    <span key={i} className="flex items-center gap-1 text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700">
                      <BookOpen size={12} />
                      {src.source} (Pg {src.page})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <Loader2 size={16} className="text-blue-400 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-800 text-slate-400 text-sm rounded-tl-none border border-slate-700 flex items-center gap-2">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/50">
        {!isPdfUploaded && (
          <div className="text-center mb-3 text-sm font-semibold text-orange-400 bg-orange-400/10 p-2 rounded-lg border border-orange-400/20">
            ⚠️ Please upload a PDF on the left before you start chatting.
          </div>
        )}
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!isPdfUploaded || isLoading}
            placeholder={isPdfUploaded ? "Ask a question about your PDF..." : "Upload a PDF to start chatting..."}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!isPdfUploaded || !input.trim() || isLoading}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

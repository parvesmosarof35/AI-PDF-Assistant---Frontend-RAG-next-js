"use client";

import { useState } from "react";
import PdfUploader from "@/components/PdfUploader";
import ChatInterface from "@/components/ChatInterface";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [uploadedPdf, setUploadedPdf] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <main className="max-w-7xl mx-auto p-4 md:p-8 h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800 shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI PDF Assistant</h1>
            <p className="text-sm text-slate-400">Upload documents and get instant answers</p>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 grid md:grid-cols-12 gap-8 min-h-0">
          {/* Sidebar (Upload Area) */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6 overflow-y-auto">
            <PdfUploader onUploadSuccess={(filename) => setUploadedPdf(filename)} />
            
            {/* Optional Sidebar info */}
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">How it works</h3>
              <ol className="space-y-4 text-sm text-slate-400">
                <li className="flex gap-3"><span className="text-blue-400 font-bold">1</span> Upload any PDF document</li>
                <li className="flex gap-3"><span className="text-blue-400 font-bold">2</span> AI extracts the text & meaning</li>
                <li className="flex gap-3"><span className="text-blue-400 font-bold">3</span> Ask questions and get cited answers</li>
              </ol>
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-7 lg:col-span-8 h-[600px] md:h-full">
            <ChatInterface isPdfUploaded={!!uploadedPdf} />
          </div>
        </div>
      </main>
    </div>
  );
}

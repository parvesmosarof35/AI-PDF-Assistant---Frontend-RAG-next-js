"use client";

import { useState } from "react";
import { UploadCloud, File as FileIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function PdfUploader({ onUploadSuccess }: { onUploadSuccess: (filename: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setStatus("idle");
      } else {
        setStatus("error");
        setErrorMsg("Please select a valid PDF file.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      // Dynamically use localhost if developing locally, otherwise use production backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ai-pdf-assistant-backend-vasqdq-11c032-35-180-95-158.sslip.io";
        
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Upload failed");
      }
      
      setStatus("success");
      onUploadSuccess(file.name);
    } catch (err: unknown) {
      setStatus("error");
      const errorMessage = err instanceof Error ? err.message : "Failed to upload PDF.";
      setErrorMsg(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <UploadCloud className="text-blue-400" />
        Upload Knowledge Base
      </h2>
      
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${status === "uploading" ? "border-blue-500 bg-blue-500/10" : "border-slate-700 hover:border-blue-400 hover:bg-slate-800/50"}`}
      >
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={status === "uploading"}
        />
        
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <FileIcon className="w-12 h-12 text-blue-400" />
            <p className="text-sm text-slate-300 font-medium truncate w-full px-4">{file.name}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <UploadCloud className="w-12 h-12 text-slate-500" />
            <p className="text-sm text-slate-400">Click or drag a PDF here to upload</p>
          </div>
        )}
      </div>

      {status === "error" && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {errorMsg}
        </div>
      )}

      {status === "success" && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          Successfully processed {file?.name}!
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || status === "uploading"}
        className={`w-full mt-6 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
          ${!file || status === "uploading" ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"}`}
      >
        {status === "uploading" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing PDF...
          </>
        ) : (
          "Upload & Process"
        )}
      </button>
    </div>
  );
}

# AI PDF Assistant - Frontend

The frontend is built with **Next.js 15**, **React**, and **Tailwind CSS v4**. It features a modern, dark-mode, responsive UI where users can upload a PDF and immediately chat with an AI regarding its contents.

## Features
- 🚀 **Next.js App Router:** Built with the latest Next.js 15 patterns.
- 💅 **Modern UI:** Sleek dark-mode design using Tailwind CSS v4 and Lucide icons.
- 📤 **PDF Dropzone:** Intuitive file uploader with upload status feedback.
- 💬 **Interactive Chat:** Real-time chat interface displaying AI responses along with page citations.
- 🛡️ **Guarded State:** Chat interface is intuitively disabled until a document is successfully uploaded.

## Setup Instructions

### 1. Environment Variables (Optional)
By default, the app looks for the backend at `http://localhost:8000`. If your backend is hosted elsewhere, create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Run Locally (Without Docker)
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Run with Docker
```bash
docker build -t rag-frontend .
docker run -p 3000:3000 rag-frontend
```

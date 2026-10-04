"use client"

import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="mb-6">
          <span className="text-8xl font-black tracking-tight text-amber-500 sm:text-9xl">404</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">The page you are looking for does not exist or may have been moved. Let&apos;s get you back to KKI Smart Connects.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"><Home className="h-4 w-4" />Go to Home</Link>
          <Link href="/chat/" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"> <Search className="h-4 w-4" />Smart Connects</Link>
        </div>
        <button onClick={() => window.history.back()} className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-amber-600"> <ArrowLeft className="h-4 w-4" />Go back</button>
        <p className="mt-12 text-xs font-medium tracking-wide text-gray-400">KKI Smart Connects</p>
      </div>
    </main>
  );
}
"use client";

import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pb-16 pt-14 sm:pb-24 sm:pt-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-amber-300/50 blur-3xl animate-aurora" />
        <div className="absolute -right-16 top-24 h-80 w-80 rounded-full bg-orange-300/40 blur-3xl animate-aurora [animation-delay:-6s]" />
        <div className="absolute left-1/3 top-56 h-64 w-64 rounded-full bg-rose-200/40 blur-3xl animate-aurora [animation-delay:-12s]" />
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-white/60 px-4 py-2 text-sm font-medium text-amber-900 shadow-sm backdrop-blur-sm animate-fade-up">
          <span className="h-2 w-2 rounded-full bg-amber-500" />Kavya Kishor International</span>
        <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-gray-900 animate-fade-up [animation-delay:80ms] sm:text-5xl lg:text-6xl">
          Publish. Connect.<span className="block bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">Collaborate beyond borders.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-gray-600 animate-fade-up [animation-delay:160ms] sm:text-lg"> A unified digital platform for KKI authors, readers, editors, reviewers, and collaborators to publish creative works, manage editorial processes, and communicate across languages.</p>
        <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 animate-fade-up [animation-delay:240ms] sm:w-auto sm:flex-row">
          <Link href="/m/" className="w-full rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 sm:w-auto">Explore KKI Magazine</Link>
          <Link href="/chat/" className="w-full rounded-xl border border-amber-300 bg-white/60 px-6 py-3 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-sm hover:bg-amber-300 duration-500 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 sm:w-auto">Smart Connects</Link>
        </div>
        <p className="mt-4 text-xs text-gray-500 animate-fade-up [animation-delay:300ms]">A connected platform for publication, communication, and editorialcollaboration.</p>
      </div>
    </section>
  );
};

export default Hero;

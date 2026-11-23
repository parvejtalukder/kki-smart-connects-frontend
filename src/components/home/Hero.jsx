"use client";

import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-paper-50 pb-16 pt-14 sm:pb-24 sm:pt-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-300/45 blur-3xl animate-aurora" />
        <div className="absolute -right-16 top-24 h-80 w-80 rounded-full bg-peri-300/40 blur-3xl animate-aurora [animation-delay:-6s]" />
        <div className="absolute left-1/3 top-56 h-64 w-64 rounded-full bg-royal-200/40 blur-3xl animate-aurora [animation-delay:-12s]" />
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-brand-900 shadow-sm backdrop-blur-sm animate-fade-up">
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          Kavya Kishor International
        </span>
        <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-ink animate-fade-up [animation-delay:80ms] sm:text-5xl lg:text-6xl">
          Publish. Connect.
          <span className="block bg-linear-to-r from-royal-700 via-peri-500 to-brand-500 bg-clip-text text-transparent">
            Collaborate beyond borders.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-ink-500 animate-fade-up [animation-delay:160ms] sm:text-lg">
          A unified digital platform for KKI authors, readers, editors, reviewers, and
          collaborators to publish creative works, manage editorial processes, and communicate
          across languages.
        </p>
        <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 animate-fade-up [animation-delay:240ms] sm:w-auto sm:flex-row">
          <Link
            href="/m/"
            className="w-full rounded-xl bg-royal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-royal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal-600 sm:w-auto"
          >
            Explore KKI Magazine
          </Link>
          <Link
            href="/chat/"
            className="w-full rounded-xl border border-brand-300 bg-white/70 px-6 py-3 text-sm font-semibold text-brand-900 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-brand-400 hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal-600 sm:w-auto"
          >
            Smart Connects
          </Link>
        </div>
        <p className="mt-4 text-xs text-ink-500 animate-fade-up [animation-delay:300ms]">
          A connected platform for publication, communication, and editorial collaboration.
        </p>
      </div>
    </section>
  );
};

export default Hero;

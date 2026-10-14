"use client";

import useAuth from "@/hooks/useAuth";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FiBookOpen,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiFeather,
  FiShield,
} from "react-icons/fi";

const LoginPage = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInUser } = useAuth();
  const redirect = useRouter();

  const handleLogin = async () => {
    try {
      const res = await signInUser(email, password);
      if (res) {
        toast.success("Logged In!");
        setTimeout(() => {
          redirect.replace("/");
        }, 500)
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  }

  return (
    <main className="min-h-screen bg-transparent p-3 sm:p-6 lg:p-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-xl lg:grid-cols-2">
        <section className="relative flex flex-col justify-between overflow-hidden bg-amber-100 p-7 text-slate-900 sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-amber-200/70" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-amber-200/50 blur-2xl" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-amber-200 shadow-lg">
              <FiFeather size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">KKI Smart Connects</h2>
              <p className="text-xs text-slate-600">Publication · Collaboration · Community</p>
            </div>
          </div>

          <div className="relative z-10 my-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white/60 px-4 py-2 text-sm font-medium">
              <FiBookOpen />
              <p>Your creative journey continues</p>
            </div>

            <h1 className="max-w-lg text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Every great story begins with a{" "}
              <span className="text-amber-700">single word.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-700">Sign in to manage your publications, connect with editors, and bring meaningful stories to readers around the world.</p>
            <div className="mt-9 flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-100 bg-rose-200 font-bold text-rose-900">A</div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-100 bg-sky-200 font-bold text-sky-900">E</div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-100 bg-emerald-200 font-bold text-emerald-900">R</div>
              </div>
              <div>
                <p className="text-sm font-bold">A space for storytellers</p>
                <p className="text-xs text-slate-600">Write, collaborate, publish.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-slate-600">
            <FiShield />
            <p>A dedicated space for your creative work</p>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-700">Welcome back</p>
              <h2 className="text-3xl font-black tracking-tight text-base-content sm:text-4xl">Sign in to your account</h2>
              <p className="mt-3 text-sm leading-6 text-base-content/60">Enter your details below to access your workspace.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-5"
            >
              <div className="form-control">
                <label htmlFor="email" className="label pb-2">
                  <span className="label-text font-semibold">
                    <p>Email address</p>
                  </span>
                </label>
                <div className="relative">
                  {/* <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={18}/> */}
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered h-14 w-full rounded-xl pl-11 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="form-control">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="label pb-2">
                    <span className="label-text font-semibold">Password</span>
                  </label>
                  <a href="/forgot-password" className="text-xs font-semibold text-amber-700 hover:underline">Forgot password?</a>
                </div>

                <div className="relative">
                  {/* <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={18} /> */}
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered h-14 w-full rounded-xl pl-11 pr-12 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 transition hover:text-base-content"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 text-sm text-base-content/70">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm rounded-md border-base-300 checked:border-amber-600 checked:bg-amber-600"
                />
                <p>Keep me signed in</p>
              </label>

              <button
                type="submit"
                className="btn h-14 min-h-14 w-full rounded-xl border-0 bg-slate-900 text-base font-bold text-white shadow-lg transition hover:bg-amber-700"
              >
                Sign in
                <FiArrowRight size={18} />
              </button>
            </form>

            <div className="divider my-7 text-xs text-base-content/40">
              NEW TO KKI?
            </div>

            <p className="text-center text-sm text-base-content/70">
              {"Don't have an account?"}{" "}
              <a
                href="/register"
                className="font-bold text-amber-700 hover:underline"
              >
                Create an account
              </a>
            </p>

            <p className="mt-10 text-center text-xs leading-5 text-base-content/50">
              By continuing, you agree to our{" "}
              <a href="/terms" className="underline underline-offset-2">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline underline-offset-2">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;

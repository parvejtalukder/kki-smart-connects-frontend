"use client";

import React, { useState } from "react";
import { FiBookOpen, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiFeather, FiShield, FiUser, FiAtSign, } from "react-icons/fi";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import apiFetch from "@/utils/apiFetch";
import toast, { ToastBar } from "react-hot-toast";
import { redirect } from "next/navigation";
import { FiImage } from "react-icons/fi";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const { registerUser, updateUser, user } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, or WebP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large. Maximum allowed size is 5 MB.");
      e.target.value = "";
      return;
    }

    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!accountCreated) {
      if (password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    try {
      const displayName = fullName.trim();

      if (!accountCreated) {
        const response = await registerUser(email.trim(), password);

        if (!response.user) {
          throw new Error("Account creation failed.");
        }

        await updateUser({ displayName });

        await apiFetch("/users/me", {
          method: "PUT",
          body: JSON.stringify({ displayName }),
        });

        setAccountCreated(true);
        toast.success("Account Created!");
      }

      if (profileImage) {
        setImageUploading(true);

        const formData = new FormData();
        formData.append("image", profileImage);

        const upload = await apiFetch("/uploads/profile", {
          method: "POST",
          body: formData,
        });

        const photoURL = upload?.data?.url;

        if (photoURL) {
          await apiFetch("/users/me", {
            method: "PUT",
            body: JSON.stringify({ displayName, photoURL }),
          });
        }

        setImageUploading(false);
      }

      window.location.assign("/");
    } catch (error) {
      console.error("Registration error:", error);
      setImageUploading(false);

      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
        toast.error("Email already registered!");
      } else if (accountCreated) {
        setError(
          "Your account was created, but the photo upload failed. You can retry or continue without a photo."
        );
        toast.error("Photo upload failed!");
      } else {
        setError(
          "Your account may have been created, but an operation failed. Please check your account before trying again."
        );
        toast.error("Registration process incomplete!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent p-3 sm:p-6 lg:p-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-xl lg:grid-cols-2">

        <section className="relative flex flex-col justify-between overflow-hidden bg-amber-100 p-7 text-slate-900 sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-amber-200/70" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-amber-200/50 blur-2xl" />

          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-amber-200 shadow-lg">
              <FiFeather size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">
                KKI Smart Connects
              </h2>
              <p className="text-xs text-slate-600">
                Publication · Collaboration · Community
              </p>
            </div>
          </Link>

          <div className="relative z-10 my-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white/60 px-4 py-2 text-sm font-medium">
              <FiBookOpen />
              <span>Your literary journey starts here</span>
            </div>

            <h1 className="max-w-lg text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Discover stories.
              <br />
              <span className="text-amber-700">
                Connect through words.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-700">
              Create your free reader account to explore published works,
              discover talented authors, and follow the voices that inspire you.
            </p>

            <div className="mt-9 space-y-4">
              {[
                "Explore published literary works",
                "Follow your favorite authors",
                "Build your own reading journey",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-amber-900">
                    <FiArrowRight size={14} />
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-slate-600">
            <FiShield size={15} />
            <span>Your account, your reading journey.</span>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-7">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
                Join our community
              </p>

              <h2 className="text-3xl font-black tracking-tight text-base-content sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-base-content/60">
                Start as a reader. You can complete your author profile later.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
            
              <div className="form-control">
                <label htmlFor="fullName" className="label pb-2">
                  <span className="label-text font-semibold">Full name</span>
                </label>

                <div className="relative">
                  <FiUser
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
                    size={18}
                  />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input input-bordered h-12 w-full rounded-xl pl-11 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="form-control">
                <div className="label pb-1">
                  <span className="label-text font-semibold">
                    Profile picture
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-base-300 bg-base-200">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiImage size={28} className="text-base-content/40" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="file-input file-input-bordered h-12 w-full rounded-xl"
                    />
                    <p className="mt-2 text-xs text-base-content/50">
                      JPG, PNG, or other supported image formats. Maximum 5 MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Username */}
              {/* <div className="form-control">
                <label htmlFor="username" className="label pb-2">
                  <span className="label-text font-semibold">Username</span>
                </label>

                <div className="relative">
                  <FiAtSign
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
                    size={18}
                  />
                  <input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    autoComplete="username"
                    required
                    minLength={3}
                    maxLength={30}
                    pattern="[a-zA-Z0-9_]+"
                    title="Use letters, numbers, and underscores only."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input input-bordered h-12 w-full rounded-xl pl-11 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <p className="mt-1 text-xs text-base-content/50">
                  Letters, numbers, and underscores only.
                </p>
              </div> */}

              <div className="form-control">
                <label htmlFor="email" className="label pb-2">
                  <span className="label-text font-semibold">
                    Email address
                  </span>
                </label>

                <div className="relative">
                  <FiMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
                    size={18}
                  />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered h-12 w-full rounded-xl pl-11 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="password" className="label pb-2">
                  <span className="label-text font-semibold">Password</span>
                </label>

                <div className="relative">
                  <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
                    size={18}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered h-12 w-full rounded-xl pl-11 pr-12 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="confirmPassword" className="label pb-2">
                  <span className="label-text font-semibold">
                    Confirm password
                  </span>
                </label>

                <div className="relative">
                  <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
                    size={18}
                  />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input input-bordered h-12 w-full rounded-xl pl-11 pr-12 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl bg-error/10 p-3 text-sm text-error"
                >
                  {error}
                </p>
              )}

              {accountCreated && (
                <button
                  type="button"
                  onClick={() => window.location.assign("/")}
                  className="btn h-12 min-h-12 w-full rounded-xl border border-base-300 bg-base-100 font-semibold text-base-content hover:bg-base-200"
                >
                  Continue without a photo
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn h-14 min-h-14 w-full rounded-xl border-0 bg-slate-900 text-base font-bold text-white shadow-lg transition hover:bg-amber-700"
              >
                {loading ? (imageUploading ? "Uploading photo..." : "Please wait...") : accountCreated ? (profileImage ? "Retry photo upload" : "Continue") : "Create account"}
                {!loading && <FiArrowRight size={18} />}
              </button>
            </form>

            <div className="divider my-6 text-xs text-base-content/40">
              ALREADY A MEMBER?
            </div>

            <p className="text-center text-sm text-base-content/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-amber-700 hover:underline"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-7 text-center text-xs leading-5 text-base-content/50">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-2">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Page;
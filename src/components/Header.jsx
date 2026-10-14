"use client"
import useAuth from "@/hooks/useAuth";
import { LogInIcon, LogOutIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Router } from "next/router";
import toast from "react-hot-toast";
import Loader from "./Loader";

const navlinks = [
  { label: "Home", href: "/" },
  { label: "Magazine", href: "/m" },
  { label: "Smart Connects", href: "/chat" },
  { label: "My KKI", href: "/m/profile" },
];

const Header = () => {

  const { user, logOut, loading } = useAuth();

  const handleLogOut = async () => {
    await logOut();
    toast.success("Logged Out!");
  }

  if (loading) return <Loader></Loader>

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-200/60 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-14 w-12 items-center justify-center">
            <Image src={"/media/kki.webp"} width={300} height={300} alt="Kavya Kishor International" className="h-full w-full object-contain"/>
          </div>
          <div className="leading-tight hidden sm:block">
            <p className="text-base font-bold tracking-tight text-gray-900">Kavya Kishor International</p>
            <p className="text-xs text-gray-600">Connect. Communicate. Collaborate.</p>
          </div>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-3 md:flex">
          {navlinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-amber-100/70 hover:text-amber-900">
              {link.label}
            </Link>
          ))}
          {
          user && <p className="btn btn-soft btn-warning" onClick={handleLogOut} >Log Out</p>
        }
        {
          !user && <p  onClick={() => {
            redirect("/login")
          }}  className="btn btn-soft btn-warning" >Log In</p>
        }
        </nav>
      </div>
    </header>
  );
};

export default Header;
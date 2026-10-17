"use client";

import useAuth from "@/hooks/useAuth";
import { LogInIcon, LogOutIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();

  const handleLogOut = async () => {
    try {
      await logOut();
      toast.success("Logged Out!");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to log out!");
      console.error("Logout error:", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-200/60 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-14 w-12 items-center justify-center">
            <Image
              src="/media/kki.webp"
              width={300}
              height={300}
              alt="Kavya Kishor International"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="hidden leading-tight sm:block">
            <p className="text-base font-bold tracking-tight text-gray-900">
              Kavya Kishor International
            </p>
            <p className="text-xs text-gray-600">
              Connect. Communicate. Collaborate.
            </p>
          </div>
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-3 md:flex"
        >
          {navlinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === link.href
                  ? "bg-amber-100 text-amber-900"
                  : "text-gray-700 hover:bg-amber-100/70 hover:text-amber-900"
              }`}
              // className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-amber-100/70 hover:text-amber-900"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <button
              type="button"
              onClick={handleLogOut}
              className="btn btn-soft btn-warning"
            >
              <LogOutIcon size={16} />
              Log Out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="btn btn-soft btn-warning"
            >
              <LogInIcon size={16} />
              Log In
            </button>
          )}
        </nav>

        <div className="flex lg:hidden dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            aria-label="Open navigation menu"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="flex w-10 items-center justify-center rounded-full">
              <Image
                src={user?.dbUser?.photoURL || "/media/kki.webp"}
                width={40}
                height={40}
                alt="KKI menu"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content z-10 mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
          <Link
            href={link.href}
            className={
              pathname === link.href
                ? "bg-amber-100 font-semibold text-amber-900"
                : ""
            }
            aria-current={pathname === link.href ? "page" : undefined}
          >
            {link.label}
          </Link>

            {user ? (
              <li>
                <button type="button" onClick={handleLogOut}>
                  <LogOutIcon size={16} />
                  Log Out
                </button>
              </li>
            ) : (
              <li>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                >
                  <LogInIcon size={16} />
                  Log In
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
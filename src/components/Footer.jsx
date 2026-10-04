import Image from "next/image";
import Link from "next/link";
import React from "react";

const MAGAZINE_LINKS = [
  { label: "Magazine", href: "/m/" },
  { label: "Authors", href: "/m/author" },
  { label: "Submit Writing", href: "/m/submit" },
];

const KKI_LINKS = [
  { label: "About KKI", href: "https://en.kavyakishor.com/about" },
  { label: "KKI Magazine", href: "https://en.kavyakishor.com/" },
  { label: "Contact", href: "https://en.kavyakishor.com/contact" },
];

const Footer = () => {
  return (
    <footer className="mt-8 border-t border-amber-200/60 bg-white/40 backdrop-blur-md">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-10 items-center justify-center">
              <Image src="/media/kki.webp" width={300} height={300} alt="Kavya Kishor International" className="h-full w-full object-contain"/>
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-gray-900">Kavya Kishor International</p>
              <p className="text-xs text-gray-600">Connect. Communicate. Collaborate.</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600">A connected digital platform for KKI authors, readers, editors, reviewers, and collaborators to publish, communicate, and collaborate.</p>
          <p className="mt-4 text-sm font-semibold text-amber-800">Publish. Connect. Collaborate.</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">KKI Magazine</h2>
          <ul className="mt-4 space-y-2.5">
            {MAGAZINE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-gray-600 transition hover:text-amber-800 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}

            <li>
              <Link href="/chat/" className="text-sm text-gray-600 transition hover:text-amber-800 hover:underline">Smart Connects</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900">Kavya Kishor</h2>
          <ul className="mt-4 space-y-2.5">
            {KKI_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" className="text-sm text-gray-600 transition hover:text-amber-800 hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-amber-200/60 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-xs text-gray-500">{new Date().getFullYear()} Kavya Kishor International. All rights reserved.</p>

        <p className="text-xs text-gray-500">Developed by{" "}
          <Link href="https://parvejhusentalukder.com/" target="_blank" className="font-semibold text-amber-800 hover:underline">PHT</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
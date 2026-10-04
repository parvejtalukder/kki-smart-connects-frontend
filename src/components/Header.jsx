import Image from "next/image";
import Link from "next/link";

const navlinks = [
  { label: "Home", href: "/" },
  { label: "Magazine", href: "/m" },
  { label: "Smart Connects", href: "/chat" },
  { label: "My KKI", href: "/m/profile" },
];

const Header = () => {
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
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navlinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-amber-100/70 hover:text-amber-900">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/auth" className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-amber-100/70 hover:text-amber-900 sm:block">Sign in</Link>
          <Link href="/auth" className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600">Get started</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
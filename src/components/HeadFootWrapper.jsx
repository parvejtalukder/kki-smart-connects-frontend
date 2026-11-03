"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";

const noHeaderFooter = ["/chat", "/admin"];

const isHeadFootLess = (pathname) =>
  noHeaderFooter.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

const HeadFootWrapper = ({ children }) => {
  const pathname = usePathname();

  if (isHeadFootLess(pathname)) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
};

export default HeadFootWrapper;

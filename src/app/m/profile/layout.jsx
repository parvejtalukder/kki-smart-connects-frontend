import AllowUserOnly from "@/lib/protection/AllowUserOnly";
import React from "react";

export const metadata = {
  title: '%s | KKI Smart Connects',
  description:
    'Manage your KKI Smart Connects profile, account information, and personal details.',
};

export default function ProfileLayout({ children }) {
  return (
    <main className="min-h-screen bg-paper">
      <AllowUserOnly>
      {children}
      </AllowUserOnly>
    </main>
  );
}

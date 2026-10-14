'use client'

import Loader from "@/components/Loader";
import useAuth from "@/hooks/useAuth";

export default function RootLoader({ children }) {
  
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <Loader></Loader>
      </div>
    );
  }

  return <>{children}</>;
}

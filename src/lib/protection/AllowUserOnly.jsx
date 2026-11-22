"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";

const AllowUserOnly = ({ children }) => {
    
  const { user, loading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (loading || user || hasRedirected.current) return;
    hasRedirected.current = true;
    toast.error("Authentication required");

    router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return null;
  }

  return children;
};

export default AllowUserOnly;
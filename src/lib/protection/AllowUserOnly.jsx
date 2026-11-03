"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";

const AllowUserOnly = ({ children }) => {
    
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading || user || hasRedirected.current) return;
    hasRedirected.current = true;
    toast.error("Authentication required");

    router.replace("/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return null;
  }

  return children;
};

export default AllowUserOnly;
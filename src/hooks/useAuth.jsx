"use client"

import { AuthContext } from "@/context/auth/AuthContext";
import { useContext } from "react";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export default useAuth;
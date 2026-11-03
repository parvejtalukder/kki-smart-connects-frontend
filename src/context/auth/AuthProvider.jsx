"use client";

import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";
import { auth } from "@/config/config.firebase";
import apiFetch from "@/utils/apiFetch";

const googleProvider = new GoogleAuthProvider();

const getusersFromDB = async () => {
  try {
    const data = await apiFetch("/users/me");

    return data.user;
  } catch (error) {
    console.error("getusersFromDB error:", error);
    return null;
  }
};

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(user);

  const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const goWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const sendReset = (email) => {
    const cleanEmail = String(email || "").trim();

    return sendPasswordResetEmail(auth, cleanEmail);
  };

  const logOut = () => {
    return signOut(auth);
  };

  const updateUser = (profile) => {
    if (!auth.currentUser) {
      throw new Error("No authenticated user.");
    }

    return updateProfile(auth.currentUser, profile);
  };

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    try {
      if (!currentUser) {
        setUser(null);
        return;
      }
      const usersFromDB = await getusersFromDB();
      setUser({
        ...currentUser,
        role: usersFromDB?.role ?? null,
        dbUser: usersFromDB,
      });
    } catch (error) {
      console.error("Auth state error:", error);
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);

  const authInfo = {
    user,
    loading,
    setLoading,
    registerUser,
    signInUser,
    goWithGoogle,
    sendReset,
    logOut,
    updateUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
"use client";

import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";
import { auth } from "@/config/config.firebase";

const googleProvider = new GoogleAuthProvider();

const getUserFromBD = async (currentUser) => {
  try {
    const token = await currentUser.getIdToken();

    const resData = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await resData.json();

    if (!resData.ok) {
      throw new Error(data.message || "Failed to fetch user from database.");
    }

    return data.user;
  } catch (error) {
    console.error("getUserFromBD error:", error);
    return null;
  }
};

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(user);

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
      const userFromBD = await getUserFromBD(currentUser);
      setUser({
        ...currentUser,
        role: userFromBD?.role ?? null,
        dbUser: userFromBD,
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
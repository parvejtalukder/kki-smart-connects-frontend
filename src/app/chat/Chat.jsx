"use client";

import Loader from "@/components/Loader";
import SelectLanguage from "@/components/popups/SelectLanguage";
import useAuth from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";

const Chat = () => {
  const { loading, user } = useAuth();
  const dbUser = user?.dbUser;

  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  useEffect(() => {
    if (!loading && dbUser && !dbUser.language) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowLanguagePopup(true);
    }
  }, [loading, dbUser]);

  const handleLanguageSelect = (language) => {
    console.log("Selected language:", language);
    setShowLanguagePopup(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <SelectLanguage
        open={showLanguagePopup}
        onOpenChange={setShowLanguagePopup}
        currentLanguage={dbUser?.language}
        onLanguageSelect={handleLanguageSelect}
      />

      <div>
        {/* Your chat UI */}
      </div>
    </>
  );
};

export default Chat;
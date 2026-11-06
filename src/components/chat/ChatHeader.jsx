"use client";

import { getInitials } from "@/utils/chatHelpers";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { useState } from "react";

const ChatHeader = ({ person, onBack }) => {
  const [failedPhotoUrl, setFailedPhotoUrl] = useState(null);

  return (
    <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to conversations"
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {person.photoURL && person.photoURL !== failedPhotoUrl ? (
        <img
          src={person.photoURL}
          alt=""
          className="h-11 w-11 rounded-full bg-slate-100 object-cover"
          onError={() => setFailedPhotoUrl(person.photoURL)}
        />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
          {getInitials(person.displayName)}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold text-slate-900">
          {person.displayName || "KKI Member"}
        </h2>
        <p className="mt-0.5 text-xs text-emerald-600">
          KKI community member
        </p>
      </div>

      <button
        type="button"
        aria-label="More options"
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
    </header>
  );
};

export default ChatHeader;

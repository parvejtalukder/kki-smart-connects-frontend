"use client";

import { formatTime, getInitials, getPreview } from "@/utils/chatHelpers";
import { useState } from "react";

const ConversationItem = ({ person, isSelected, activeTab, onSelect }) => {
  const [failedPhotoUrl, setFailedPhotoUrl] = useState(null);

  return (
    <button
      type="button"
      onClick={() => onSelect(person)}
      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
        isSelected ? "bg-brand-50 ring-1 ring-brand-200" : "hover:bg-paper-50"
      }`}
    >
      {person.photoURL && person.photoURL !== failedPhotoUrl ? (
        <img
          src={person.photoURL}
          alt=""
          className="h-12 w-12 shrink-0 rounded-full bg-paper-100 object-cover"
          onError={() => setFailedPhotoUrl(person.photoURL)}
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-100 font-bold text-brand-800">
          {getInitials(person.displayName)}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-ink-700">
            {person.displayName || "KKI Member"}
          </span>
          {person.lastMessageAt && (
            <span className="shrink-0 text-[10px] text-ink-300">
              {formatTime(person.lastMessageAt)}
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-xs text-ink-500">
          {activeTab === "users"
            ? person.bio || person.email || "Start chatting"
            : getPreview(person)}
        </p>
      </div>
    </button>
  );
};

export default ConversationItem;

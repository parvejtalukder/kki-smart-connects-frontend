"use client";

import { MessagesSquare, Users } from "lucide-react";

const EmptyChat = ({ onExploreMembers }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-100 text-brand-700">
        <MessagesSquare className="h-9 w-9" />
      </div>
      <h2 className="mt-6 text-xl font-bold text-ink-700">
        Your conversations, connected
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-ink-500">
        Select a conversation or find a member to start chatting in
        your preferred language.
      </p>
      <button
        type="button"
        onClick={onExploreMembers}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-royal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-royal-700"
      >
        <Users className="h-4 w-4" />
        Explore members
      </button>
    </div>
  );
};

export default EmptyChat;

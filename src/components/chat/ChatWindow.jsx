"use client";

import ChatHeader from "@/components/chat/ChatHeader";
import EmptyChat from "@/components/chat/EmptyChat";
import MessageInput from "@/components/chat/MessageInput";
import MessageList from "@/components/chat/MessageList";
import { X } from "lucide-react";

const ChatWindow = ({
  selectedUser,
  messages,
  loadingMessages,
  currentUserId,
  mobileChatOpen,
  error,
  draft,
  sending,
  bottomRef,
  onBack,
  onDraftChange,
  onSend,
  onDismissError,
  onExploreMembers,
}) => {
  return (
    <section
      className={`${
        mobileChatOpen ? "flex" : "hidden"
      } min-w-0 flex-1 flex-col bg-slate-50 md:flex`}
    >
      {!selectedUser ? (
        <EmptyChat onExploreMembers={onExploreMembers} />
      ) : (
        <>
          <ChatHeader person={selectedUser} onBack={onBack} />

          <MessageList
            messages={messages}
            loadingMessages={loadingMessages}
            currentUserId={currentUserId}
            personName={selectedUser.displayName || "this member"}
            bottomRef={bottomRef}
          />

          {error && (
            <div className="mx-4 mb-2 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 sm:mx-6">
              <span>{error}</span>
              <button
                type="button"
                onClick={onDismissError}
                aria-label="Dismiss error"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <MessageInput
            draft={draft}
            onDraftChange={onDraftChange}
            onSend={onSend}
            sending={sending}
            loadingMessages={loadingMessages}
          />
        </>
      )}
    </section>
  );
};

export default ChatWindow;

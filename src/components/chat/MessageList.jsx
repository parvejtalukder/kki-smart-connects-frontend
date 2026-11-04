"use client";

import MessageBubble from "@/components/chat/MessageBubble";
import { LoaderCircle, MessageCircle } from "lucide-react";

const MessageList = ({
  messages,
  loadingMessages,
  currentUserId,
  personName,
  bottomRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {loadingMessages ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
            <LoaderCircle className="h-5 w-5 animate-spin text-amber-500" />
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center">
            <MessageCircle className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-4 font-semibold text-slate-700">
              Start your conversation
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Send the first message to {personName}.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={message._id || `${message.createdAt}-${index}`}
              message={message}
              currentUserId={currentUserId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default MessageList;

"use client";

import { CheckCheck, LoaderCircle } from "lucide-react";
import { formatTime } from "@/utils/chatHelpers";

const MessageBubble = ({ message, currentUserId }) => {
  const senderId = String(
    message.senderId?._id ?? message.senderId ?? ""
  );

  const isMine =
    Boolean(currentUserId) &&
    senderId === currentUserId;

    const translationStatus = 
      message.textMessage?.translationStatus;
    const isTranslating =
      !isMine && translationStatus === "pending";
    const translationFailed =
      !isMine && translationStatus === "failed";

    const text = message.textMessage
      ? isMine
        ? message.textMessage.originalText ||
          message.textMessage.translatedText
        : message.textMessage.translatedText ||
          message.textMessage.originalText
      : "";

  const image =
    typeof message.imageMessage === "string"
      ? message.imageMessage
      : message.imageMessage?.url;

  
  return (
    <div
      className={`flex ${
        isMine ? "justify-end" : "justify-start"
      }`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[75%]   ${
          isMine
            ? "rounded-br-md bg-amber-500 text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
        }`}>
        {image && (
          <img
            src={image}
            alt="Shared image"
            className="mb-2 max-h-72 rounded-lg object-contain"
          />
        )}
  
        {text && (
          <p className="whitespace-pre-wrap break-words text-sm leading-6">
            {text}
          </p>
        )}
  
        {isTranslating && (
          <div className="mt-1 flex items-center gap-1.5 text-xs italic   opacity-70">
            <LoaderCircle className="h-3 w-3 animate-spin" />
            <span>Translating...</span>
          </div>
        )}
  
        {translationFailed && (
          <p className="mt-1 text-xs italic opacity-70">
            Translation unavailable
          </p>
        )}
  
        <div
          className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
            isMine ? "text-blue-100" : "text-slate-400"
          }`}
        >
          <span>{formatTime(message.createdAt)}</span>
  
          {isMine && (
            <CheckCheck className="h-3.5 w-3.5" />
          )}
        </div>
      </div>
    </div>
  );
};  
  
export default MessageBubble;
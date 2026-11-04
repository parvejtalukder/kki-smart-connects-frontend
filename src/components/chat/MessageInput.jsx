"use client";

import { Image as ImageIcon, LoaderCircle, Send } from "lucide-react";

const MessageInput = ({ draft, onDraftChange, onSend, sending, loadingMessages }) => {
  return (
    <div className="border-t border-slate-200 bg-white p-3 sm:px-6 sm:py-4">
      <form
        onSubmit={onSend}
        className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-amber-300 focus-within:ring-4 focus-within:ring-blue-50"
      >
        <button
          type="button"
          title="Image uploads are not connected yet"
          aria-label="Image uploads not available"
          className="mb-0.5 rounded-xl p-2 text-slate-400"
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        <textarea
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          rows={1}
          placeholder="Write a message..."
          className="max-h-32 min-h-10 flex-1 resize-y bg-transparent px-1 py-2 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400"
        />

        <button
          type="submit"
          disabled={!draft.trim() || sending || loadingMessages}
          aria-label="Send message"
          className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {sending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>

      <p className="mt-2 text-center text-[10px] text-slate-400">
        Enter to send, Shift + Enter for a new line
      </p>
    </div>
  );
};

export default MessageInput;

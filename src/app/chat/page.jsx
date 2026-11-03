"use client";

import Loader from "@/components/Loader";
import SelectLanguage from "@/components/popups/SelectLanguage";
import useAuth from "@/hooks/useAuth";
import apiFetch from "@/utils/apiFetch";
import { ArrowLeft, CheckCheck, HomeIcon, Image as ImageIcon, LoaderCircle, MessageCircle, MessagesSquare, MoreHorizontal, Search, Send, Users, X, } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const getId = (person) => String(person?._id ?? person?.id ?? "");

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  if (date.toDateString() === new Date().toDateString()) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};

const getPreview = (person) => person.lastMessageIsImage  ? "Photo" : person.lastMessage || "Start a conversation";

const Chat = () => {
    const { loading, user } = useAuth();
    const dbUser = user?.dbUser;
    const [showLanguagePopup, setShowLanguagePopup] = useState(false);
    const [activeTab, setActiveTab] = useState("conversations");
    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [search, setSearch] = useState("");
    const [draft, setDraft] = useState("");
    const [loadingList, setLoadingList] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [mobileChatOpen, setMobileChatOpen] = useState(false);
    const bottomRef = useRef(null);
    const requestIdRef = useRef(0);

    useEffect(() => {
        if (!loading && dbUser && !dbUser.language) {
        setShowLanguagePopup(true);
        }
    }, [loading, dbUser]);

    const loadConversations = useCallback(async () => {
        const data = await apiFetch("/messages/conversations");
        setConversations(data.conversations ?? []);
    }, []);

    const loadUsers = useCallback(async () => {
        const data = await apiFetch("/messages/users");
        setUsers(data.users ?? []);
    }, []);

    useEffect(() => {
        if (loading || !user) return;

        let cancelled = false;

        const run = async () => {
        setLoadingList(true);
        setError("");

        try {
            const data = await apiFetch("/messages/conversations");
            if (!cancelled) {
            setConversations(data.conversations ?? []);
            }
        } catch (err) {
            if (!cancelled) {
            setError(err.message || "Could not load conversations.");
            }
        } finally {
            if (!cancelled) setLoadingList(false);
        }
        };

        run();
        return () => {
        cancelled = true;
        };
    }, [loading, user]);

    useEffect(() => {
        if (loading || !user || activeTab !== "users") return;
        let cancelled = false;
        const run = async () => {
        setLoadingList(true);
        setError("");

        try {
            const data = await apiFetch("/messages/users");
            if (!cancelled) setUsers(data.users ?? []);
        } catch (err) {
            if (!cancelled) {
            setError(err.message || "Could not load users.");
            }
        } finally {
            if (!cancelled) setLoadingList(false);
        }
        };

        run();

        return () => {
        cancelled = true;
        };
    }, [activeTab, loading, user]);

    const openChat = useCallback(
        async (person) => {
        const id = getId(person);

        if (!id) {
            setError("This user has no valid database ID.");
            return;
        }

        const requestId = ++requestIdRef.current;

        setSelectedUser(person);
        setMobileChatOpen(true);
        setMessages([]);
        setLoadingMessages(true);
        setError("");

        try {
            const data = await apiFetch(`/messages/${encodeURIComponent(id)}`);

            if (requestId === requestIdRef.current) {
            setMessages(data.messages ?? []);
            }
        } catch (err) {
            if (requestId === requestIdRef.current) {
            setError(err.message || "Could not load messages.");
            }
        } finally {
            if (requestId === requestIdRef.current) {
            setLoadingMessages(false);
            }
        }
        },
        []
    );

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loadingMessages]);

    const handleLanguageSelect = (language) => {
        console.log("Selected language:", language);
        setShowLanguagePopup(false);
    };

    const handleSend = async (event) => {
        event.preventDefault();

        const text = draft.trim();
        const receiverId = getId(selectedUser);

        if (!text || !receiverId || sending) return;

        setSending(true);
        setError("");

        try {
        const data = await apiFetch(
            `/messages/send/${encodeURIComponent(receiverId)}`,
            {
            method: "POST",
            body: JSON.stringify({ text }),
            }
        );

        if (data.data) {
            setMessages((previous) => [...previous, data.data]);
        }

        setDraft("");
        await loadConversations().catch(() => {});
        } catch (err) {
        setError(err.message || "Could not send the message.");
        } finally {
        setSending(false);
        }
    };

    const currentUserId = String(dbUser?._id ?? "");

    const visiblePeople = useMemo(() => {
        const source =
        activeTab === "conversations" ? conversations : users;

        const query = search.trim().toLowerCase();

        return source.filter((person) => {
        if (getId(person) === currentUserId) return false;

        return (
            !query ||
            (person.displayName || "").toLowerCase().includes(query) ||
            (person.email || "").toLowerCase().includes(query) ||
            getPreview(person).toLowerCase().includes(query)
        );
        });
    }, [activeTab, conversations, users, search, currentUserId]);

    if (loading) return <Loader />;

    return (
        <>
        <SelectLanguage
            open={showLanguagePopup}
            onOpenChange={setShowLanguagePopup}
            currentLanguage={dbUser?.language}
            onLanguageSelect={handleLanguageSelect}
        />

        <main className="h-dvh min-h-[480px] w-full bg-slate-50 md:p-4 lg:p-6">
            <div className="mx-auto flex h-full max-w-[1600px] overflow-hidden border-slate-200 bg-white md:rounded-2xl md:border md:shadow-sm">
          
          <aside
            className={`${
              mobileChatOpen ? "hidden" : "flex"
            } w-full shrink-0 flex-col border-r border-slate-200 bg-white md:flex md:w-80 lg:w-96`}
          >
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-500">
                    KKI Smart Connects
                  </p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                    Messages
                  </h1>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                  <Link href={"/"}><HomeIcon className="h-5 w-5" /></Link>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("conversations");
                    setSearch("");
                    setError("");
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-sm font-semibold transition ${
                    activeTab === "conversations"
                      ? "bg-white text-amber-500 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  Chats
                  {conversations.length > 0 && (
                    <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] text-amber-500">
                      {conversations.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("users");
                    setSearch("");
                    setError("");
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-sm font-semibold transition ${
                    activeTab === "users"
                      ? "bg-white text-amber-500 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Users
                </button>
              </div>

              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={
                    activeTab === "conversations"
                      ? "Search conversations..."
                      : "Find people..."
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {activeTab === "conversations"
                  ? "Recent conversations"
                  : "Community members"}
              </p>

              {loadingList ? (
                <div className="flex flex-col items-center gap-3 py-12 text-sm text-slate-500">
                  <LoaderCircle className="h-6 w-6 animate-spin text-amber-500" />
                  Loading...
                </div>
              ) : visiblePeople.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <MessagesSquare className="mx-auto mb-3 h-9 w-9 text-slate-300" />
                  <p className="font-semibold text-slate-700">
                    {search
                      ? "No matches found"
                      : activeTab === "users"
                      ? "No users found"
                      : "No conversations yet"}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-slate-400">
                    {search
                      ? "Try a different search."
                      : activeTab === "users"
                      ? "No other active members are available."
                      : "Choose Users to start a new conversation."}
                  </p>

                  {!search && activeTab === "conversations" && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("users")}
                      className="mt-4 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Find people
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  {visiblePeople.map((person) => {
                    const id = getId(person);
                    const isSelected = getId(selectedUser) === id;

                    return (
                      <button
                        type="button"
                        key={id}
                        onClick={() => openChat(person)}
                        className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                          isSelected
                            ? "bg-blue-50 ring-1 ring-blue-100"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        {person.photoURL ? (
                          <img
                            src={person.photoURL}
                            alt=""
                            className="h-12 w-12 shrink-0 rounded-full bg-slate-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 font-bold text-blue-700">
                            {(person.displayName || "?")
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-semibold text-slate-800">
                              {person.displayName || "KKI Member"}
                            </span>
                            {person.lastMessageAt && (
                              <span className="shrink-0 text-[10px] text-slate-400">
                                {formatTime(person.lastMessageAt)}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {activeTab === "users"
                              ? person.bio || person.email || "Start chatting"
                              : getPreview(person)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 px-4 py-3">
              <p className="text-xs text-slate-400">
                KKI Smart Connects
              </p>
            </div>
          </aside>

          <section
            className={`${
              mobileChatOpen ? "flex" : "hidden"
            } min-w-0 flex-1 flex-col bg-slate-50 md:flex`}
          >
            {!selectedUser ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-amber-500">
                  <MessagesSquare className="h-9 w-9" />
                </div>
                <h2 className="mt-6 text-xl font-bold text-slate-800">
                  Your conversations, connected
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Select a conversation or find a member to start chatting in
                  your preferred language.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("users")}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-700"
                >
                  <Users className="h-4 w-4" />
                  Explore members
                </button>
              </div>
            ) : (
              <>
                <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setMobileChatOpen(false)}
                    aria-label="Back to conversations"
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  {selectedUser.photoURL ? (
                    <img
                      src={selectedUser.photoURL}
                      alt=""
                      className="h-11 w-11 rounded-full bg-slate-100 object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                      {(selectedUser.displayName || "?")
                        .trim()
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold text-slate-900">
                      {selectedUser.displayName || "KKI Member"}
                    </h2>
                    <p className="mt-0.5 text-xs text-emerald-600">
                      {/* eiikhane dynamic subtitle impelment hobe */}
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
                          Send the first message to{" "}
                          {selectedUser.displayName || "this member"}.
                        </p>
                      </div>
                    ) : (
                      messages.map((message, index) => {
                        const senderId = String(
                          message.senderId?._id ??
                            message.senderId ??
                            ""
                        );

                        const isMine =
                          Boolean(currentUserId) &&
                          senderId === currentUserId;

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
                            key={message._id || `${message.createdAt}-${index}`}
                            className={`flex ${
                              isMine ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[75%] ${
                                isMine
                                  ? "rounded-br-md bg-amber-500 text-white"
                                  : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                              }`}
                            >
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
                      })
                    )}
                    <div ref={bottomRef} />
                  </div>
                </div>

                {error && (
                  <div className="mx-4 mb-2 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 sm:mx-6">
                    <span>{error}</span>
                    <button
                      type="button"
                      onClick={() => setError("")}
                      aria-label="Dismiss error"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="border-t border-slate-200 bg-white p-3 sm:px-6 sm:py-4">
                  <form
                    onSubmit={handleSend}
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
                      onChange={(event) => setDraft(event.target.value)}
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
                    Enter to send · Shift + Enter for a new line
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default Chat;
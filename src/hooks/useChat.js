"use client";

import useAuth from "@/hooks/useAuth";
import useChatSocket from "@/hooks/useChatSocket";
import apiFetch from "@/utils/apiFetch";
import { getId, getPreview } from "@/utils/chatHelpers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";


const uniqueMessages = (previous, incoming) => {
    const incomingId = String(incoming?._id ?? ""); 
    if (!incomingId) return previous;   

    const alreadyExists = previous.some(
        (message) => String(message._id) === incomingId
    );  
    
    if (alreadyExists) return previous; 
    return [...previous, incoming];
};


const mergeMessages = (history, liveMessages) => {
  const map = new Map();

  for (const message of [...history, ...liveMessages]) {
    const id = String(message?._id ?? "");

    if (id) {
      map.set(id, message);
    }
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
  );
};


const useChat = () => {
    const { loading, user } = useAuth();
    const dbUser = user?.dbUser;
    const socket = useChatSocket();
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
    const activeChatIdRef = useRef("");

    useEffect(() => {
        if (!loading && dbUser && !dbUser.language) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShowLanguagePopup(true);
        }
    }, [loading, dbUser]);

    const loadConversations = useCallback(async () => {
        const data = await apiFetch("/messages/conversations");
        setConversations(data.conversations ?? []);
    }, []);

    
    useEffect(() => {
      if (!socket || !dbUser?._id) return;
      const handleNewMessage = (message) => {

        const myId = String(dbUser._id);
        const senderId = String(
          message.senderId?._id ?? message.senderId ?? ""
        );

        const receiverId = String(
          message.receiverId?._id ?? message.receiverId ?? ""
        );

        // const selectedId = getId(selectedUser);
        const selectedId = activeChatIdRef.current;
        const involvesMe = senderId === myId || receiverId === myId;

        if (!involvesMe) return;

        const belongsToOpenChat =
          selectedId &&
          (
            (senderId === myId && receiverId === selectedId) ||
            (senderId === selectedId && receiverId === myId)
          );

        if (belongsToOpenChat) {
          setMessages((previous) =>
            uniqueMessages(previous, message)
          );
        }

        loadConversations().catch((error) => {
          console.error("Conversation refresh failed:", error);
        });
      };


      const handleMessageTranslated = ({ _id, translatedText }) => {
        setMessages((previous) =>
          previous.map((message) => {
            if (String(message._id) !== String(_id)) {
              return message;
            }
      
            return {
              ...message,
              textMessage: {
                ...message.textMessage,
                translatedText,
                translationStatus: "done",
              },
            };
          })
        );
      
        setConversations((previous) =>
          previous.map((conversation) => {
            if (String(conversation.lastMessageId) !== String(_id)) {
              return conversation;
            }
      
            if (
              String(conversation.lastMessageSenderId) ===
              String(dbUser._id)
            ) {
              return conversation;
            }
      
            return {
              ...conversation,
              lastMessage: translatedText,
            };
          })
        );
      };

      const handleMessageTranslationFailed = ({ _id }) => {
        setMessages(
            (previous) => 
                previous.map((message) => {
                    if (String(message._id) !== String(_id)) {
                        return message;
                    }

                    return {
                        ...message,
                        textMessage: {
                            ...message.textMessage,
                            translationStatus: "failed",
                        },
                    }

                } )
        )
      }

      socket.on("newMessage", handleNewMessage);
      socket.on("messageTranslated", handleMessageTranslated);
      socket.on("messageTranslationFailed", handleMessageTranslationFailed);

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("messageTranslated", handleMessageTranslated);
        socket.off("messageTranslationFailed", handleMessageTranslationFailed);
      };

    }, [socket, dbUser?._id, loadConversations]);

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

        activeChatIdRef.current = id;
        

        setSelectedUser(person);
        setMobileChatOpen(true);
        setMessages([]);
        setLoadingMessages(true);
        setError("");

        try {
            const data = await apiFetch(`/messages/${encodeURIComponent(id)}`);

            if (requestId === requestIdRef.current) {
               setMessages((previous) =>
                 mergeMessages(data.messages ?? [], previous)
               );
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
            setMessages((previous) =>
                uniqueMessages(previous, data.data)
            );
        }

        setDraft("");
        void loadConversations().catch((error) => {
          console.error("Conversation refresh failed:", error);
        });

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

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
        setSearch("");
        setError("");
    }, []);

    const handleFindPeople = useCallback(() => {
        setActiveTab("users");
    }, []);

    const dismissError = useCallback(() => {
        setError("");
    }, []);

    const closeMobileChat = useCallback(() => {
        setMobileChatOpen(false);
    }, []);

    return {
        loading,
        user,
        dbUser,
        socket,

        showLanguagePopup,
        setShowLanguagePopup,
        handleLanguageSelect,

        activeTab,
        handleTabChange,
        handleFindPeople,

        conversations,
        users,
        visiblePeople,
        loadConversations,

        search,
        setSearch,

        selectedUser,
        openChat,
        closeMobileChat,
        mobileChatOpen,

        messages,
        loadingMessages,
        currentUserId,
        sending,
        draft,
        setDraft,
        handleSend,

        error,
        dismissError,

        loadingList,
        bottomRef,
    };
};

export default useChat;

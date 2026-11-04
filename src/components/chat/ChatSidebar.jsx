"use client";

import ConversationItem from "@/components/chat/ConversationItem";
import { getId } from "@/utils/chatHelpers";
import {
  HomeIcon,
  LoaderCircle,
  MessageCircle,
  MessagesSquare,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";

const ChatSidebar = ({
  mobileChatOpen,
  activeTab,
  onTabChange,
  conversationsCount,
  search,
  onSearchChange,
  loadingList,
  visiblePeople,
  selectedUser,
  onSelectPerson,
  onFindPeople,
}) => {
  const tabClass = (tab) =>
    `flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-sm font-semibold transition ${
      activeTab === tab
        ? "bg-white text-amber-500 shadow-sm"
        : "text-slate-500 hover:text-slate-800"
    }`;

  return (
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
            <Link href={"/"}>
              <HomeIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => onTabChange("conversations")}
            className={tabClass("conversations")}
          >
            <MessageCircle className="h-4 w-4" />
            Chats
            {conversationsCount > 0 && (
              <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] text-amber-500">
                {conversationsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange("users")}
            className={tabClass("users")}
          >
            <Users className="h-4 w-4" />
            Users
          </button>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
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
                onClick={onFindPeople}
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

              return (
                <ConversationItem
                  key={id}
                  person={person}
                  isSelected={getId(selectedUser) === id}
                  activeTab={activeTab}
                  onSelect={onSelectPerson}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 px-4 py-3">
        <Link href={"/"} className="text-xs text-slate-400">
          KKI Smart Connects
        </Link>
      </div>
    </aside>
  );
};

export default ChatSidebar;

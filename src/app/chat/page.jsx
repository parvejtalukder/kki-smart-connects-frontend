"use client";

import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import Loader from "@/components/Loader";
import SelectLanguage from "@/components/popups/SelectLanguage";
import useChat from "@/hooks/useChat";

const Chat = () => {
  const {
    loading,
    dbUser,

    showLanguagePopup,
    setShowLanguagePopup,
    handleLanguageSelect,

    activeTab,
    handleTabChange,
    handleFindPeople,

    conversations,
    visiblePeople,

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
  } = useChat();

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
          <ChatSidebar
            mobileChatOpen={mobileChatOpen}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            conversationsCount={conversations.length}
            search={search}
            onSearchChange={setSearch}
            loadingList={loadingList}
            visiblePeople={visiblePeople}
            selectedUser={selectedUser}
            onSelectPerson={openChat}
            onFindPeople={handleFindPeople}
          />

          <ChatWindow
            selectedUser={selectedUser}
            messages={messages}
            loadingMessages={loadingMessages}
            currentUserId={currentUserId}
            mobileChatOpen={mobileChatOpen}
            error={error}
            draft={draft}
            sending={sending}
            bottomRef={bottomRef}
            onBack={closeMobileChat}
            onDraftChange={setDraft}
            onSend={handleSend}
            onDismissError={dismissError}
            onExploreMembers={handleFindPeople}
          />
        </div>
      </main>
    </>
  );
};

export default Chat;

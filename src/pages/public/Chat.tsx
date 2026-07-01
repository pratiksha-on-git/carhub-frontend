import { useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { useCustomerChatUsers } from "@/hooks/public/useCustomerChatUsers";
import { useCustomer, getCustomerId } from "@/hooks/public/useCustomerAuth";
import { SEO } from "@/components/shared/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Send,
  Clock,
  CheckCheck,
  Search,
  Sparkles,
  ArrowLeft,
  Compass,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ROLE_CONFIG = {
  ADMIN: { label: "Admin", style: "bg-red-50 text-red-700 border-red-200" },
  DEALER: { label: "Dealer", style: "bg-blue-50 text-blue-700 border-blue-200" },
  CUSTOMER: { label: "Customer", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export default function CustomerChat() {
  const { data: users = [], isLoading, error, refetch } = useCustomerChatUsers();
  const customer = useCustomer();
  const customerId = getCustomerId();
  const token = customer?.token ?? localStorage.getItem("customerToken") ?? "";

  const {
    threads,
    activeUserId,
    activeUserRole,
    selectThread,
    isTyping,
    isOnline,
    sendMessage,
    sendTypingStatus,
    isConnected,
    totalUnreadCount,
    isHistoryLoading,
  } = useChat({
    currentUserId: Number(customerId ?? 0),
    currentUserRole: "CUSTOMER",
    token,
    users,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeThread = threads.find((t) => t.userId === activeUserId && t.userRole === activeUserRole);
  const filteredThreads = threads.filter((t) =>
    t.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Smooth scroll container to bottom on message updates
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [activeThread?.messages, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    sendTypingStatus(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
    }, 1500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || activeUserId === null) return;

    sendMessage(messageText.trim());
    setMessageText("");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      sendTypingStatus(false);
    }
  };

  const handleSelectThread = (userId: number, userRole: "ADMIN" | "DEALER" | "CUSTOMER") => {
    selectThread(userId, userRole);
    setMobileShowChat(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const avatarBg = (name: string) => {
    const colors = [
      "bg-gradient-to-tr from-rose-500 to-pink-500",
      "bg-gradient-to-tr from-purple-500 to-indigo-500",
      "bg-gradient-to-tr from-emerald-500 to-teal-500",
      "bg-gradient-to-tr from-amber-500 to-orange-500",
      "bg-gradient-to-tr from-sky-500 to-blue-500",
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  return (
    <div className="pb-24 pt-10 min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-rose-50/30 text-slate-800 font-sans overflow-x-hidden">
      <SEO title="Concierge Chats — Caryanam" description="Interact with dealers and support agents in real-time." />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 animate-fade-in">
        {/* Simple Page Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <Sparkles className="h-5 w-5 text-rose-500 animate-pulse" />
          <h1 className="text-3xl font-black font-display tracking-tight text-slate-900">
            My Chats
          </h1>
        </div>

        {/* Outer Chat Box Wrapper */}
        <div className="flex flex-col h-[calc(100vh-16rem)] min-h-[600px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

          {/* ── Top bar (Black Header) ── */}
          <div className="shrink-0 h-13 flex items-center gap-3 px-5 py-3 border-b border-slate-800 bg-black text-white">
            <div className="flex items-center gap-2.5 flex-1">
              <div className="relative">
                <MessageSquare className="h-4 w-4 text-white/70" />
                {totalUnreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-rose-500 text-[8px] font-black text-white flex items-center justify-center">
                    {totalUnreadCount}
                  </span>
                )}
              </div>
              <span className="font-semibold text-sm text-white tracking-tight">
                Dealer & Support Chats {totalUnreadCount > 0 && <span className="text-rose-500 font-bold ml-1 font-sans">({totalUnreadCount})</span>}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20">
              <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
              <span className="text-[10px] font-medium text-white/80">
                {isConnected ? "Connected" : "Syncing Connection..."}
              </span>
            </div>

            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
              title="Refresh users"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* ── Chat Container Grid ── */}
          <div className="flex-1 grid grid-cols-12 overflow-hidden h-full">

            {/* LEFT THREADS PANEL */}
            <div
              className={`col-span-12 md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50 h-full overflow-hidden ${mobileShowChat ? "hidden md:flex" : "flex"
                }`}
            >
              {/* Search inputs */}
              <div className="p-5 border-b border-slate-100 space-y-4 bg-white/50">
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Filter inbox chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 w-full rounded-2xl text-xs bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-rose-500/50 text-slate-800 placeholder:text-slate-400 shadow-none"
                  />
                </div>
              </div>

              {/* List of active chat users */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-chat-scrollbar">
                {isLoading && (
                  <div className="space-y-3 p-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                    ))}
                  </div>
                )}

                {!isLoading && filteredThreads.length === 0 && (
                  <div className="text-center py-16 space-y-3">
                    <MessageSquare className="h-8 w-8 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-400">No conversations found</p>
                  </div>
                )}

                {filteredThreads.map((t) => {
                  const isActive = t.userId === activeUserId && t.userRole === activeUserRole;
                  const unreadMsgCount = t.messages.filter(m => m.sender === "other" && !m.isRead).length || (t.unread ? 1 : 0);

                  return (
                    <motion.button
                      key={`${t.userRole}_${t.userId}`}
                      whileHover={{ scale: 1.01, x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelectThread(t.userId, t.userRole)}
                      className={`w-full flex items-center gap-3.5 p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${isActive
                        ? "bg-rose-50/5 border-rose-200/80 shadow-sm shadow-rose-100/10"
                        : "bg-white border-slate-100 hover:bg-slate-50/80"
                        }`}
                    >
                      <div className="relative shrink-0">
                        <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-xs text-white ${avatarBg(t.userName)}`}>
                          {getInitials(t.userName)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 truncate capitalize">{t.userName}</h4>
                            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border shrink-0 ${ROLE_CONFIG[t.userRole]?.style}`}>
                              {ROLE_CONFIG[t.userRole]?.label}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-[10px] text-slate-400 font-medium">{t.lastTime}</span>
                            {unreadMsgCount > 0 && (
                              <span className="h-5 min-w-5 px-1.5 rounded-full bg-rose-500 text-[10px] font-black text-white flex items-center justify-center shadow-sm">
                                {unreadMsgCount}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className={`text-xs mt-1 truncate ${isActive ? "text-slate-700" : "text-slate-500"} ${!t.lastMessage ? "italic text-slate-400" : ""}`}>
                          {t.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT CONVERSATION PANEL */}
            <div
              className={`col-span-12 md:col-span-8 flex flex-col bg-white h-full overflow-hidden ${mobileShowChat ? "flex" : "hidden md:flex"
                }`}
            >
              {activeThread ? (
                <>
                  {/* Active Chat Header */}
                  <div className="shrink-0 h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => setMobileShowChat(false)}
                        className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 ${avatarBg(activeThread.userName)}`}>
                        {getInitials(activeThread.userName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-sm text-slate-900 truncate capitalize">{activeThread.userName}</h3>
                          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border shrink-0 ${ROLE_CONFIG[activeThread.userRole]?.style}`}>
                            {ROLE_CONFIG[activeThread.userRole]?.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                          <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">
                            {isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages Body */}
                  <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-slate-50/40 custom-chat-scrollbar"
                  >
                    {isHistoryLoading ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="flex justify-start">
                          <div className="bg-slate-200 h-10 w-2/3 rounded-2xl rounded-tl-none" />
                        </div>
                        <div className="flex justify-end">
                          <div className="bg-slate-300/60 h-10 w-1/2 rounded-2xl rounded-tr-none" />
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-slate-200 h-10 w-1/3 rounded-2xl rounded-tl-none" />
                        </div>
                      </div>
                    ) : (
                      <>
                        {activeThread.messages.length === 0 && (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center space-y-3">
                              <MessageSquare className="h-9 w-9 text-slate-200 mx-auto" />
                              <p className="text-xs text-slate-400">Send a message to initiate discussion.</p>
                            </div>
                          </div>
                        )}

                        <AnimatePresence initial={false}>
                          {activeThread.messages.map((m) => {
                            const isMe = m.sender === "me";
                            return (
                              <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.18 }}
                                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                              >
                                <div className="max-w-[70%] space-y-1.5">
                                  <div
                                    className={`px-4.5 py-3 text-xs leading-relaxed shadow-sm ${isMe
                                      ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl rounded-tr-none shadow-rose-200/10"
                                      : "bg-white border border-slate-200/80 text-slate-800 rounded-2xl rounded-tl-none shadow-slate-100/30"
                                      }`}
                                  >
                                    {m.text}
                                  </div>
                                  <div className={`flex items-center gap-1.5 text-[9px] text-slate-400 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                                    <Clock className="h-2.5 w-2.5" />
                                    {m.timestamp}
                                    {isMe && (
                                      <CheckCheck
                                        className={`h-3 w-3 ${m.isRead ? "text-rose-500" : "text-slate-300"
                                          }`}
                                      />
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}

                          {isTyping && (
                            <motion.div
                              key="typing"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="flex justify-start"
                            >
                              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "120ms" }} />
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "240ms" }} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>

                  {/* Input Controls */}
                  <div className="shrink-0 p-4 border-t border-slate-100 bg-white">
                    <form onSubmit={handleSend} className="flex items-center gap-3">
                      <Input
                        placeholder={`Type message for ${activeThread.userName}…`}
                        value={messageText}
                        onChange={handleInputChange}
                        className="flex-1 h-11 rounded-2xl text-xs bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-rose-500/50 text-slate-800 shadow-none placeholder:text-slate-400"
                      />
                      <Button
                        type="submit"
                        disabled={!messageText.trim()}
                        className="h-11 w-11 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-colors shadow-lg cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                /* Empty Inbox Welcome View */
                <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center bg-slate-50/30">
                  <div className="h-20 w-20 rounded-3xl bg-white border border-slate-200 grid place-items-center shadow-xl shadow-slate-100/50">
                    <Compass className="h-9 w-9 text-rose-500 animate-spin-slow" />
                  </div>
                  <div className="max-w-xs space-y-2">
                    <h3 className="font-display font-black text-lg text-slate-800">Your Chat Center</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">
                      Select a conversation from the left to start negotiating prices, booking test drives, or checking availability.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .custom-chat-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-chat-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 99px;
        }
        .custom-chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}

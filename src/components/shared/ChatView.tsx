import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Search,
  ArrowLeft,
  CheckCheck,
  Clock,
  RefreshCw,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import type { ChatUser } from "@/hooks/dealer/useDealerChatUsers";

/* ── Helpers ─────────────────────────────────────────────────────────── */
const ROLE_CONFIG = {
  ADMIN: { label: "Admin", style: "bg-red-50 text-red-700 border-red-200" },
  DEALER: { label: "Dealer", style: "bg-blue-50 text-blue-700 border-blue-200" },
  CUSTOMER: { label: "Customer", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

function avatarBg(name: string): string {
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
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ── Props ───────────────────────────────────────────────────────────── */
interface ChatViewProps {
  currentUserId: number;
  currentUserRole: "ADMIN" | "DEALER" | "CUSTOMER";
  token: string;
  users: ChatUser[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  label?: string;
}

/* ─────────────────────────────────────────────────────────────────────── */
export default function ChatView({
  currentUserId,
  currentUserRole,
  token,
  users,
  loading,
  error,
  onRefresh,
  label = "Customer Chats",
}: ChatViewProps) {
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
  } = useChat({ currentUserId, currentUserRole, token, users });

  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeThread = threads.find((t) => t.userId === activeUserId && t.userRole === activeUserRole);
  const unreadCount = threads.filter((t) => t.unread).length;
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

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] min-h-[540px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl text-slate-800 font-sans">

      {/* ── Top bar (Remains Black) ── */}
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
            {label} {totalUnreadCount > 0 && <span className="text-rose-500 font-bold ml-1">({totalUnreadCount})</span>}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20">
          <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
          <span className="text-[10px] font-medium text-white/80">
            {isConnected ? "Connected" : "Connecting..."}
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
          title="Refresh users"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Thread list */}
        <div
          className={`w-full md:w-[320px] shrink-0 flex flex-col border-r border-slate-200 bg-slate-50/50 h-full overflow-hidden ${mobileShowChat ? "hidden md:flex" : "flex"
            }`}
        >
          {/* Search */}
          <div className="p-3 border-b border-slate-100 bg-white/50">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Filter inbox chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 rounded-xl text-xs bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-rose-500/50 shadow-none"
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="px-3 py-2 flex items-center gap-1.5 border-b border-slate-100 bg-white/30">
            <Users className="h-3 w-3 text-slate-400" />
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
              {filteredThreads.length} users
            </span>
            {unreadCount > 0 && (
              <span className="ml-auto text-[10px] font-semibold text-rose-600">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-chat-scrollbar">
            {loading && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                <RefreshCw className="h-5 w-5 animate-spin opacity-40" />
                <p className="text-xs">Loading…</p>
              </div>
            )}

            {!loading && error && (
              <div className="mx-1 my-2 p-3 rounded-xl bg-red-50 border border-red-100 text-center">
                <p className="text-xs text-red-600 mb-2">{error}</p>
                <button
                  onClick={onRefresh}
                  className="text-[11px] font-semibold text-rose-700 hover:underline cursor-pointer"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && filteredThreads.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                <MessageSquare className="h-6 w-6 opacity-30" />
                <p className="text-xs">No users found</p>
              </div>
            )}

            {!loading &&
              filteredThreads.map((t) => {
                const isSelected = t.userId === activeUserId && t.userRole === activeUserRole;
                const unreadMsgCount = t.messages.length > 0
                  ? t.messages.filter(m => m.sender === "other" && !m.isRead).length
                  : (t.unreadCount || 0);

                return (
                  <motion.button
                    key={`${t.userRole}-${t.userId}`}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectThread(t.userId, t.userRole)}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${isSelected
                      ? "bg-rose-50 border-rose-200 shadow-sm shadow-rose-100/10"
                      : "bg-white border-slate-100 hover:bg-slate-50/80"
                      }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs text-white ${avatarBg(t.userName)}`}>
                        {getInitials(t.userName)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 capitalize truncate">{t.userName}</h4>
                          <span className={`text-[8px] font-semibold px-1 py-0.5 rounded border shrink-0 ${ROLE_CONFIG[t.userRole]?.style}`}>
                            {ROLE_CONFIG[t.userRole]?.label}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                          <span className="text-[10px] text-slate-400 font-medium">{t.lastTime}</span>
                          {unreadMsgCount > 0 && (
                            <span className="h-4 min-w-4 px-1 rounded-full bg-rose-500 text-[8px] font-black text-white flex items-center justify-center shadow-sm">
                              {unreadMsgCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={`text-[10px] mt-0.5 truncate ${isSelected ? "text-slate-700" : "text-slate-500"} ${!t.lastMessage ? "italic text-slate-400" : ""}`}>
                        {t.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
          </div>
        </div>

        {/* Active chat panel */}
        <div
          className={`flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-white ${!mobileShowChat ? "hidden md:flex" : "flex"
            }`}
        >
          {activeThread ? (
            <>
              {/* Chat header */}
              <div className="shrink-0 h-14 border-b border-slate-200 px-5 flex items-center justify-between bg-white">
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

              {/* Messages */}
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

              {/* Input bar */}
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
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center bg-slate-50/30">
              <div className="h-20 w-20 rounded-3xl bg-white border border-slate-200 grid place-items-center shadow-xl shadow-slate-100/50">
                <MessageSquare className="h-9 w-9 text-rose-500" />
              </div>
              <div className="max-w-xs space-y-2">
                <h3 className="font-semibold text-sm text-slate-800">Your Chat Center</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select a contact from the left list to load the conversation history.
                </p>
              </div>

              {!loading && threads.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {threads.slice(0, 5).map((t) => (
                    <button
                      key={`${t.userRole}-${t.userId}`}
                      onClick={() => handleSelectThread(t.userId, t.userRole)}
                      className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-rose-400 hover:shadow-sm transition-all cursor-pointer"
                    >
                      <div
                        className={`h-5 w-5 rounded-full ${avatarBg(t.userName)} text-white font-semibold text-[9px] flex items-center justify-center`}
                      >
                        {getInitials(t.userName)}
                      </div>
                      {t.userName.split(" ")[0]}
                      {t.unread && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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

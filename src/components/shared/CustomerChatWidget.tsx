import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useChat } from "@/hooks/useChat";
import { useCustomerChatUsers } from "@/hooks/public/useCustomerChatUsers";
import { useCustomer, getCustomerId } from "@/hooks/public/useCustomerAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Send,
  Clock,
  CheckCheck,
  Search,
  ArrowLeft,
  X,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ROLE_CONFIG = {
  ADMIN: { label: "Admin", style: "bg-red-50 text-red-700 border-red-200" },
  DEALER: { label: "Dealer", style: "bg-blue-50 text-blue-700 border-blue-200" },
  CUSTOMER: { label: "Customer", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export default function CustomerChatWidget() {
  const { pathname } = useLocation();
  const customer = useCustomer();
  const customerId = getCustomerId();
  const token = customer?.token ?? localStorage.getItem("customerToken") ?? "";

  // Hide widget on the main full-screen chat page to avoid duplication
  if (pathname === "/chat" || !customer) return null;

  return <ChatWidgetContent customerId={customerId} token={token} />;
}

function ChatWidgetContent({ customerId, token }: { customerId: string | null; token: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: users = [], isLoading, refetch } = useCustomerChatUsers();

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
  }, [activeThread?.messages, isTyping, isOpen, activeUserId]);

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

  const handleBack = () => {
    // Mimic going back to contacts list by setting activeUserId to null
    selectThread(0, "ADMIN"); // Pass dummy values which don't trigger anything since it's just going back
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
    <>
      {/* FLOATING TOGGLE BUTTON */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          refetch();
        }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-tr from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all cursor-pointer border border-rose-500/20"
        title="Open Chats"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        {!isOpen && totalUnreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 h-6 min-w-6 px-1.5 rounded-full bg-rose-500 text-xs font-black text-white flex items-center justify-center border-2 border-white shadow-md animate-pulse">
            {totalUnreadCount}
          </span>
        )}
      </button>

      {/* FLOATING CHAT PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-24 right-6 w-92 sm:w-96 h-[500px] z-50 rounded-3xl border border-slate-200 bg-white shadow-2xl flex flex-col overflow-hidden max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] text-slate-800 font-sans"
          >
            {/* Header (Black) */}
            <div className="shrink-0 h-13 flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-black text-white select-none">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {activeThread && (
                  <button
                    onClick={handleBack}
                    className="p-1 rounded-lg hover:bg-white/10 text-white cursor-pointer"
                  >
                    <ArrowLeft className="h-4.5 w-4.5" />
                  </button>
                )}
                <div className="relative">
                  <MessageSquare className="h-4 w-4 text-white/70" />
                  {totalUnreadCount > 0 && !activeUserId && (
                    <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-rose-500 text-[8px] font-black text-white flex items-center justify-center">
                      {totalUnreadCount}
                    </span>
                  )}
                </div>
                <span className="font-semibold text-xs text-white tracking-tight truncate capitalize">
                  {activeThread ? activeThread.userName : "Customer Support"}
                  {!activeUserId && totalUnreadCount > 0 && (
                    <span className="text-rose-500 font-bold ml-1 font-sans">({totalUnreadCount})</span>
                  )}
                </span>
                {activeThread && (
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isOnline ? "bg-emerald-400" : "bg-slate-500"}`} />
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Sliding Content Screens */}
            <div className="flex-1 flex overflow-hidden relative bg-slate-50/20">
              <AnimatePresence mode="wait">
                {!activeUserId || !activeThread ? (
                  /* SCREEN 1: LIST OF CHATS */
                  <motion.div
                    key="list-screen"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    className="absolute inset-0 flex flex-col overflow-hidden"
                  >
                    {/* Search bar */}
                    <div className="p-3 border-b border-slate-100 bg-white/50">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                          placeholder="Search chats..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 h-9 rounded-xl text-[11px] bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 shadow-none focus-visible:ring-1 focus-visible:ring-rose-500/50"
                        />
                      </div>
                    </div>

                    {/* Contact items */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-chat-scrollbar">
                      {isLoading && (
                        <div className="space-y-2.5 p-1">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />
                          ))}
                        </div>
                      )}

                      {!isLoading && filteredThreads.length === 0 && (
                        <div className="text-center py-16 space-y-2.5">
                          <MessageSquare className="h-7 w-7 text-slate-200 mx-auto" />
                          <p className="text-xs text-slate-400">No active discussions</p>
                        </div>
                      )}

                      {filteredThreads.map((t) => {
                        const unreadMsgCount = t.messages.filter(m => m.sender === "other" && !m.isRead).length || (t.unread ? 1 : 0);
                        return (
                          <button
                            key={`${t.userRole}-${t.userId}`}
                            onClick={() => selectThread(t.userId, t.userRole)}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl text-left bg-white border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer shadow-sm shadow-slate-100/10"
                          >
                            <div className="shrink-0">
                              <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs text-white ${avatarBg(t.userName)}`}>
                                {getInitials(t.userName)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <h4 className="font-bold text-xs text-slate-800 truncate capitalize">{t.userName}</h4>
                                  <span className={`text-[8px] font-semibold px-1 py-0.5 rounded border shrink-0 ${ROLE_CONFIG[t.userRole]?.style}`}>
                                    {ROLE_CONFIG[t.userRole]?.label}
                                  </span>
                                </div>
                                <div className="flex flex-col items-end gap-0.5 shrink-0">
                                  <span className="text-[9px] text-slate-400 font-medium">{t.lastTime}</span>
                                  {unreadMsgCount > 0 && (
                                    <span className="h-4 min-w-4 px-1 rounded-full bg-rose-500 text-[8px] font-black text-white flex items-center justify-center shadow-sm">
                                      {unreadMsgCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className={`text-[10px] mt-0.5 truncate ${!t.lastMessage ? "italic text-slate-400" : "text-slate-500"}`}>
                                {t.lastMessage || "No messages yet"}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  /* SCREEN 2: ACTIVE CONVERSATION MESSAGES */
                  <motion.div
                    key="chat-screen"
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 30, opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    className="absolute inset-0 flex flex-col overflow-hidden"
                  >
                    {/* Message list bubble area */}
                    <div
                      ref={messagesContainerRef}
                      className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-slate-50/40 custom-chat-scrollbar"
                    >
                      {isHistoryLoading ? (
                        <div className="space-y-4 animate-pulse">
                          <div className="flex justify-start">
                            <div className="bg-slate-200 h-9 w-2/3 rounded-2xl rounded-tl-none" />
                          </div>
                          <div className="flex justify-end">
                            <div className="bg-slate-300/60 h-9 w-1/2 rounded-2xl rounded-tr-none" />
                          </div>
                          <div className="flex justify-start">
                            <div className="bg-slate-200 h-9 w-1/3 rounded-2xl rounded-tl-none" />
                          </div>
                        </div>
                      ) : (
                        <>
                          {activeThread.messages.length === 0 && (
                            <div className="flex items-center justify-center h-full text-center">
                              <p className="text-[11px] text-slate-400">Say hi to start the conversation!</p>
                            </div>
                          )}

                          <AnimatePresence initial={false}>
                            {activeThread.messages.map((m) => {
                              const isMe = m.sender === "me";
                              return (
                                <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                  <div className="max-w-[75%] space-y-1">
                                    <div
                                      className={`px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${isMe
                                        ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl rounded-tr-none"
                                        : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none"
                                        }`}
                                    >
                                      {m.text}
                                    </div>
                                    <div className={`flex items-center gap-1 text-[9px] text-slate-400 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
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
                                </div>
                              );
                            })}

                            {isTyping && (
                              <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-3.5 py-2.5 flex items-center gap-1.5 shadow-sm">
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "120ms" }} />
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "240ms" }} />
                                </div>
                              </div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </div>

                    {/* Send controls container */}
                    <div className="shrink-0 p-3.5 border-t border-slate-100 bg-white">
                      <form onSubmit={handleSend} className="flex items-center gap-2">
                        <Input
                          placeholder="Type message…"
                          value={messageText}
                          onChange={handleInputChange}
                          className="flex-1 h-10 rounded-2xl text-xs bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-rose-500/50 text-slate-800 shadow-none placeholder:text-slate-400"
                        />
                        <Button
                          type="submit"
                          disabled={!messageText.trim()}
                          className="h-10 w-10 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-colors shadow-lg cursor-pointer"
                        >
                          <Send className="h-4.5 w-4.5" />
                        </Button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-chat-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
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
    </>
  );
}

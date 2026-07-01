import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import type { ChatUser } from "@/hooks/dealer/useDealerChatUsers";

export interface Message {
  id: string;
  sender: "me" | "other";
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Thread {
  userId: number;
  userName: string;
  userRole: "ADMIN" | "DEALER" | "CUSTOMER";
  lastMessage: string;
  lastTime: string;
  unread: boolean;
  messages: Message[];
  lastMsgAt?: string;
  originalIndex?: number;
  unreadCount?: number;
}

export interface UseChatParams {
  currentUserId: number;
  currentUserRole: "ADMIN" | "DEALER" | "CUSTOMER";
  token: string;
  users: ChatUser[];
}

function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return isoString;
  }
}

function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function useChat({ currentUserId, currentUserRole, token, users }: UseChatParams) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [activeUserRole, setActiveUserRole] = useState<"ADMIN" | "DEALER" | "CUSTOMER" | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const stompClientRef = useRef<Client | null>(null);
  const activeUserIdRef = useRef<number | null>(null);
  const activeUserRoleRef = useRef<"ADMIN" | "DEALER" | "CUSTOMER" | null>(null);

  // Sync refs to avoid stale closures in stomp subscriptions
  useEffect(() => {
    activeUserIdRef.current = activeUserId;
    activeUserRoleRef.current = activeUserRole;
  }, [activeUserId, activeUserRole]);

  // Sync users list with local threads list
  useEffect(() => {
    if (!users.length) return;

    setThreads((prev) => {
      const existing = new Map(prev.map((t) => [`${t.userRole}_${t.userId}`, t]));
      return users.map((u, index) => {
        const key = `${u.role}_${u.id}`;
        if (existing.has(key)) {
          const t = existing.get(key)!;
          return { 
            ...t, 
            originalIndex: index, 
            unreadCount: u.unreadCount ?? t.unreadCount,
            unread: (u.unreadCount ?? 0) > 0 || t.unread 
          };
        }
        return {
          userId: u.id,
          userName: u.name,
          userRole: u.role,
          lastMessage: u.lastMessage || "",
          lastTime: u.lastMessageAt ? formatTime(u.lastMessageAt) : "",
          unread: (u.unreadCount ?? 0) > 0,
          messages: [],
          lastMsgAt: u.lastMessageAt || "",
          originalIndex: index,
          unreadCount: u.unreadCount ?? 0,
        };
      });
    });
  }, [users]);

  const handleAuthError = useCallback((err: any) => {
    if (err.response && err.response.status === 401) {
      if (currentUserRole === "CUSTOMER") {
        window.dispatchEvent(new CustomEvent("customer-session-expired"));
      } else {
        window.dispatchEvent(
          new CustomEvent("auth-session-expired", {
            detail: { role: currentUserRole.toLowerCase() },
          })
        );
      }
    }
  }, [currentUserRole]);

  // REST: Fetch Total Unread Count
  const fetchTotalUnreadCount = useCallback(async (isBackground = false) => {
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/unread-count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTotalUnreadCount(Number(data || 0));
    } catch (err) {
      console.error("Error fetching unread count:", err);
      if (!isBackground) {
        handleAuthError(err);
      }
    }
  }, [token, handleAuthError]);

  // Load unread count on mount/token update
  useEffect(() => {
    fetchTotalUnreadCount();
  }, [fetchTotalUnreadCount]);

  // REST: Fetch history
  const fetchHistory = useCallback(async (user2Id: number, user2Role: string, isBackground = false) => {
    if (!token) return;
    if (!isBackground) {
      setIsHistoryLoading(true);
    }
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/history`,
        {
          params: { user2Id, user2Role },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (Array.isArray(data)) {
        const formattedMessages: Message[] = data.map((msg: any) => ({
          id: String(msg.id),
          sender:
            msg.senderId === currentUserId && msg.senderRole === currentUserRole
              ? "me"
              : "other",
          text: msg.content,
          timestamp: formatTime(msg.sentAt),
          isRead: msg.isRead,
        }));

        const lastMsgTime = data[data.length - 1]?.sentAt;

        setThreads((prev) =>
          prev.map((t) =>
            t.userId === user2Id && t.userRole === user2Role
              ? {
                ...t,
                messages: formattedMessages,
                lastMessage: formattedMessages[formattedMessages.length - 1]?.text ?? t.lastMessage,
                lastTime: formattedMessages[formattedMessages.length - 1]?.timestamp ?? t.lastTime,
                lastMsgAt: lastMsgTime ?? t.lastMsgAt,
              }
              : t
          )
        );
      }
    } catch (err) {
      console.error("Error fetching chat history:", err);
      if (!isBackground) {
        handleAuthError(err);
      }
    } finally {
      if (!isBackground) {
        setIsHistoryLoading(false);
      }
    }
  }, [currentUserId, currentUserRole, token, handleAuthError]);

  // REST: Mark as seen
  const markAsSeen = useCallback(async (user2Id: number, user2Role: string) => {
    if (!token) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/seen`,
        null,
        {
          params: { user2Id, user2Role },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setThreads((prev) =>
        prev.map((t) =>
          t.userId === user2Id && t.userRole === user2Role ? { ...t, unread: false, unreadCount: 0 } : t
        )
      );
      fetchTotalUnreadCount();
    } catch (err) {
      console.error("Error marking messages as seen:", err);
      handleAuthError(err);
    }
  }, [token, fetchTotalUnreadCount, handleAuthError]);

  // REST: Check online status
  const checkOnlineStatus = useCallback(async (userId: number, role: string, isBackground = false) => {
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/online`,
        {
          params: { userId, role },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsOnline(!!data);
    } catch (err) {
      console.error("Error checking online status:", err);
      setIsOnline(false);
      if (!isBackground) {
        handleAuthError(err);
      }
    }
  }, [token, handleAuthError]);

  // Set active thread and run initial load processes
  const selectThread = useCallback((userId: number, userRole: "ADMIN" | "DEALER" | "CUSTOMER") => {
    setActiveUserId(userId);
    setActiveUserRole(userRole);
    markAsSeen(userId, userRole);
    fetchHistory(userId, userRole);
    checkOnlineStatus(userId, userRole);
  }, [markAsSeen, fetchHistory, checkOnlineStatus]);

  // Poll online status for the active user every 10 seconds
  useEffect(() => {
    if (activeUserId === null || activeUserRole === null) return;

    checkOnlineStatus(activeUserId, activeUserRole, true);
    const interval = setInterval(() => {
      checkOnlineStatus(activeUserId, activeUserRole, true);
    }, 10000);

    return () => clearInterval(interval);
  }, [activeUserId, activeUserRole, checkOnlineStatus]);

  // Poll message history for the active user every 5 seconds to get updated seen ticks (isRead)
  useEffect(() => {
    if (activeUserId === null || activeUserRole === null) return;

    const interval = setInterval(() => {
      fetchHistory(activeUserId, activeUserRole, true);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeUserId, activeUserRole, fetchHistory]);

  // Poll total unread count every 10 seconds
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      fetchTotalUnreadCount(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [token, fetchTotalUnreadCount]);

  // STOMP connection logic using SockJS factory
  useEffect(() => {
    if (!token || !currentUserId || !currentUserRole) return;

    // Intercept XMLHttpRequest to inject the Authorization header for SockJS calls to /chat
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (
      this: XMLHttpRequest & { _url?: string },
      method: string,
      url: string,
      ...args: any[]
    ) {
      this._url = url;
      return originalOpen.apply(this, [method, url, ...args] as any);
    } as any;

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (
      this: XMLHttpRequest & { _url?: string },
      body: any
    ) {
      if (
        this._url &&
        this._url.indexOf("/chat") !== -1 &&
        this._url.indexOf("/api/") === -1
      ) {
        this.setRequestHeader("Authorization", `Bearer ${token}`);
      }
      return originalSend.apply(this, [body]);
    };

    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
    const socketUrl = `${baseUrl}/chat`;

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log(str);
      },
    });

    client.onConnect = () => {
      setIsConnected(true);

      // Subscribe to messages
      const userQueue = `/queue/${currentUserRole}_${currentUserId}`;
      client.subscribe(userQueue, (message) => {
        try {
          const msg = JSON.parse(message.body);
          const formatted: Message = {
            id: msg.id ? String(msg.id) : `msg-${Date.now()}`,
            sender:
              msg.senderId === currentUserId && msg.senderRole === currentUserRole
                ? "me"
                : "other",
            text: msg.content,
            timestamp: formatTime(msg.sentAt || new Date().toISOString()),
            isRead: msg.isRead || false,
          };

          const senderId = msg.senderId;
          const senderRole = msg.senderRole;

          const lastMsgTime = msg.sentAt || new Date().toISOString();

          setThreads((prev) =>
            prev.map((t) => {
              if (t.userId === senderId && t.userRole === senderRole) {
                const isCurrentActive =
                  activeUserIdRef.current === senderId &&
                  activeUserRoleRef.current === senderRole;

                if (isCurrentActive) {
                  markAsSeen(senderId, senderRole);
                }

                return {
                  ...t,
                  messages: [...t.messages, formatted],
                  lastMessage: formatted.text,
                  lastTime: formatted.timestamp,
                  unread: !isCurrentActive,
                  lastMsgAt: lastMsgTime,
                  unreadCount: isCurrentActive ? 0 : (t.unreadCount ?? 0) + 1,
                };
              }
              return t;
            })
          );

          // Refresh unread counts
          fetchTotalUnreadCount();
        } catch (err) {
          console.error("Error processing incoming message:", err);
        }
      });

      // Subscribe to typing status
      const typingQueue = `/queue/${currentUserRole}_${currentUserId}_typing`;
      client.subscribe(typingQueue, (message) => {
        try {
          const status = JSON.parse(message.body);
          const senderId = status.senderId;
          const senderRole = status.senderRole;

          if (
            activeUserIdRef.current === senderId &&
            activeUserRoleRef.current === senderRole
          ) {
            setIsTyping(!!status.typing);
          }
        } catch (err) {
          console.error("Error processing typing status:", err);
        }
      });
    };

    client.onDisconnect = () => {
      setIsConnected(false);
    };

    client.onWebSocketClose = () => {
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame);
      setIsConnected(false);
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      // Restore original XMLHttpRequest methods on unmount
      XMLHttpRequest.prototype.open = originalOpen;
      XMLHttpRequest.prototype.send = originalSend;
    };
  }, [currentUserId, currentUserRole, token, markAsSeen, fetchTotalUnreadCount]);

  // STOMP: Send Message
  const sendMessage = useCallback((content: string) => {
    if (!stompClientRef.current || !isConnected || activeUserId === null || activeUserRole === null) {
      console.error("Cannot send message: STOMP client is not connected");
      return;
    }

    const payload = {
      receiverId: activeUserId,
      receiverRole: activeUserRole,
      content,
    };

    stompClientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(payload),
    });

    // Optimistically update the UI
    const formatted: Message = {
      id: `msg-sent-${Date.now()}`,
      sender: "me",
      text: content,
      timestamp: nowTime(),
      isRead: false,
    };

    const lastMsgTime = new Date().toISOString();

    setThreads((prev) =>
      prev.map((t) =>
        t.userId === activeUserId && t.userRole === activeUserRole
          ? {
            ...t,
            messages: [...t.messages, formatted],
            lastMessage: content,
            lastTime: formatted.timestamp,
            lastMsgAt: lastMsgTime,
          }
          : t
      )
    );
  }, [activeUserId, activeUserRole, isConnected]);

  // STOMP: Send Typing Status
  const sendTypingStatus = useCallback((typing: boolean) => {
    if (!stompClientRef.current || !isConnected || activeUserId === null || activeUserRole === null) {
      return;
    }

    const payload = {
      senderId: currentUserId,
      senderRole: currentUserRole,
      receiverId: activeUserId,
      receiverRole: activeUserRole,
      typing,
    };

    stompClientRef.current.publish({
      destination: "/app/chat.typing",
      body: JSON.stringify(payload),
    });
  }, [currentUserId, currentUserRole, activeUserId, activeUserRole, isConnected]);

  const sortedThreads = useMemo(() => {
    return [...threads].sort((a, b) => {
      const timeA = a.lastMsgAt ? new Date(a.lastMsgAt).getTime() : 0;
      const timeB = b.lastMsgAt ? new Date(b.lastMsgAt).getTime() : 0;
      if (timeA !== timeB) {
        return timeB - timeA;
      }
      return a.userName.localeCompare(b.userName);
    });
  }, [threads]);

  return {
    threads: sortedThreads,
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
  };
}

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface ChatUser {
  id: number;
  name: string;
  role: "ADMIN" | "DEALER" | "CUSTOMER";
  lastMessageAt?: string;
  lastMessage?: string;
  unreadCount?: number;
}

function getCleanToken(key: string): string {
  const token = localStorage.getItem(key);
  if (!token) return "";
  return token.replace(/^"(.*)"$/, "$1").trim();
}

/**
 * Fetch chat users using the Dealer's token from localStorage ("dealerToken").
 * Used only in the Dealer dashboard chat page.
 */
export function useDealerChatUsers() {
  return useQuery<ChatUser[], Error>({
    queryKey: ["dealer-chat-users"],
    queryFn: async () => {
      const token = getCleanToken("dealerToken");
      if (!token) return [];

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // The API returns a flat array; normalise and return all users
        const list: ChatUser[] = Array.isArray(data) ? data : data?.data ?? [];
        return list;
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          window.dispatchEvent(
            new CustomEvent("auth-session-expired", {
              detail: { role: "dealer" },
            })
          );
        }
        throw err;
      }
    },
    staleTime: 30_000,
    retry: 1,
  });
}

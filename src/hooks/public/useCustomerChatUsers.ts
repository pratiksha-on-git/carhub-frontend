import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ChatUser } from "@/hooks/dealer/useDealerChatUsers";

function getCleanToken(key: string): string {
  const token = localStorage.getItem(key);
  if (!token) return "";
  return token.replace(/^"(.*)"$/, "$1").trim();
}

/**
 * Fetch chat users using the Customer's token from localStorage ("customerToken").
 * Used in the Customer dashboard chat page.
 */
export function useCustomerChatUsers() {
  return useQuery<ChatUser[], Error>({
    queryKey: ["customer-chat-users"],
    queryFn: async () => {
      const token = getCleanToken("customerToken");
      if (!token) return [];

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
    },
    staleTime: 30_000,
    retry: 1,
  });
}

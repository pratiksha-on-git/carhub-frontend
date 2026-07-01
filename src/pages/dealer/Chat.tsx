import ChatView from "@/components/shared/ChatView";
import { useDealerChatUsers } from "@/hooks/dealer/useDealerChatUsers";
import { useDealerAuth } from "@/contexts/DealerAuthContext";

export default function DealerChat() {
  const { data = [], isLoading, error, refetch } = useDealerChatUsers();
  const { user } = useDealerAuth();
  const token = localStorage.getItem("dealerToken") ?? "";

  return (
    <ChatView
      currentUserId={Number(user?.id ?? 0)}
      currentUserRole="DEALER"
      token={token}
      users={data}
      loading={isLoading}
      error={error?.message ?? null}
      onRefresh={() => refetch()}
      label="All Chats"
    />
  );
}

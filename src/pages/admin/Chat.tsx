import ChatView from "@/components/shared/ChatView";
import { useAdminChatUsers } from "@/hooks/admin/useAdminChatUsers";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function AdminChat() {
  const { data = [], isLoading, error, refetch } = useAdminChatUsers();
  const { user } = useAdminAuth();
  const token = localStorage.getItem("adminToken") ?? "";

  return (
    <ChatView
      currentUserId={Number(user?.id ?? 0)}
      currentUserRole="ADMIN"
      token={token}
      users={data}
      loading={isLoading}
      error={error?.message ?? null}
      onRefresh={() => refetch()}
      label="All Chats"
    />
  );
}

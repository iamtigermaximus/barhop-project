// src/app/app/chat/[crawlId]/page.tsx
import Chatroom from "@/components/app/chat/Chatroom";

interface PageProps {
  params: Promise<{ crawlId: string }>;
}

export default async function ChatroomPage({ params }: PageProps) {
  const { crawlId } = await params;

  return (
    <div>
      <Chatroom chatroomId={crawlId} />
    </div>
  );
}

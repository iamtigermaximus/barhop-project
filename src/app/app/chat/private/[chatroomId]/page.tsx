import Chatroom from "@/components/app/chat/Chatroom";

interface PageProps {
  params: Promise<{
    chatroomId: string;
  }>;
}

const PrivateChatPage = async ({ params }: PageProps) => {
  const { chatroomId } = await params;

  // Pass chatroomId as a prop directly
  return <Chatroom chatroomId={chatroomId} />;
};

export default PrivateChatPage;

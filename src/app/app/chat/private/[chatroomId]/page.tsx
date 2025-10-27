import Chatroom from "@/components/app/chat/Chatroom";

interface PageProps {
  params: Promise<{
    chatroomId: string;
  }>;
}

const PrivateChatPage = async ({ params }: PageProps) => {
  const { chatroomId } = await params;

  return <Chatroom />;
};

export default PrivateChatPage;

import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import StatusBar from "@/components/layout/StatusBar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MOCK_USER_ID } from "@/lib/data";

export default function ChatPage() {
  const params = useParams<{ userId: string }>();
  const receiverId = params?.userId ? parseInt(params.userId) : 2; // Default to user 2 (owner)
  
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["/api/messages", MOCK_USER_ID, receiverId],
    refetchInterval: 5000 // Poll for new messages every 5 seconds
  });

  const { data: receiver } = useQuery({
    queryKey: [`/api/users/${receiverId}`],
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/messages", {
        senderId: MOCK_USER_ID,
        receiverId,
        content
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", MOCK_USER_ID, receiverId] });
      setMessage("");
    }
  });

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage.mutate(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StatusBar />
      
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="px-4 py-3 bg-white border-b">
          <div className="flex items-center">
            <Link href="/">
              <a className="p-1 mr-2">
                <ArrowLeft className="h-6 w-6" />
              </a>
            </Link>
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 overflow-hidden">
              <img
                src={receiver?.profileImage || "https://via.placeholder.com/100"}
                alt={receiver?.fullName || "Support Agent"}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-medium">{receiver?.fullName || "Support"}</h2>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
          {isLoading ? (
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="bg-gray-200 rounded-2xl rounded-tr-none py-2 px-4 w-2/3 h-10 animate-pulse"></div>
              </div>
              <div className="flex">
                <div className="bg-gray-200 rounded-2xl rounded-tl-none py-2 px-4 w-2/3 h-10 animate-pulse"></div>
              </div>
              <div className="flex justify-end">
                <div className="bg-gray-200 rounded-2xl rounded-tr-none py-2 px-4 w-2/3 h-10 animate-pulse"></div>
              </div>
            </div>
          ) : messages && messages.length > 0 ? (
            <>
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.senderId === MOCK_USER_ID ? "justify-end" : ""}`}
                >
                  <div className={`rounded-2xl py-2 px-4 max-w-[80%] ${
                    msg.senderId === MOCK_USER_ID 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white rounded-tl-none shadow-sm"
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>
        
        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t">
          <div className="flex items-center">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none"
            />
            <Button 
              type="submit"
              variant="default" 
              size="icon" 
              className="ml-2 rounded-full" 
              disabled={sendMessage.isPending || !message.trim()}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
      
      <HomeIndicator />
    </div>
  );
}


import React, { useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import { Message } from '@/hooks/useChatState';

type ChatMessagesProps = {
  messages: Message[];
  isWaiting: boolean;
};

const ChatMessages = ({ messages, isWaiting }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white">
      {messages.map((message) => (
        <ChatBubble 
          key={message.id}
          message={message.text}
          isUser={message.isUser}
          timestamp={message.timestamp}
        />
      ))}
      
      {isWaiting && (
        <div className="flex items-center gap-1 text-dila-blue mb-4">
          <div className="h-2 w-2 bg-dila-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 bg-dila-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 bg-dila-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;

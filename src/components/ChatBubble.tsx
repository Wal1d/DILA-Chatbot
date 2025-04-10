
import React from 'react';
import { cn } from '@/lib/utils';

type ChatBubbleProps = {
  message: string;
  isUser: boolean;
  timestamp: string;
};

const ChatBubble = ({ message, isUser, timestamp }: ChatBubbleProps) => {
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg p-4 shadow-sm",
        isUser ? "bg-dila-blue text-white rounded-tr-none" : "bg-dila-gray text-dila-dark rounded-tl-none"
      )}>
        <p className="whitespace-pre-wrap break-words">{message}</p>
        <div className={cn(
          "text-xs mt-1",
          isUser ? "text-dila-white text-opacity-80" : "text-dila-dark text-opacity-60"
        )}>
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;

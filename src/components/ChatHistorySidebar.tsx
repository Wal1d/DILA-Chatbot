
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, Trash } from 'lucide-react';
import { Message } from '@/hooks/useChatState';

type ChatHistorySidebarProps = {
  messages: Message[];
  onStartNewConversation: () => void;
  onClearHistory: () => void;
  currentConversationId: string;
  conversations: {id: string, title: string, timestamp: string}[];
  onSelectConversation: (id: string) => void;
};

const ChatHistorySidebar = ({
  onStartNewConversation,
  onClearHistory,
  currentConversationId,
  conversations,
  onSelectConversation
}: ChatHistorySidebarProps) => {
  return (
    <div className="w-[250px] h-full flex flex-col border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-200">
        <Button 
          onClick={onStartNewConversation}
          className="w-full bg-dila-blue hover:bg-dila-blue/90 mb-2 justify-start"
        >
          <MessageSquarePlus className="h-4 w-4 mr-2" /> 
          Nouvelle conversation
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onClearHistory}
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash className="h-4 w-4 mr-2" /> 
          Effacer l'historique
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2">
            {conversations.length > 0 ? (
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`w-full justify-start text-sm h-auto py-2 px-3 whitespace-normal text-left ${
                      currentConversationId === conversation.id
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium truncate">{conversation.title}</div>
                      <div className="text-xs text-gray-500">{conversation.timestamp}</div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="p-3 text-sm text-gray-500 text-center">
                Aucune conversation
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChatHistorySidebar;

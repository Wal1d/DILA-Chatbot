
import React from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatHistorySidebar from './ChatHistorySidebar';
import ChatMessages from './ChatMessages';
import { useChatState } from '@/hooks/useChatState';

const DILAChatbot = () => {
  const {
    conversations,
    currentConversationId,
    currentMessages,
    isWaiting,
    alwaysConfirm,
    handleSendMessage,
    handleReformulate,
    handleClearHistory,
    createNewConversation,
    handleSelectConversation,
    handleToggleConfirmation
  } = useChatState();

  return (
    <div className="flex h-full rounded-lg shadow-md overflow-hidden">
      {/* Chat history sidebar */}
      <ChatHistorySidebar 
        onStartNewConversation={createNewConversation}
        onClearHistory={handleClearHistory}
        currentConversationId={currentConversationId}
        conversations={conversations.map(c => ({
          id: c.id,
          title: c.title,
          timestamp: c.timestamp
        }))}
        onSelectConversation={handleSelectConversation}
        messages={currentMessages}
      />
      
      {/* Main chat area */}
      <div className="flex flex-col border flex-1">
        <ChatHeader 
          onClearHistory={handleClearHistory} 
          onNewConversation={createNewConversation}
          alwaysConfirm={alwaysConfirm}
          onToggleConfirmation={handleToggleConfirmation}
        />
        
        <ChatMessages 
          messages={currentMessages} 
          isWaiting={isWaiting} 
        />
        
        <div className="border-t p-4 bg-gray-50">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            onReformulate={handleReformulate}
            disabled={isWaiting}
            alwaysConfirm={alwaysConfirm}
            isWaiting={isWaiting}
          />
        </div>
      </div>
    </div>
  );
};

export default DILAChatbot;

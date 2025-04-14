
import { useState } from 'react';
import { useChatStorage } from './useChatStorage';
import { useChatActions } from './useChatActions';
import { Message, Conversation } from '@/types/chatTypes';

export type { Message, Conversation };

export function useChatState() {
  const [isWaiting, setIsWaiting] = useState(false);
  
  const {
    conversations,
    setConversations,
    currentConversationId,
    setCurrentConversationId,
    alwaysConfirm,
    setAlwaysConfirm
  } = useChatStorage();

  const {
    createNewConversation: createNewConversationBase,
    handleSendMessage: handleSendMessageBase,
    handleReformulate: handleReformulateBase,
    handleDeleteCurrentConversation,
    handleClearHistory,
    handleSelectConversation,
    handleToggleConfirmation
  } = useChatActions({
    conversations,
    setConversations,
    currentConversationId,
    setCurrentConversationId,
    alwaysConfirm,
    setAlwaysConfirm
  });

  // Get current messages
  const currentMessages = conversations.find(c => c.id === currentConversationId)?.messages || [];

  // Wrap handlers to manage waiting state
  const handleSendMessage = (text: string) => {
    setIsWaiting(true);
    handleSendMessageBase(text);
    
    // Reset waiting state after response delay
    const responseDelay = alwaysConfirm ? 2500 : 1500;
    setTimeout(() => setIsWaiting(false), responseDelay);
  };

  const handleReformulate = () => {
    handleReformulateBase(currentMessages);
  };

  const createNewConversation = () => {
    return createNewConversationBase();
  };

  return {
    conversations,
    currentConversationId,
    currentMessages,
    isWaiting,
    alwaysConfirm,
    handleSendMessage,
    handleReformulate,
    handleClearHistory,
    handleDeleteCurrentConversation,
    createNewConversation,
    handleSelectConversation,
    handleToggleConfirmation
  };
}

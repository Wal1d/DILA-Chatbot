
import { useState, useEffect } from 'react';
import { Conversation } from '@/types/chatTypes';

export const useChatStorage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const [alwaysConfirm, setAlwaysConfirm] = useState(true);

  // Load conversations from localStorage on component mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('dila-chat-conversations');
    const savedSettings = localStorage.getItem('dila-chat-settings');
    
    // Load settings
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (typeof settings.alwaysConfirm === 'boolean') {
          setAlwaysConfirm(settings.alwaysConfirm);
        }
      } catch (error) {
        console.error('Failed to parse saved settings', error);
      }
    }

    // Load conversations
    if (savedConversations) {
      try {
        const loadedConversations = JSON.parse(savedConversations);
        // Filter out conversations with only the welcome message or no user messages
        const validConversations = loadedConversations.filter(
          (conv: Conversation) => conv.messages.some((m) => m.isUser)
        );
        
        setConversations(validConversations);
        
        // Set current conversation to the most recent one
        if (validConversations.length > 0) {
          setCurrentConversationId(validConversations[0].id);
        }
      } catch (error) {
        console.error('Failed to parse saved conversations', error);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      // Filter out conversations with only the welcome message before saving
      const validConversations = conversations.filter(
        conv => conv.messages.some(m => m.isUser)
      );
      
      localStorage.setItem('dila-chat-conversations', JSON.stringify(validConversations));
    }
  }, [conversations]);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('dila-chat-settings', JSON.stringify({
      alwaysConfirm
    }));
  }, [alwaysConfirm]);

  return {
    conversations,
    setConversations,
    currentConversationId,
    setCurrentConversationId,
    alwaysConfirm,
    setAlwaysConfirm
  };
};


import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import ChatHeader from './ChatHeader';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import ChatHistorySidebar from './ChatHistorySidebar';

export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  timestamp: string;
};

const DILAChatbot = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [alwaysConfirm, setAlwaysConfirm] = useState(true);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current messages
  const currentMessages = conversations.find(c => c.id === currentConversationId)?.messages || [];

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
        setConversations(loadedConversations);
        
        // Set current conversation to the most recent one
        if (loadedConversations.length > 0) {
          setCurrentConversationId(loadedConversations[0].id);
        } else {
          createNewConversation();
        }
      } catch (error) {
        console.error('Failed to parse saved conversations', error);
        createNewConversation();
      }
    } else {
      createNewConversation();
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('dila-chat-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('dila-chat-settings', JSON.stringify({
      alwaysConfirm
    }));
  }, [alwaysConfirm]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const createNewConversation = () => {
    const newId = Date.now().toString();
    const newConversation: Conversation = {
      id: newId,
      title: "Nouvelle conversation",
      messages: [{
        id: 'welcome-' + newId,
        text: "Bonjour, je suis l'assistant virtuel de la DILA. Comment puis-je vous aider avec vos questions légales et administratives aujourd'hui ?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      }],
      timestamp: new Date().toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit',
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    
    toast({
      title: "Nouvelle conversation",
      description: "Une nouvelle conversation a été démarrée.",
    });
  };

  const updateConversationTitle = (id: string, firstMessage: string) => {
    // Create a title from the first user message (max 30 chars)
    const title = firstMessage.length > 30 
      ? firstMessage.substring(0, 30) + '...' 
      : firstMessage;
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { ...conv, title } 
          : conv
      )
    );
  };

  const handleSendMessage = (text: string) => {
    // If there's no current conversation, create one
    if (!currentConversationId) {
      createNewConversation();
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    
    // Add message to current conversation
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === currentConversationId) {
          const updatedMessages = [...conv.messages, newUserMessage];
          
          // If this is the first user message, update the conversation title
          if (!conv.messages.some(m => m.isUser)) {
            updateConversationTitle(currentConversationId, text);
          }
          
          return {
            ...conv,
            messages: updatedMessages,
            timestamp: new Date().toLocaleDateString('fr-FR', { 
              day: '2-digit', 
              month: '2-digit',
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          };
        }
        return conv;
      })
    );

    setIsWaiting(true);

    // Simulate response (in a real app, this would be an API call)
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      
      setConversations(prev => 
        prev.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, newBotMessage]
            };
          }
          return conv;
        })
      );
      
      setIsWaiting(false);
    }, 1000);
  };

  const handleReformulate = () => {
    if (!currentConversationId || currentMessages.length === 0) {
      toast({
        title: "Aucune question à reformuler",
        description: "Vous devez d'abord poser une question.",
      });
      return;
    }

    // Find the last user message in current conversation
    const lastUserMessageIndex = [...currentMessages].reverse().findIndex(m => m.isUser);
    
    if (lastUserMessageIndex === -1) {
      toast({
        title: "Aucune question à reformuler",
        description: "Vous devez d'abord poser une question.",
      });
      return;
    }

    const lastUserMessage = [...currentMessages].reverse()[lastUserMessageIndex];
    const reformulatedText = `Pouvez-vous reformuler autrement : "${lastUserMessage.text}"`;
    
    handleSendMessage(reformulatedText);
  };

  const handleClearHistory = () => {
    setConversations([]);
    localStorage.removeItem('dila-chat-conversations');
    
    createNewConversation();
    
    toast({
      title: "Historique effacé",
      description: "L'historique de conversation a été supprimé.",
    });
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleToggleConfirmation = () => {
    setAlwaysConfirm(prev => !prev);
    toast({
      title: alwaysConfirm ? "Confirmation désactivée" : "Confirmation activée",
      description: alwaysConfirm 
        ? "Vos messages seront envoyés directement." 
        : "Vos messages seront confirmés avant d'être envoyés.",
    });
  };

  // Simulated bot response - in a real app, this would be replaced by an API call
  const getBotResponse = (userMessage: string): string => {
    if (userMessage.toLowerCase().includes('bonjour') || userMessage.toLowerCase().includes('salut')) {
      return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
    }
    
    if (userMessage.toLowerCase().includes('merci')) {
      return "Je vous en prie. Y a-t-il autre chose que je peux faire pour vous ?";
    }
    
    if (userMessage.toLowerCase().includes('carte d\'identité') || userMessage.toLowerCase().includes('passeport')) {
      return "Pour les questions concernant les cartes d'identité et les passeports, je vous invite à consulter le site service-public.fr ou à contacter votre mairie. Vous avez besoin de formulaires spécifiques et de pièces justificatives.";
    }
    
    if (userMessage.toLowerCase().includes('impôt') || userMessage.toLowerCase().includes('taxe')) {
      return "Pour les questions fiscales, je vous recommande de consulter le site impots.gouv.fr ou de contacter votre centre des finances publiques local. Vous pourrez y trouver des informations sur les déclarations, les paiements et les déductions fiscales.";
    }
    
    if (userMessage.toLowerCase().includes('reformuler')) {
      return "Je vais essayer de reformuler votre demande. Pourriez-vous me préciser quel aspect vous souhaitez que je reformule ?";
    }

    return "Merci pour votre question. Pour obtenir des informations précises sur ce sujet, je vous invite à consulter le site service-public.fr ou à contacter directement le service administratif concerné. Avez-vous besoin d'autres renseignements ?";
  };

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
        
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {currentMessages.map((message) => (
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
        
        <div className="border-t p-4 bg-gray-50">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            onReformulate={handleReformulate}
            disabled={isWaiting}
            alwaysConfirm={alwaysConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default DILAChatbot;

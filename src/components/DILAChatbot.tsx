
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import ChatHeader from './ChatHeader';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
};

const DILAChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('dila-chat-messages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Failed to parse saved messages', error);
      }
    } else {
      // Add welcome message if no saved messages
      const welcomeMessage: Message = {
        id: 'welcome',
        text: "Bonjour, je suis l'assistant virtuel de la DILA. Comment puis-je vous aider avec vos questions légales et administratives aujourd'hui ?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('dila-chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
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
      
      setMessages(prev => [...prev, newBotMessage]);
      setIsWaiting(false);
    }, 1000);
  };

  const handleReformulate = () => {
    // Find the last user message
    const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.isUser);
    
    if (lastUserMessageIndex === -1) {
      toast({
        title: "Aucune question à reformuler",
        description: "Vous devez d'abord poser une question.",
      });
      return;
    }

    const lastUserMessage = [...messages].reverse()[lastUserMessageIndex];
    const reformulatedText = `Pouvez-vous reformuler autrement : "${lastUserMessage.text}"`;
    
    handleSendMessage(reformulatedText);
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem('dila-chat-messages');
    
    // Add welcome message again
    const welcomeMessage: Message = {
      id: 'welcome-new',
      text: "Bonjour, je suis l'assistant virtuel de la DILA. Comment puis-je vous aider avec vos questions légales et administratives aujourd'hui ?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([welcomeMessage]);
    
    toast({
      title: "Historique effacé",
      description: "L'historique de conversation a été supprimé.",
    });
  };

  const handleNewConversation = () => {
    // Save the current conversation if needed
    
    // Start a new conversation
    setMessages([]);
    localStorage.removeItem('dila-chat-messages');
    
    // Add welcome message for new conversation
    const welcomeMessage: Message = {
      id: 'welcome-new-conversation',
      text: "Bonjour, comment puis-je vous aider aujourd'hui ?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([welcomeMessage]);
    
    toast({
      title: "Nouvelle conversation",
      description: "Une nouvelle conversation a été démarrée.",
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
    <div className="flex flex-col border rounded-lg shadow-md h-full max-h-[600px]">
      <ChatHeader 
        onClearHistory={handleClearHistory} 
        onNewConversation={handleNewConversation} 
      />
      
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
      
      <div className="border-t p-4 bg-gray-50">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          onReformulate={handleReformulate}
          disabled={isWaiting}
        />
      </div>
    </div>
  );
};

export default DILAChatbot;

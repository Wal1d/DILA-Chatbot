import { useToast } from '@/hooks/use-toast';
import { getBotResponse } from '@/utils/botResponseUtils';
import { Message, Conversation } from '@/types/chatTypes';

type UseChatActionsProps = {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  currentConversationId: string;
  setCurrentConversationId: React.Dispatch<React.SetStateAction<string>>;
  alwaysConfirm: boolean;
  setAlwaysConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useChatActions = ({
  conversations,
  setConversations,
  currentConversationId,
  setCurrentConversationId,
  alwaysConfirm,
  setAlwaysConfirm
}: UseChatActionsProps) => {
  const { toast } = useToast();
  
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
    
    return newId;
  };

  const handleSendMessage = (text: string) => {
    // If there's no current conversation, create one
    if (!currentConversationId) {
      const newId = createNewConversation();
      setCurrentConversationId(newId);
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
          
          // If this is the first user message, update the conversation title immediately
          const isFirstUserMessage = !conv.messages.some(m => m.isUser);
          const updatedTitle = isFirstUserMessage ? text : conv.title;
          
          return {
            ...conv,
            title: updatedTitle.length > 30 ? updatedTitle.substring(0, 30) + '...' : updatedTitle,
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

    // For reformulation mode, add a delay before starting the response
    const responseDelay = alwaysConfirm ? 2000 : 1000;

    // Simulate response (in a real app, this would be an API call)
    setTimeout(() => {
      // If reformulation is enabled, generate a reformulated version
      const botResponse = alwaysConfirm 
        ? `Reformulation: ${text}\n\n${getBotResponse(text)}`
        : getBotResponse(text);

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
    }, responseDelay);
  };

  const handleReformulate = (currentMessages: Message[]) => {
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

  const handleDeleteCurrentConversation = () => {
    // Remove the current conversation from the array
    setConversations(prev => prev.filter(conv => conv.id !== currentConversationId));
    
    // If there are remaining conversations, select the first one
    // Otherwise, create a new conversation
    setTimeout(() => {
      if (conversations.length > 1) {
        // Find the next available conversation (that isn't the current one)
        const nextConversation = conversations.find(conv => conv.id !== currentConversationId);
        if (nextConversation) {
          setCurrentConversationId(nextConversation.id);
        } else {
          createNewConversation();
        }
      } else {
        createNewConversation();
      }
    }, 0);

    toast({
      title: "Conversation effacée",
      description: "La conversation actuelle a été supprimée.",
    });
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
      title: alwaysConfirm ? "Reformulation désactivée" : "Reformulation activée",
      description: alwaysConfirm 
        ? "Vos messages seront envoyés directement." 
        : "Vos questions seront reformulées automatiquement.",
    });
  };

  return {
    createNewConversation,
    handleSendMessage,
    handleReformulate,
    handleDeleteCurrentConversation,
    handleClearHistory,
    handleSelectConversation,
    handleToggleConfirmation,
  };
};

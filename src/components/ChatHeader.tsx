
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Eraser, MessageSquarePlus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type ChatHeaderProps = {
  onClearHistory: () => void;
  onNewConversation: () => void;
  alwaysConfirm?: boolean;
  onToggleConfirmation?: () => void;
};

const ChatHeader = ({ 
  onClearHistory, 
  onNewConversation, 
  alwaysConfirm = true,
  onToggleConfirmation 
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white border-b">
      <div className="text-sm font-medium">Assistant DILA</div>
      <div className="flex items-center space-x-2">
        {onToggleConfirmation && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 mr-3">
                <span className="text-xs text-gray-500">Confirmer les questions</span>
                <Switch 
                  checked={alwaysConfirm} 
                  onCheckedChange={onToggleConfirmation}
                  className="data-[state=checked]:bg-dila-blue"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {alwaysConfirm 
                ? "Vos questions seront confirmées avant envoi" 
                : "Vos questions seront envoyées directement"}
            </TooltipContent>
          </Tooltip>
        )}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onNewConversation}
              className="h-8 w-8 p-0"
            >
              <MessageSquarePlus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Nouvelle conversation</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearHistory}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Eraser className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Effacer l'historique</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ChatHeader;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw } from 'lucide-react';

type ChatHeaderProps = {
  onClearHistory: () => void;
  onNewConversation: () => void;
};

const ChatHeader = ({ onClearHistory, onNewConversation }: ChatHeaderProps) => {
  return (
    <div className="flex justify-between items-center bg-dila-blue text-white p-4 rounded-t-lg">
      <div className="flex items-center gap-2">
        <img 
          src="https://www.dila.premier-ministre.gouv.fr/IMG/site_logo.png?1622756075" 
          alt="DILA Logo" 
          className="h-8"
          onError={(e) => {
            e.currentTarget.src = "https://www.vie-publique.fr/sites/all/themes/custom/vp/img/layout/logo.svg";
          }}
        />
        <h2 className="font-bold">Assistant DILA</h2>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearHistory}
          className="hover:bg-dila-blue/80"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Effacer
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onNewConversation}
          className="hover:bg-dila-blue/80"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Nouvelle conversation
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;

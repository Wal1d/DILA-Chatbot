
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, RotateCcw, Loader } from 'lucide-react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  onReformulate: () => void;
  disabled?: boolean;
  alwaysConfirm?: boolean;
  isWaiting?: boolean;
};

const ChatInput = ({ 
  onSendMessage, 
  onReformulate, 
  disabled = false, 
  alwaysConfirm = true,
  isWaiting = false 
}: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question..."
          className="flex-1 focus-visible:ring-dila-blue"
          disabled={disabled || isWaiting}
        />
        <Button 
          type="button" 
          variant="outline"
          onClick={onReformulate}
          disabled={disabled || isWaiting}
          title="Reformuler la dernière question"
          className="bg-white hover:bg-dila-gray"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button 
          type="submit" 
          disabled={!input.trim() || disabled || isWaiting}
          className="bg-dila-blue hover:bg-dila-blue/90"
        >
          {isWaiting && alwaysConfirm ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;

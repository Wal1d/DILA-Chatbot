
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, RotateCcw } from 'lucide-react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  onReformulate: () => void;
  disabled?: boolean;
};

const ChatInput = ({ onSendMessage, onReformulate, disabled = false }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Posez votre question..."
        className="flex-1 focus-visible:ring-dila-blue"
        disabled={disabled}
      />
      <Button 
        type="button" 
        variant="outline"
        onClick={onReformulate}
        disabled={disabled}
        title="Reformuler la dernière question"
        className="bg-white hover:bg-dila-gray"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button 
        type="submit" 
        disabled={!input.trim() || disabled}
        className="bg-dila-blue hover:bg-dila-blue/90"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;

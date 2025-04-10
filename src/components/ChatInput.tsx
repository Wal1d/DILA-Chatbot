
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, RotateCcw, Check, X } from 'lucide-react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  onReformulate: () => void;
  disabled?: boolean;
};

const ChatInput = ({ onSendMessage, onReformulate, disabled = false }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [confirmMode, setConfirmMode] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      if (confirmMode) {
        onSendMessage(pendingMessage);
        setInput('');
        setPendingMessage('');
        setConfirmMode(false);
      } else {
        setPendingMessage(input);
        setConfirmMode(true);
      }
    }
  };

  const handleEdit = () => {
    setConfirmMode(false);
  };

  const handleConfirm = () => {
    if (pendingMessage.trim()) {
      onSendMessage(pendingMessage);
      setInput('');
      setPendingMessage('');
      setConfirmMode(false);
    }
  };

  return (
    <div className="space-y-2">
      {confirmMode && (
        <div className="bg-dila-gray/30 p-2 rounded-lg">
          <div className="font-medium text-sm text-dila-blue mb-1">Confirmez votre question :</div>
          <p className="text-sm mb-2 whitespace-pre-wrap break-words">{pendingMessage}</p>
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleEdit}
              size="sm"
              className="bg-white hover:bg-dila-gray"
            >
              <X className="h-4 w-4 mr-1" /> Modifier
            </Button>
            <Button 
              type="button" 
              onClick={handleConfirm}
              size="sm"
              className="bg-dila-blue hover:bg-dila-blue/90"
            >
              <Check className="h-4 w-4 mr-1" /> Confirmer
            </Button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question..."
          className="flex-1 focus-visible:ring-dila-blue"
          disabled={disabled || confirmMode}
        />
        {!confirmMode && (
          <>
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
          </>
        )}
      </form>
    </div>
  );
};

export default ChatInput;

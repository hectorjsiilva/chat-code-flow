import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { SuggestedPrompts } from "./SuggestedPrompts";

interface FixedChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function FixedChatInput({ 
  input, 
  onInputChange, 
  onSend, 
  onSelectPrompt,
  disabled = false, 
  placeholder = "Describe tu consulta médica..." 
}: FixedChatInputProps) {
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-blue-200 shadow-lg">
      <div className="max-w-4xl mx-auto p-4 space-y-3">
        {/* Prompts Sugeridos */}
        <SuggestedPrompts onSelectPrompt={onSelectPrompt} disabled={disabled} />
        
        {/* Input de Chat */}
        <Card className="shadow-md border-blue-200">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 text-base py-3"
                disabled={disabled}
              />
              <Button
                onClick={onSend}
                disabled={!input.trim() || disabled}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
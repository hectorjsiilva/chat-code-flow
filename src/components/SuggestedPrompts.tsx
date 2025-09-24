import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { getSuggestedPrompts } from "@/utils/sqlGenerator";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export function SuggestedPrompts({ onSelectPrompt, disabled = false }: SuggestedPromptsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const suggestedPrompts = getSuggestedPrompts();

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white shadow-md">
      <CardContent className="p-4">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-2 hover:bg-blue-100 text-blue-700"
          disabled={disabled}
        >
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span className="font-medium">Consultas Sugeridas</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
        
        {isExpanded && (
          <div className="mt-4 space-y-2 animate-fade-in-up">
            <div className="grid gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => {
                    onSelectPrompt(prompt);
                    setIsExpanded(false);
                  }}
                  className="text-left justify-start h-auto py-3 px-4 whitespace-normal text-sm border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  disabled={disabled}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
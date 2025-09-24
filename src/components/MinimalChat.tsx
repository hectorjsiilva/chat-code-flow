import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export function MinimalChat() {
  const [input, setInput] = useState("");

  const handleSend = () => {
    console.log("Sending:", input);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">KlinikaAI Data Center</h1>
          <p className="text-blue-600">Sistema de análisis de datos hospitalarios</p>
        </div>

        <Card className="shadow-lg border-blue-200">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe tu consulta médica..."
                className="flex-1 border-blue-200"
              />
              <Button
                onClick={handleSend}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
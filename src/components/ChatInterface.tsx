import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Database, BarChart3 } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { ChartDisplay } from "./ChartDisplay";
import { LoadingAnimation } from "./LoadingAnimation";

interface Message {
  id: string;
  text: string;
  type: 'user' | 'system';
  timestamp: Date;
}

interface ProcessingStep {
  code?: string;
  charts?: boolean;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'idle' | 'generating-code' | 'generating-charts'>('idle');
  const [processedData, setProcessedData] = useState<ProcessingStep>({});

  const generateRandomMySQL = () => {
    const queries = [
      `CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      `SELECT u.nombre, COUNT(p.id) as total_pedidos
FROM usuarios u
LEFT JOIN pedidos p ON u.id = p.usuario_id
WHERE u.fecha_registro >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.id, u.nombre
ORDER BY total_pedidos DESC
LIMIT 10;`,
      `UPDATE productos 
SET precio = precio * 1.1,
    fecha_actualizacion = NOW()
WHERE categoria = 'electronica' 
AND stock > 0;`,
      `INSERT INTO ventas (producto_id, cantidad, precio_unitario, fecha_venta)
SELECT p.id, FLOOR(RAND() * 10) + 1, p.precio, NOW()
FROM productos p
WHERE p.activo = 1
ORDER BY RAND()
LIMIT 5;`
    ];
    return queries[Math.floor(Math.random() * queries.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    setCurrentStep('generating-code');
    setProcessedData({});

    // Simulación del procesamiento
    setTimeout(() => {
      const code = generateRandomMySQL();
      setProcessedData({ code });
      setCurrentStep('generating-charts');
      
      setTimeout(() => {
        setProcessedData(prev => ({ ...prev, charts: true }));
        setCurrentStep('idle');
        setIsProcessing(false);
      }, 5000);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in-up">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <Database className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          SQL Generator AI
        </h1>
        <p className="text-muted-foreground mt-2">
          Describe tu consulta en lenguaje natural y obtén código MySQL con visualizaciones
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`animate-slide-up ${
              message.type === 'user' ? 'ml-auto max-w-2xl' : 'mr-auto max-w-2xl'
            }`}
          >
            <Card className={`${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                : 'bg-card'
            } shadow-md`}>
              <CardContent className="p-4">
                <p className="text-sm">{message.text}</p>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Processing States */}
        {isProcessing && (
          <div className="space-y-6">
            {currentStep === 'generating-code' && (
              <LoadingAnimation 
                icon={Database}
                text="Procesando información..."
                className="animate-bounce-in"
              />
            )}

            {processedData.code && (
              <div className="animate-bounce-in">
                <CodeBlock code={processedData.code} />
                {currentStep === 'generating-charts' && (
                  <LoadingAnimation 
                    icon={BarChart3}
                    text="Generando gráficos..."
                    className="mt-4"
                  />
                )}
              </div>
            )}

            {processedData.charts && (
              <div className="animate-bounce-in">
                <ChartDisplay />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <Card className="shadow-lg border-blue-200">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe qué consulta SQL necesitas..."
              className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              disabled={isProcessing}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
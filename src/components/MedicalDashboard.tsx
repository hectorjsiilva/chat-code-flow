import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";
import { FixedChatInput } from "./FixedChatInput";
import { ChartTypeSelector } from "./ChartTypeSelector";
import { DynamicCharts } from "./DynamicCharts";
import { generateCoherentSQL } from "@/utils/sqlGenerator";
import { generateCoherentChartData } from "@/utils/chartDataGenerator";
import klinikaLogo from "@/assets/klinika-logo.avif";

interface Message {
  id: string;
  text: string;
  type: 'user' | 'system';
  timestamp: Date;
}

interface SQLResult {
  query: string;
  description: string;
  type: string;
  recommendedCharts: string[];
}

export function MedicalDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showChartSelector, setShowChartSelector] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [currentSQL, setCurrentSQL] = useState<SQLResult | null>(null);
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'line' | 'pie' | 'area' | 'scatter'>('bar');
  const [currentChartData, setCurrentChartData] = useState<any[]>([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    const sqlResult = generateCoherentSQL(input);
    setCurrentSQL(sqlResult);
    
    const defaultChart = sqlResult.recommendedCharts[0] as any;
    setSelectedChartType(defaultChart);
    
    setInput("");
    setIsProcessing(true);
    setShowCode(false);
    setShowChartSelector(false);
    setShowCharts(false);

    setTimeout(() => {
      setShowCode(true);
      setShowChartSelector(true);
      
      setTimeout(() => {
        // Generar datos aleatorios basados en el tipo de consulta
        const mockChartData = generateCoherentChartData(sqlResult.type, defaultChart);
        setCurrentChartData(mockChartData);
        setShowCharts(true);
        setIsProcessing(false);
      }, 1000);
    }, 1000);
  };

  const handleSelectPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleChartTypeChange = (newType: 'bar' | 'line' | 'pie' | 'area' | 'scatter') => {
    setSelectedChartType(newType);
    if (currentSQL) {
      // Generar nuevos datos aleatorios para el nuevo tipo de gráfico
      const newChartData = generateCoherentChartData(currentSQL.type, newType);
      setCurrentChartData(newChartData);
    }
  };

  const LoadingAnimation = ({ text }: { text: string }) => (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 animate-bounce-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-center space-x-3">
          <Database className="w-6 h-6 text-blue-600 animate-pulse" />
          <span className="text-blue-700 font-medium">{text}</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="pb-64">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <img 
                  src={klinikaLogo} 
                  alt="KlinikaAI Logo" 
                  className="h-16 w-auto object-contain"
                />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-2">
              KlinikaAI Data Center
            </h1>
            <p className="text-blue-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Centro de análisis de datos hospitalarios. Describe tu consulta médica en lenguaje natural 
              y obtén código MySQL optimizado con visualizaciones inteligentes
            </p>
          </div>

          <div className="space-y-6 mb-6">
            {messages.map((message) => (
              <div key={message.id} className={`animate-slide-up ${message.type === 'user' ? 'ml-auto max-w-2xl' : 'mr-auto max-w-2xl'}`}>
                <Card className={`${message.type === 'user' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-white'} shadow-md`}>
                  <CardContent className="p-4">
                    <p className="text-sm">{message.text}</p>
                  </CardContent>
                </Card>
              </div>
            ))}

            {isProcessing && !showCode && (
              <LoadingAnimation text="Analizando consulta y generando SQL..." />
            )}

            {showCode && currentSQL && (
              <Card className="border-blue-200 shadow-md animate-bounce-in">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-blue-800">
                    <Database className="w-5 h-5" />
                    <span>Consulta SQL: {currentSQL.description}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-blue-900 font-mono whitespace-pre-wrap">
                      <code>{currentSQL.query}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {showChartSelector && currentSQL && (
              <div className="animate-bounce-in">
                <ChartTypeSelector
                  selectedType={selectedChartType}
                  onTypeChange={handleChartTypeChange}
                  availableTypes={currentSQL.recommendedCharts}
                  disabled={isProcessing}
                />
              </div>
            )}

            {isProcessing && showCode && !showCharts && (
              <LoadingAnimation text="Generando visualizaciones con datos aleatorios..." />
            )}

            {showCharts && currentChartData.length > 0 && (
              <div className="animate-bounce-in">
                <DynamicCharts chartData={currentChartData} />
              </div>
            )}
          </div>
        </div>
      </div>

      <FixedChatInput
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        onSelectPrompt={handleSelectPrompt}
        disabled={isProcessing}
        placeholder="Ej: Muestra las camas disponibles por unidad médica, pacientes críticos hoy..."
      />
    </div>
  );
}
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { FixedChatInput } from "./FixedChatInput";
import { generateCoherentSQL } from "@/utils/sqlGenerator";
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
}

export function MedicalDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [currentSQL, setCurrentSQL] = useState<SQLResult | null>(null);

  // Datos médicos estáticos para los gráficos
  const bedData = [
    { name: 'UCI', camas_ocupadas: 18, camas_totales: 24, pacientes_criticos: 12 },
    { name: 'Cardiología', camas_ocupadas: 28, camas_totales: 35, pacientes_criticos: 8 },
    { name: 'Neurología', camas_ocupadas: 22, camas_totales: 30, pacientes_criticos: 15 },
    { name: 'Traumatología', camas_ocupadas: 32, camas_totales: 40, pacientes_criticos: 5 },
    { name: 'Pediatría', camas_ocupadas: 15, camas_totales: 25, pacientes_criticos: 3 },
    { name: 'Emergencias', camas_ocupadas: 45, camas_totales: 50, pacientes_criticos: 22 },
  ];

  const flowData = [
    { name: 'Lun', ingresos: 45, altas: 38 },
    { name: 'Mar', ingresos: 52, altas: 41 },
    { name: 'Mie', ingresos: 48, altas: 45 },
    { name: 'Jue', ingresos: 61, altas: 49 },
    { name: 'Vie', ingresos: 55, altas: 52 },
    { name: 'Sab', ingresos: 38, altas: 44 },
    { name: 'Dom', ingresos: 32, altas: 41 },
  ];

  const gravityData = [
    { name: 'Leve', value: 45, color: '#10B981' },
    { name: 'Moderado', value: 28, color: '#F59E0B' },
    { name: 'Grave', value: 18, color: '#F97316' },
    { name: 'Crítico', value: 9, color: '#DC2626' },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Generar SQL coherente con el prompt
    const sqlResult = generateCoherentSQL(input);
    setCurrentSQL(sqlResult);
    
    setInput("");
    setIsProcessing(true);
    setShowCode(false);
    setShowCharts(false);

    // Simular procesamiento
    setTimeout(() => {
      setShowCode(true);
      setTimeout(() => {
        setShowCharts(true);
        setIsProcessing(false);
      }, 3000);
    }, 2000);
  };

  const handleSelectPrompt = (prompt: string) => {
    setInput(prompt);
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
      {/* Contenido principal con padding bottom para el chat fijo */}
      <div className="pb-64">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
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

          {/* Messages */}
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

            {/* Processing Animation */}
            {isProcessing && !showCode && (
              <LoadingAnimation text="Analizando consulta y generando SQL..." />
            )}

            {/* SQL Code Display */}
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

            {isProcessing && showCode && !showCharts && (
              <LoadingAnimation text="Generando visualizaciones médicas..." />
            )}

            {/* Charts Display */}
            {showCharts && (
              <div className="space-y-6 animate-bounce-in">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800">Panel de Análisis Médico</h3>
                </div>

                <div className="grid gap-6">
                  {/* Bed Occupancy Chart */}
                  <Card className="border-blue-200 shadow-lg bg-gradient-to-br from-white to-blue-50">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2 text-blue-700 text-lg">
                        <BarChart3 className="w-5 h-5" />
                        <span>Ocupación de Camas por Unidad</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={bedData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" />
                            <XAxis dataKey="name" stroke="#1E40AF" fontSize={12} angle={-45} textAnchor="end" height={60} />
                            <YAxis stroke="#1E40AF" fontSize={12} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#F0F9FF',
                                border: '1px solid #BFDBFE',
                                borderRadius: '12px'
                              }}
                            />
                            <Bar dataKey="camas_ocupadas" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Camas Ocupadas" />
                            <Bar dataKey="camas_totales" fill="#93C5FD" radius={[4, 4, 0, 0]} name="Camas Totales" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Patient Flow Chart */}
                    <Card className="border-blue-200 shadow-lg bg-gradient-to-br from-white to-blue-50">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center space-x-2 text-blue-700 text-lg">
                          <BarChart3 className="w-5 h-5" />
                          <span>Flujo de Pacientes Semanal</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={flowData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" />
                              <XAxis dataKey="name" stroke="#1E40AF" fontSize={12} />
                              <YAxis stroke="#1E40AF" fontSize={12} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#F0F9FF',
                                  border: '1px solid #BFDBFE',
                                  borderRadius: '12px'
                                }}
                              />
                              <Line type="monotone" dataKey="ingresos" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }} name="Ingresos" />
                              <Line type="monotone" dataKey="altas" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }} name="Altas" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Gravity Distribution Chart */}
                    <Card className="border-blue-200 shadow-lg bg-gradient-to-br from-white to-blue-50">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center space-x-2 text-blue-700 text-lg">
                          <BarChart3 className="w-5 h-5" />
                          <span>Distribución por Gravedad</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={gravityData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={40}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                              >
                                {gravityData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#F0F9FF',
                                  border: '1px solid #BFDBFE',
                                  borderRadius: '12px'
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Chat Input */}
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
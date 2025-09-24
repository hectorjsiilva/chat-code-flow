import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Database, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import klinikaLogo from "@/assets/klinika-logo.avif";

interface Message {
  id: string;
  text: string;
  type: 'user' | 'system';
  timestamp: Date;
}

export function KlinikaAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  // Datos médicos estáticos
  const bedData = [
    { name: 'UCI', camas_ocupadas: 18, camas_totales: 24, pacientes_criticos: 12 },
    { name: 'Cardiología', camas_ocupadas: 28, camas_totales: 35, pacientes_criticos: 8 },
    { name: 'Neurología', camas_ocupadas: 22, camas_totales: 30, pacientes_criticos: 15 },
    { name: 'Traumatología', camas_ocupadas: 32, camas_totales: 40, pacientes_criticos: 5 },
  ];

  const flowData = [
    { name: 'Lun', ingresos: 45, altas: 38 },
    { name: 'Mar', ingresos: 52, altas: 41 },
    { name: 'Mie', ingresos: 48, altas: 45 },
    { name: 'Jue', ingresos: 61, altas: 49 },
  ];

  const gravityData = [
    { name: 'Leve', value: 45, color: '#10B981' },
    { name: 'Moderado', value: 28, color: '#F59E0B' },
    { name: 'Grave', value: 18, color: '#F97316' },
    { name: 'Crítico', value: 9, color: '#DC2626' },
  ];

  const sqlQueries = [
    `-- Consulta de ocupación de camas por unidad médica
SELECT 
    um.nombre_unidad,
    COUNT(c.id) as total_camas,
    COUNT(CASE WHEN c.estado = 'ocupada' THEN 1 END) as camas_ocupadas,
    COUNT(CASE WHEN c.estado = 'disponible' THEN 1 END) as camas_libres,
    ROUND((COUNT(CASE WHEN c.estado = 'ocupada' THEN 1 END) * 100.0 / COUNT(c.id)), 2) as porcentaje_ocupacion
FROM unidades_medicas um
LEFT JOIN camas c ON um.id = c.unidad_id
WHERE um.activa = true
GROUP BY um.id, um.nombre_unidad
ORDER BY porcentaje_ocupacion DESC;`,

    `-- Análisis de pacientes por gravedad y días de estancia
SELECT 
    p.estado_gravedad,
    COUNT(*) as total_pacientes,
    ROUND(AVG(EXTRACT(DAY FROM (NOW() - p.fecha_ingreso))), 1) as promedio_dias_estancia,
    COUNT(CASE WHEN p.fecha_alta IS NULL THEN 1 END) as pacientes_hospitalizados
FROM pacientes p
WHERE p.fecha_ingreso >= NOW() - INTERVAL '30 days'
GROUP BY p.estado_gravedad;`,

    `-- Estado actual de quirófanos y cirugías programadas
SELECT 
    q.numero_quirofano,
    q.estado as estado_quirofano,
    COUNT(c.id) as cirugias_programadas_hoy,
    COUNT(CASE WHEN c.estado = 'completada' THEN 1 END) as cirugias_completadas
FROM quirofanos q
LEFT JOIN cirugias c ON q.id = c.quirofano_id AND c.fecha_cirugia = CURRENT_DATE
WHERE q.activo = true
GROUP BY q.id, q.numero_quirofano, q.estado;`
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
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
            <div key={message.id} className={`${message.type === 'user' ? 'ml-auto max-w-2xl' : 'mr-auto max-w-2xl'}`}>
              <Card className={`${message.type === 'user' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-white'} shadow-md`}>
                <CardContent className="p-4">
                  <p className="text-sm">{message.text}</p>
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Processing Animation */}
          {isProcessing && (
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-3">
                  <Database className="w-6 h-6 text-blue-600 animate-pulse" />
                  <span className="text-blue-700 font-medium">Procesando información...</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SQL Code Display */}
          {showCode && (
            <Card className="border-blue-200 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Database className="w-5 h-5" />
                  <span>Consulta SQL Médica Generada</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-blue-900 font-mono whitespace-pre-wrap">
                    <code>{sqlQueries[Math.floor(Math.random() * sqlQueries.length)]}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Charts Display */}
          {showCharts && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-blue-800">Panel de Análisis Médico</h3>
              </div>

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
                        <XAxis dataKey="name" stroke="#1E40AF" fontSize={12} />
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
                    <span>Distribución de Pacientes por Gravedad</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="h-80 w-full lg:w-1/2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={gravityData}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            innerRadius={60}
                            dataKey="value"
                            label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
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
                    <div className="w-full lg:w-1/2 space-y-3">
                      {gravityData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-5 h-5 rounded-full shadow-md" 
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-blue-800 font-semibold text-lg">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-blue-900 font-bold text-xl">{item.value}%</span>
                            <div className="text-blue-600 text-sm">
                              ~{Math.round(item.value * 2.8)} pacientes
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                placeholder="Ej: Muestra las camas disponibles por unidad médica, pacientes críticos hoy..."
                className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 text-base py-3"
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
    </div>
  );
}
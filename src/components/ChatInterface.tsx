import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Database, BarChart3 } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { ChartDisplay } from "./ChartDisplay";
import { LoadingAnimation } from "./LoadingAnimation";
import klinikaLogo from "@/assets/klinika-logo.avif";
import { useMedicalData } from "@/hooks/useMedicalData";

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
  const { bedData, flowData, gravityData, loading, refetch } = useMedicalData();

  const generateRandomMySQL = () => {
    const queries = [
      `-- Consulta de ocupación de camas por unidad médica
SELECT 
    um.nombre_unidad,
    COUNT(c.id) as total_camas,
    COUNT(CASE WHEN c.estado = 'ocupada' THEN 1 END) as camas_ocupadas,
    COUNT(CASE WHEN c.estado = 'disponible' THEN 1 END) as camas_libres,
    ROUND(
        (COUNT(CASE WHEN c.estado = 'ocupada' THEN 1 END) * 100.0 / COUNT(c.id)), 2
    ) as porcentaje_ocupacion
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
GROUP BY p.estado_gravedad
ORDER BY 
    CASE p.estado_gravedad 
        WHEN 'critico' THEN 1
        WHEN 'grave' THEN 2  
        WHEN 'moderado' THEN 3
        WHEN 'leve' THEN 4
    END;`,

      `-- Reporte de emergencias por prioridad y tiempo de atención
SELECT 
    e.prioridad,
    COUNT(*) as total_emergencias,
    ROUND(AVG(e.tiempo_atencion_minutos), 1) as tiempo_promedio_atencion,
    COUNT(CASE WHEN e.estado = 'atendido' THEN 1 END) as emergencias_resueltas,
    COUNT(CASE WHEN e.estado = 'derivado' THEN 1 END) as emergencias_derivadas
FROM emergencias e
WHERE e.fecha_ingreso >= NOW() - INTERVAL '7 days'
GROUP BY e.prioridad
ORDER BY 
    CASE e.prioridad 
        WHEN 'roja' THEN 1
        WHEN 'amarilla' THEN 2
        WHEN 'verde' THEN 3
        WHEN 'azul' THEN 4
    END;`,

      `-- Estado actual de quirófanos y cirugías programadas
SELECT 
    q.numero_quirofano,
    q.estado as estado_quirofano,
    COUNT(c.id) as cirugias_programadas_hoy,
    COUNT(CASE WHEN c.estado = 'completada' THEN 1 END) as cirugias_completadas,
    COUNT(CASE WHEN c.estado = 'en_proceso' THEN 1 END) as cirugias_en_proceso
FROM quirofanos q
LEFT JOIN cirugias c ON q.id = c.quirofano_id 
    AND c.fecha_cirugia = CURRENT_DATE
WHERE q.activo = true
GROUP BY q.id, q.numero_quirofano, q.estado
ORDER BY q.numero_quirofano;`,

      `-- Personal médico disponible por especialidad y turno
SELECT 
    pm.especialidad,
    COUNT(*) as total_personal,
    COUNT(CASE WHEN pm.turno_actual = 'activo' THEN 1 END) as personal_activo,
    COUNT(CASE WHEN pm.disponible_emergencias = true AND pm.turno_actual = 'activo' THEN 1 END) as disponible_emergencias,
    ROUND(AVG(pm.años_experiencia), 1) as experiencia_promedio
FROM personal_medico pm
WHERE pm.estado_laboral = 'activo'
GROUP BY pm.especialidad
ORDER BY personal_activo DESC, total_personal DESC;`,

      `-- Histórico de ocupación de camas últimos 30 días
SELECT 
    DATE(hoc.fecha_ocupacion) as fecha,
    COUNT(DISTINCT hoc.cama_id) as camas_ocupadas,
    COUNT(CASE WHEN hoc.estado_durante_ocupacion = 'critico' THEN 1 END) as pacientes_criticos,
    COUNT(CASE WHEN hoc.estado_durante_ocupacion = 'grave' THEN 1 END) as pacientes_graves,
    COUNT(CASE WHEN hoc.fecha_liberacion IS NOT NULL THEN 1 END) as altas_del_dia
FROM historial_ocupacion_camas hoc
WHERE hoc.fecha_ocupacion >= NOW() - INTERVAL '30 days'
GROUP BY DATE(hoc.fecha_ocupacion)
ORDER BY fecha DESC
LIMIT 30;`
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
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Centro de análisis de datos hospitalarios. Describe tu consulta médica en lenguaje natural 
          y obtén código MySQL optimizado con visualizaciones inteligentes
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
                <ChartDisplay 
                  bedData={bedData}
                  flowData={flowData}
                  gravityData={gravityData}
                />
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
  );
}
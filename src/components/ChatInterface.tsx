import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Database, BarChart3 } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { ChartDisplay } from "./ChartDisplay";
import { LoadingAnimation } from "./LoadingAnimation";
import klinikaLogo from "@/assets/klinika-logo.avif";

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
      `-- Consulta de ocupación de camas por unidad
SELECT 
    u.nombre_unidad,
    COUNT(c.id) as total_camas,
    SUM(CASE WHEN c.estado = 'ocupada' THEN 1 ELSE 0 END) as camas_ocupadas,
    SUM(CASE WHEN c.estado = 'disponible' THEN 1 ELSE 0 END) as camas_libres,
    ROUND(
        (SUM(CASE WHEN c.estado = 'ocupada' THEN 1 ELSE 0 END) * 100.0 / COUNT(c.id)), 2
    ) as porcentaje_ocupacion
FROM unidades_medicas u
LEFT JOIN camas c ON u.id = c.unidad_id
WHERE u.activa = 1
GROUP BY u.id, u.nombre_unidad
ORDER BY porcentaje_ocupacion DESC;`,

      `-- Análisis de pacientes por gravedad y estado
SELECT 
    p.estado_gravedad,
    COUNT(*) as total_pacientes,
    AVG(DATEDIFF(NOW(), p.fecha_ingreso)) as promedio_dias_estancia,
    COUNT(CASE WHEN p.alta_medica IS NULL THEN 1 END) as pacientes_activos
FROM pacientes p
WHERE p.fecha_ingreso >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY p.estado_gravedad
ORDER BY 
    CASE p.estado_gravedad 
        WHEN 'critico' THEN 1
        WHEN 'grave' THEN 2  
        WHEN 'moderado' THEN 3
        WHEN 'leve' THEN 4
    END;`,

      `-- Reporte de emergencias por turno
CREATE TABLE reporte_emergencias AS
SELECT 
    DATE(fecha_ingreso) as fecha,
    CASE 
        WHEN HOUR(fecha_ingreso) BETWEEN 6 AND 13 THEN 'Mañana'
        WHEN HOUR(fecha_ingreso) BETWEEN 14 AND 21 THEN 'Tarde'
        ELSE 'Noche'
    END as turno,
    COUNT(*) as total_emergencias,
    COUNT(CASE WHEN prioridad = 'roja' THEN 1 END) as emergencias_criticas,
    AVG(tiempo_atencion_minutos) as tiempo_promedio_atencion
FROM emergencias e
WHERE e.fecha_ingreso >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(fecha_ingreso), turno
ORDER BY fecha DESC, turno;`,

      `-- Actualización de estado de quirófanos
UPDATE quirofanos q
SET 
    estado = CASE 
        WHEN EXISTS (
            SELECT 1 FROM cirugias c 
            WHERE c.quirofano_id = q.id 
            AND c.fecha_cirugia = CURDATE()
            AND c.estado = 'en_proceso'
        ) THEN 'ocupado'
        WHEN q.mantenimiento_programado = 1 THEN 'mantenimiento'
        ELSE 'disponible'
    END,
    ultima_actualizacion = NOW()
WHERE q.activo = 1;`,

      `-- Consulta de personal médico por especialidad
SELECT 
    e.nombre_especialidad,
    COUNT(pm.id) as total_medicos,
    COUNT(CASE WHEN pm.turno_actual = 'activo' THEN 1 END) as medicos_activos,
    COUNT(CASE WHEN pm.disponible_emergencias = 1 THEN 1 END) as disponibles_emergencia,
    AVG(pm.años_experiencia) as experiencia_promedio
FROM personal_medico pm
INNER JOIN especialidades e ON pm.especialidad_id = e.id
WHERE pm.estado_laboral = 'activo'
GROUP BY e.id, e.nombre_especialidad
ORDER BY medicos_activos DESC, total_medicos DESC;`
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
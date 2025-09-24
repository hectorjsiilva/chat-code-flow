import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";

// Datos simulados médicos para los gráficos
const barData = [
  { name: 'UCI', camas_ocupadas: 18, camas_totales: 24, pacientes_criticos: 12 },
  { name: 'Cardiología', camas_ocupadas: 28, camas_totales: 35, pacientes_criticos: 8 },
  { name: 'Neurología', camas_ocupadas: 22, camas_totales: 30, pacientes_criticos: 15 },
  { name: 'Traumatología', camas_ocupadas: 32, camas_totales: 40, pacientes_criticos: 5 },
  { name: 'Pediatría', camas_ocupadas: 15, camas_totales: 25, pacientes_criticos: 3 },
  { name: 'Emergencias', camas_ocupadas: 45, camas_totales: 50, pacientes_criticos: 22 },
];

const lineData = [
  { name: 'Lun', ingresos: 45, altas: 38 },
  { name: 'Mar', ingresos: 52, altas: 41 },
  { name: 'Mie', ingresos: 48, altas: 45 },
  { name: 'Jue', ingresos: 61, altas: 49 },
  { name: 'Vie', ingresos: 55, altas: 52 },
  { name: 'Sab', ingresos: 38, altas: 44 },
  { name: 'Dom', ingresos: 32, altas: 41 },
];

const pieData = [
  { name: 'Leve', value: 45, color: '#10B981' },
  { name: 'Moderado', value: 28, color: '#F59E0B' },
  { name: 'Grave', value: 18, color: '#F97316' },
  { name: 'Crítico', value: 9, color: '#DC2626' },
];

export function ChartDisplay() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-blue-800">Panel de Análisis Médico</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Ocupación de Camas */}
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
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#1E40AF" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#1E40AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#F0F9FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
                    }}
                  />
                  <Bar 
                    dataKey="camas_ocupadas" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    name="Camas Ocupadas"
                  />
                  <Bar 
                    dataKey="camas_totales" 
                    fill="#93C5FD" 
                    radius={[4, 4, 0, 0]}
                    name="Camas Totales"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Línea - Flujo de Pacientes */}
        <Card className="border-blue-200 shadow-lg bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-blue-700 text-lg">
              <TrendingUp className="w-5 h-5" />
              <span>Flujo de Pacientes Semanal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" />
                  <XAxis dataKey="name" stroke="#1E40AF" fontSize={12} />
                  <YAxis stroke="#1E40AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#F0F9FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ingresos" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    name="Ingresos"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="altas" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    name="Altas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Circular - Gravedad de Pacientes */}
      <Card className="border-blue-200 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-blue-700 text-lg">
            <PieChartIcon className="w-5 h-5" />
            <span>Distribución de Pacientes por Gravedad</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="h-80 w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    dataKey="value"
                    label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#F0F9FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 space-y-3">
              {pieData.map((item, index) => (
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
  );
}
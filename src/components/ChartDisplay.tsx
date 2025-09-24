import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";

interface BedOccupancyData {
  name: string;
  camas_ocupadas: number;
  camas_totales: number;
  pacientes_criticos: number;
}

interface PatientFlowData {
  name: string;
  ingresos: number;
  altas: number;
}

interface GravityData {
  name: string;
  value: number;
  color: string;
}

interface ChartDisplayProps {
  bedData: BedOccupancyData[];
  flowData: PatientFlowData[];
  gravityData: GravityData[];
}

export function ChartDisplay({ bedData, flowData, gravityData }: ChartDisplayProps) {
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
                <BarChart data={bedData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
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
                <LineChart data={flowData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
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
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
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
  );
}
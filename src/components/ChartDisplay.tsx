import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";

// Datos simulados para los gráficos
const barData = [
  { name: 'Enero', usuarios: 120, ventas: 2400 },
  { name: 'Febrero', usuarios: 190, ventas: 3200 },
  { name: 'Marzo', usuarios: 300, ventas: 4100 },
  { name: 'Abril', usuarios: 280, ventas: 3800 },
  { name: 'Mayo', usuarios: 450, ventas: 5200 },
  { name: 'Junio', usuarios: 380, ventas: 4600 },
];

const lineData = [
  { name: 'Sem 1', rendimiento: 65 },
  { name: 'Sem 2', rendimiento: 78 },
  { name: 'Sem 3', rendimiento: 82 },
  { name: 'Sem 4', rendimiento: 88 },
  { name: 'Sem 5', rendimiento: 95 },
  { name: 'Sem 6', rendimiento: 92 },
];

const pieData = [
  { name: 'Electrónicos', value: 35, color: '#3B82F6' },
  { name: 'Ropa', value: 25, color: '#60A5FA' },
  { name: 'Hogar', value: 20, color: '#93C5FD' },
  { name: 'Deportes', value: 12, color: '#DBEAFE' },
  { name: 'Otros', value: 8, color: '#1D4ED8' },
];

export function ChartDisplay() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-blue-800">Visualización de Datos</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Gráfico de Barras */}
        <Card className="border-blue-200 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-blue-700 text-lg">
              <BarChart3 className="w-5 h-5" />
              <span>Usuarios vs Ventas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" />
                  <XAxis dataKey="name" stroke="#1E40AF" />
                  <YAxis stroke="#1E40AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#F0F9FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="usuarios" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ventas" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Línea */}
        <Card className="border-blue-200 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-blue-700 text-lg">
              <TrendingUp className="w-5 h-5" />
              <span>Rendimiento Semanal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" />
                  <XAxis dataKey="name" stroke="#1E40AF" />
                  <YAxis stroke="#1E40AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#F0F9FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rendimiento" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Circular */}
      <Card className="border-blue-200 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-blue-700 text-lg">
            <PieChartIcon className="w-5 h-5" />
            <span>Distribución por Categorías</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center">
            <div className="h-64 w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#F0F9FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-blue-800 font-medium">{item.name}</span>
                  </div>
                  <span className="text-blue-600 font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
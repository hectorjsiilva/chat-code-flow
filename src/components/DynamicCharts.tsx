import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart
} from "recharts";
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, AreaChart as AreaChartIcon } from "lucide-react";
import { ChartData } from "@/utils/chartDataGenerator";

interface DynamicChartsProps {
  chartData: ChartData[];
}

export function DynamicCharts({ chartData }: DynamicChartsProps) {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-blue-600">No hay datos de gráficos disponibles</p>
      </div>
    );
  }

  const renderChart = (chart: ChartData, index: number) => {
    const getIcon = () => {
      switch (chart.type) {
        case 'bar': return <BarChart3 className="w-5 h-5" />;
        case 'line': return <LineChartIcon className="w-5 h-5" />;
        case 'pie': return <PieChartIcon className="w-5 h-5" />;
        case 'area': return <AreaChartIcon className="w-5 h-5" />;
        default: return <BarChart3 className="w-5 h-5" />;
      }
    };

    const renderChartContent = () => {
      switch (chart.type) {
        case 'bar':
          return (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart.data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" />
                <XAxis 
                  dataKey={chart.xAxis || Object.keys(chart.data[0] || {})[0]} 
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
                    borderRadius: '12px'
                  }}
                />
                {Object.keys(chart.data[0] || {})
                  .filter(key => typeof chart.data[0][key] === 'number')
                  .map((key, i) => (
                    <Bar 
                      key={key}
                      dataKey={key} 
                      fill={i === 0 ? "#3B82F6" : i === 1 ? "#60A5FA" : "#93C5FD"}
                      radius={[4, 4, 0, 0]} 
                      name={key.charAt(0).toUpperCase() + key.slice(1)}
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          );

        case 'line':
          return (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart.data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" />
                <XAxis 
                  dataKey={chart.xAxis || Object.keys(chart.data[0] || {})[0]} 
                  stroke="#1E40AF" 
                  fontSize={12} 
                />
                <YAxis stroke="#1E40AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#F0F9FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '12px'
                  }}
                />
                {Object.keys(chart.data[0] || {})
                  .filter(key => typeof chart.data[0][key] === 'number')
                  .map((key, i) => (
                    <Line 
                      key={key}
                      type="monotone" 
                      dataKey={key} 
                      stroke={i === 0 ? "#3B82F6" : i === 1 ? "#10B981" : "#F59E0B"}
                      strokeWidth={3}
                      dot={{ fill: i === 0 ? "#3B82F6" : i === 1 ? "#10B981" : "#F59E0B", strokeWidth: 2, r: 6 }}
                      name={key.charAt(0).toUpperCase() + key.slice(1)}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          );

        case 'area':
          return (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart.data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" />
                <XAxis 
                  dataKey={chart.xAxis || Object.keys(chart.data[0] || {})[0]} 
                  stroke="#1E40AF" 
                  fontSize={12} 
                />
                <YAxis stroke="#1E40AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#F0F9FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '12px'
                  }}
                />
                {Object.keys(chart.data[0] || {})
                  .filter(key => typeof chart.data[0][key] === 'number')
                  .map((key, i) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stackId="1"
                      stroke={i === 0 ? "#3B82F6" : i === 1 ? "#10B981" : "#F59E0B"}
                      fill={i === 0 ? "#3B82F6" : i === 1 ? "#10B981" : "#F59E0B"}
                      fillOpacity={0.6}
                      name={key.charAt(0).toUpperCase() + key.slice(1)}
                    />
                  ))}
              </AreaChart>
            </ResponsiveContainer>
          );

        case 'pie':
          return (
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="h-80 w-full lg:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chart.data}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={60}
                      dataKey="value"
                      label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {chart.data.map((entry: any, i: number) => (
                        <Cell key={`cell-${i}`} fill={entry.color || `hsl(${i * 45}, 70%, 60%)`} />
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
                {chart.data.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-5 h-5 rounded-full shadow-md" 
                        style={{ backgroundColor: item.color || `hsl(${i * 45}, 70%, 60%)` }}
                      ></div>
                      <span className="text-blue-800 font-semibold text-lg">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-blue-900 font-bold text-xl">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        default:
          return <div>Tipo de gráfico no soportado</div>;
      }
    };

    return (
      <Card key={index} className="border-blue-200 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-blue-700 text-lg">
            {getIcon()}
            <span>{chart.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {renderChartContent()}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-blue-800">Análisis Visual de Datos</h3>
      </div>
      
      <div className={`grid gap-6 ${chartData.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {chartData.map((chart, index) => renderChart(chart, index))}
      </div>
    </div>
  );
}
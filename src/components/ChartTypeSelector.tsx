import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, LineChart, PieChart, AreaChart, Zap } from "lucide-react";

interface ChartTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: 'bar' | 'line' | 'pie' | 'area' | 'scatter') => void;
  availableTypes: string[];
  disabled?: boolean;
}

const chartIcons = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  area: AreaChart,
  scatter: Zap
};

const chartLabels = {
  bar: 'Barras',
  line: 'Líneas',
  pie: 'Circular',
  area: 'Área',
  scatter: 'Dispersión'
};

export function ChartTypeSelector({ 
  selectedType, 
  onTypeChange, 
  availableTypes, 
  disabled = false 
}: ChartTypeSelectorProps) {
  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-blue-800 text-lg">
          <BarChart3 className="w-5 h-5" />
          <span>Tipo de Visualización</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {availableTypes.map((type) => {
            const IconComponent = chartIcons[type as keyof typeof chartIcons];
            const isSelected = selectedType === type;
            
            return (
              <Button
                key={type}
                variant={isSelected ? "default" : "outline"}
                onClick={() => onTypeChange(type as any)}
                disabled={disabled}
                className={`flex items-center space-x-2 ${
                  isSelected 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'border-blue-200 hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{chartLabels[type as keyof typeof chartLabels]}</span>
              </Button>
            );
          })}
        </div>
        
        {selectedType && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Visualización seleccionada:</strong> {chartLabels[selectedType as keyof typeof chartLabels]}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
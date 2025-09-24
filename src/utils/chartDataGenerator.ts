// Generador de datos coherentes para cada tipo de consulta SQL

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  data: any[];
  title: string;
  xAxis?: string;
  yAxis?: string;
}

export function generateCoherentChartData(sqlType: string, chartType: 'bar' | 'line' | 'pie' | 'area' | 'scatter'): ChartData[] {
  switch (sqlType) {
    case 'camas':
      return generateBedChartData(chartType);
    case 'pacientes':
      return generatePatientChartData(chartType);
    case 'emergencias':
      return generateEmergencyChartData(chartType);
    case 'quirofanos':
      return generateSurgeryChartData(chartType);
    case 'personal':
      return generateStaffChartData(chartType);
    case 'historial':
      return generateHistoryChartData(chartType);
    default:
      return generateBedChartData(chartType);
  }
}

function generateBedChartData(chartType: string): ChartData[] {
  const bedOccupancyData = [
    { unidad: 'UCI', ocupadas: 18, totales: 24, disponibles: 6, ocupacion: 75 },
    { unidad: 'Cardiología', ocupadas: 28, totales: 35, disponibles: 7, ocupacion: 80 },
    { unidad: 'Neurología', ocupadas: 22, totales: 30, disponibles: 8, ocupacion: 73 },
    { unidad: 'Traumatología', ocupadas: 32, totales: 40, disponibles: 8, ocupacion: 80 },
    { unidad: 'Pediatría', ocupadas: 15, totales: 25, disponibles: 10, ocupacion: 60 },
    { unidad: 'Emergencias', ocupadas: 45, totales: 50, disponibles: 5, ocupacion: 90 },
  ];

  switch (chartType) {
    case 'bar':
      return [{
        type: 'bar',
        data: bedOccupancyData,
        title: 'Ocupación de Camas por Unidad',
        xAxis: 'unidad',
        yAxis: 'cantidad'
      }];
    case 'pie':
      return [{
        type: 'pie',
        data: bedOccupancyData.map(item => ({
          name: item.unidad,
          value: item.ocupacion,
          color: item.ocupacion > 85 ? '#DC2626' : item.ocupacion > 70 ? '#F59E0B' : '#10B981'
        })),
        title: 'Porcentaje de Ocupación por Unidad'
      }];
    case 'line':
      return [{
        type: 'line',
        data: bedOccupancyData.map((item, index) => ({
          dia: `Día ${index + 1}`,
          ocupacion: item.ocupacion,
          tendencia: item.ocupacion + Math.random() * 10 - 5
        })),
        title: 'Tendencia de Ocupación Semanal'
      }];
    default:
      return generateBedChartData('bar');
  }
}

function generatePatientChartData(chartType: string): ChartData[] {
  const patientData = [
    { gravedad: 'Crítico', cantidad: 12, dias_promedio: 8.5, porcentaje: 15 },
    { gravedad: 'Grave', cantidad: 28, dias_promedio: 6.2, porcentaje: 35 },
    { gravedad: 'Moderado', cantidad: 32, dias_promedio: 4.1, porcentaje: 40 },
    { gravedad: 'Leve', cantidad: 8, dias_promedio: 2.3, porcentaje: 10 },
  ];

  switch (chartType) {
    case 'pie':
      return [{
        type: 'pie',
        data: patientData.map(item => ({
          name: item.gravedad,
          value: item.porcentaje,
          color: item.gravedad === 'Crítico' ? '#DC2626' : 
                 item.gravedad === 'Grave' ? '#F97316' :
                 item.gravedad === 'Moderado' ? '#F59E0B' : '#10B981'
        })),
        title: 'Distribución de Pacientes por Gravedad'
      }];
    case 'bar':
      return [{
        type: 'bar',
        data: patientData,
        title: 'Pacientes por Gravedad y Días de Estancia',
        xAxis: 'gravedad',
        yAxis: 'cantidad'
      }];
    case 'line':
      return [{
        type: 'line',
        data: patientData.map((item, index) => ({
          semana: `Sem ${index + 1}`,
          criticos: item.gravedad === 'Crítico' ? item.cantidad : Math.floor(Math.random() * 15 + 8),
          graves: item.gravedad === 'Grave' ? item.cantidad : Math.floor(Math.random() * 30 + 20)
        })),
        title: 'Evolución de Pacientes Críticos y Graves'
      }];
    default:
      return generatePatientChartData('pie');
  }
}

function generateEmergencyChartData(chartType: string): ChartData[] {
  const emergencyData = [
    { prioridad: 'Roja', cantidad: 15, tiempo_promedio: 8, resueltas: 14 },
    { prioridad: 'Amarilla', cantidad: 32, tiempo_promedio: 25, resueltas: 30 },
    { prioridad: 'Verde', cantidad: 28, tiempo_promedio: 45, resueltas: 28 },
    { prioridad: 'Azul', cantidad: 12, tiempo_promedio: 90, resueltas: 12 },
  ];

  const timeData = [
    { hora: '00-06', emergencias: 8, tiempo_promedio: 15 },
    { hora: '06-12', emergencias: 25, tiempo_promedio: 22 },
    { hora: '12-18', emergencias: 35, tiempo_promedio: 28 },
    { hora: '18-24', emergencias: 19, tiempo_promedio: 18 },
  ];

  switch (chartType) {
    case 'bar':
      return [{
        type: 'bar',
        data: emergencyData,
        title: 'Emergencias por Prioridad y Tiempo de Atención',
        xAxis: 'prioridad',
        yAxis: 'cantidad'
      }];
    case 'line':
      return [{
        type: 'line',
        data: timeData,
        title: 'Flujo de Emergencias por Horario',
        xAxis: 'hora',
        yAxis: 'emergencias'
      }];
    case 'pie':
      return [{
        type: 'pie',
        data: emergencyData.map(item => ({
          name: item.prioridad,
          value: item.cantidad,
          color: item.prioridad === 'Roja' ? '#DC2626' :
                 item.prioridad === 'Amarilla' ? '#F59E0B' :
                 item.prioridad === 'Verde' ? '#10B981' : '#3B82F6'
        })),
        title: 'Distribución de Emergencias por Prioridad'
      }];
    default:
      return generateEmergencyChartData('bar');
  }
}

function generateSurgeryChartData(chartType: string): ChartData[] {
  const surgeryData = [
    { quirofano: 'Q01', programadas: 4, completadas: 3, en_proceso: 1, disponible: true },
    { quirofano: 'Q02', programadas: 3, completadas: 3, en_proceso: 0, disponible: true },
    { quirofano: 'Q03', programadas: 5, completadas: 4, en_proceso: 1, disponible: false },
    { quirofano: 'Q04', programadas: 2, completadas: 2, en_proceso: 0, disponible: true },
    { quirofano: 'Q05', programadas: 0, completadas: 0, en_proceso: 0, disponible: false },
  ];

  const surgeryTypes = [
    { tipo: 'Cardiovascular', cantidad: 8, duracion_promedio: 180 },
    { tipo: 'Neurológica', cantidad: 5, duracion_promedio: 240 },
    { tipo: 'Traumatológica', cantidad: 12, duracion_promedio: 90 },
    { tipo: 'General', cantidad: 15, duracion_promedio: 60 },
  ];

  switch (chartType) {
    case 'bar':
      return [{
        type: 'bar',
        data: surgeryData,
        title: 'Estado de Quirófanos y Cirugías',
        xAxis: 'quirofano',
        yAxis: 'programadas'
      }];
    case 'pie':
      return [{
        type: 'pie',
        data: surgeryTypes.map(item => ({
          name: item.tipo,
          value: item.cantidad,
          color: '#' + Math.floor(Math.random()*16777215).toString(16)
        })),
        title: 'Distribución de Cirugías por Tipo'
      }];
    default:
      return generateSurgeryChartData('bar');
  }
}

function generateStaffChartData(chartType: string): ChartData[] {
  const staffData = [
    { especialidad: 'Cardiología', total: 12, activos: 10, emergencias: 8, experiencia: 8.5 },
    { especialidad: 'Neurología', total: 8, activos: 7, emergencias: 5, experiencia: 12.2 },
    { especialidad: 'Traumatología', total: 15, activos: 14, emergencias: 12, experiencia: 6.8 },
    { especialidad: 'Pediatría', total: 10, activos: 9, emergencias: 6, experiencia: 9.1 },
    { especialidad: 'Cuidados Intensivos', total: 18, activos: 16, emergencias: 16, experiencia: 10.5 },
  ];

  switch (chartType) {
    case 'bar':
      return [{
        type: 'bar',
        data: staffData,
        title: 'Personal Médico por Especialidad',
        xAxis: 'especialidad',
        yAxis: 'cantidad'
      }];
    case 'line':
      return [{
        type: 'line',
        data: staffData.map(item => ({
          especialidad: item.especialidad,
          experiencia: item.experiencia,
          disponibilidad: (item.emergencias / item.total) * 100
        })),
        title: 'Experiencia vs Disponibilidad por Especialidad'
      }];
    default:
      return generateStaffChartData('bar');
  }
}

function generateHistoryChartData(chartType: string): ChartData[] {
  const historyData = Array.from({ length: 30 }, (_, i) => ({
    fecha: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    ocupacion: Math.floor(Math.random() * 20 + 70),
    ingresos: Math.floor(Math.random() * 15 + 20),
    altas: Math.floor(Math.random() * 15 + 18),
    criticos: Math.floor(Math.random() * 8 + 5)
  }));

  switch (chartType) {
    case 'line':
      return [{
        type: 'line',
        data: historyData.slice(-14), // Últimos 14 días
        title: 'Tendencia de Ocupación - Últimas 2 Semanas',
        xAxis: 'fecha',
        yAxis: 'ocupacion'
      }];
    case 'area':
      return [{
        type: 'area',
        data: historyData.slice(-7), // Última semana
        title: 'Flujo de Ingresos y Altas - Última Semana',
        xAxis: 'fecha',
        yAxis: 'cantidad'
      }];
    default:
      return generateHistoryChartData('line');
  }
}

export function getRecommendedChartTypes(sqlType: string): string[] {
  switch (sqlType) {
    case 'camas':
      return ['bar', 'pie', 'line'];
    case 'pacientes':
      return ['pie', 'bar', 'line'];
    case 'emergencias':
      return ['bar', 'line', 'pie'];
    case 'quirofanos':
      return ['bar', 'pie'];
    case 'personal':
      return ['bar', 'line'];
    case 'historial':
      return ['line', 'area'];
    default:
      return ['bar', 'line', 'pie'];
  }
}
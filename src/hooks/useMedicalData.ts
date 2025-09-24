import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export function useMedicalData() {
  const [bedData, setBedData] = useState<BedOccupancyData[]>([]);
  const [flowData, setFlowData] = useState<PatientFlowData[]>([]);
  const [gravityData, setGravityData] = useState<GravityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicalData();
  }, []);

  const fetchMedicalData = async () => {
    try {
      setLoading(true);

      // Obtener datos de ocupación de camas por unidad
      const { data: unidades } = await supabase
        .from('unidades_medicas')
        .select(`
          nombre_unidad,
          capacidad_total,
          camas (
            estado,
            pacientes (
              estado_gravedad
            )
          )
        `);

      if (unidades) {
        const processedData = unidades.map(unit => {
          const ocupadas = unit.camas?.filter((cama: any) => cama.estado === 'ocupada').length || 0;
          const criticos = unit.camas?.filter((cama: any) => 
            cama.pacientes?.[0]?.estado_gravedad === 'critico'
          ).length || 0;
          
          return {
            name: unit.nombre_unidad.split(' - ')[0] || unit.nombre_unidad,
            camas_ocupadas: ocupadas,
            camas_totales: unit.capacidad_total,
            pacientes_criticos: criticos
          };
        });
        setBedData(processedData);
      }

      // Obtener datos de distribución por gravedad
      const { data: patients } = await supabase
        .from('pacientes')
        .select('estado_gravedad')
        .is('fecha_alta', null); // Solo pacientes activos

      if (patients) {
        const gravityCount = patients.reduce((acc, patient) => {
          acc[patient.estado_gravedad] = (acc[patient.estado_gravedad] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const total = patients.length;
        const gravityStats = [
          { name: 'Leve', value: Math.round(((gravityCount.leve || 0) / total) * 100), color: '#10B981' },
          { name: 'Moderado', value: Math.round(((gravityCount.moderado || 0) / total) * 100), color: '#F59E0B' },
          { name: 'Grave', value: Math.round(((gravityCount.grave || 0) / total) * 100), color: '#F97316' },
          { name: 'Crítico', value: Math.round(((gravityCount.critico || 0) / total) * 100), color: '#DC2626' },
        ];
        setGravityData(gravityStats);
      }

      // Obtener datos de flujo de pacientes (últimos 7 días)
      const { data: emergencies } = await supabase
        .from('emergencias')
        .select('fecha_ingreso, estado')
        .gte('fecha_ingreso', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (emergencies) {
        const flowStats = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
          const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
          
          const dayEmergencies = emergencies.filter(em => {
            const emDate = new Date(em.fecha_ingreso);
            return emDate.toDateString() === date.toDateString();
          });

          return {
            name: dayName.charAt(0).toUpperCase() + dayName.slice(1),
            ingresos: dayEmergencies.length,
            altas: dayEmergencies.filter(em => em.estado === 'atendido').length
          };
        });
        setFlowData(flowStats);
      }

    } catch (error) {
      console.error('Error fetching medical data:', error);
      // Usar datos de respaldo en caso de error
      setBedData([
        { name: 'UCI', camas_ocupadas: 18, camas_totales: 24, pacientes_criticos: 12 },
        { name: 'Cardiología', camas_ocupadas: 28, camas_totales: 35, pacientes_criticos: 8 },
        { name: 'Neurología', camas_ocupadas: 22, camas_totales: 30, pacientes_criticos: 15 },
      ]);
      setFlowData([
        { name: 'Lun', ingresos: 45, altas: 38 },
        { name: 'Mar', ingresos: 52, altas: 41 },
        { name: 'Mie', ingresos: 48, altas: 45 },
      ]);
      setGravityData([
        { name: 'Leve', value: 45, color: '#10B981' },
        { name: 'Moderado', value: 28, color: '#F59E0B' },
        { name: 'Grave', value: 18, color: '#F97316' },
        { name: 'Crítico', value: 9, color: '#DC2626' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { bedData, flowData, gravityData, loading, refetch: fetchMedicalData };
}
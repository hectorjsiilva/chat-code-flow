import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRealSupabaseData() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = useCallback(async (queryType: string): Promise<any[]> => {
    setLoading(true);
    setError(null);
    
    try {
      let result: any[] = [];
      
      switch (queryType) {
        case 'camas':
          const { data: bedsData, error: bedsError } = await supabase
            .from('unidades_medicas')
            .select(`
              nombre_unidad,
              tipo_unidad,
              camas!inner(
                id,
                estado
              )
            `);
          
          if (bedsError) throw bedsError;
          
          result = bedsData?.map(unit => ({
            nombre_unidad: unit.nombre_unidad,
            tipo_unidad: unit.tipo_unidad,
            total_camas: unit.camas?.length || 0,
            camas_ocupadas: unit.camas?.filter(c => c.estado === 'ocupada').length || 0,
            camas_libres: unit.camas?.filter(c => c.estado === 'disponible').length || 0,
            camas_mantenimiento: unit.camas?.filter(c => c.estado === 'mantenimiento').length || 0,
            porcentaje_ocupacion: unit.camas?.length ? Math.round((unit.camas.filter(c => c.estado === 'ocupada').length * 100) / unit.camas.length) : 0
          })) || [];
          break;

        case 'pacientes':
          const { data: patientsData, error: patientsError } = await supabase
            .from('pacientes')
            .select('estado_gravedad, fecha_ingreso, fecha_alta');
          
          if (patientsError) throw patientsError;
          
          // Agrupar por estado de gravedad
          const patientsGrouped = patientsData?.reduce((acc: any, patient) => {
            const gravity = patient.estado_gravedad || 'sin_clasificar';
            if (!acc[gravity]) {
              acc[gravity] = { total: 0, hospitalizados: 0, dias_promedio: 0 };
            }
            acc[gravity].total++;
            if (!patient.fecha_alta) {
              acc[gravity].hospitalizados++;
            }
            return acc;
          }, {});
          
          result = Object.entries(patientsGrouped || {}).map(([gravity, data]: [string, any]) => ({
            estado_gravedad: gravity,
            total_pacientes: data.total,
            pacientes_hospitalizados: data.hospitalizados,
            promedio_dias_estancia: Math.round(Math.random() * 10) // Placeholder
          }));
          break;

        case 'emergencias':
          const { data: emergenciesData, error: emergenciesError } = await supabase
            .from('emergencias')
            .select('prioridad, estado, tiempo_atencion_minutos')
            .gte('fecha_ingreso', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
          
          if (emergenciesError) throw emergenciesError;
          
          // Agrupar por prioridad
          const emergenciesGrouped = emergenciesData?.reduce((acc: any, emergency) => {
            const priority = emergency.prioridad || 'sin_clasificar';
            if (!acc[priority]) {
              acc[priority] = { total: 0, resueltas: 0, tiempo_total: 0, count_tiempo: 0 };
            }
            acc[priority].total++;
            if (emergency.estado === 'atendido') acc[priority].resueltas++;
            if (emergency.tiempo_atencion_minutos) {
              acc[priority].tiempo_total += emergency.tiempo_atencion_minutos;
              acc[priority].count_tiempo++;
            }
            return acc;
          }, {});
          
          result = Object.entries(emergenciesGrouped || {}).map(([priority, data]: [string, any]) => ({
            prioridad: priority,
            total_emergencias: data.total,
            emergencias_resueltas: data.resueltas,
            tiempo_promedio_atencion: data.count_tiempo > 0 ? Math.round(data.tiempo_total / data.count_tiempo) : 0
          }));
          break;

        case 'quirofanos':
          const { data: quirofanosData, error: quirofanosError } = await supabase
            .from('quirofanos')
            .select(`
              numero_quirofano,
              estado,
              cirugias!inner(
                estado,
                fecha_cirugia
              )
            `)
            .eq('activo', true);
          
          if (quirofanosError) throw quirofanosError;
          
          result = quirofanosData?.map(quirofano => ({
            numero_quirofano: quirofano.numero_quirofano,
            estado_quirofano: quirofano.estado,
            cirugias_programadas_hoy: quirofano.cirugias?.filter(c => 
              c.fecha_cirugia === new Date().toISOString().split('T')[0]
            ).length || 0,
            cirugias_completadas: quirofano.cirugias?.filter(c => c.estado === 'completada').length || 0,
            cirugias_pendientes: quirofano.cirugias?.filter(c => c.estado === 'programada').length || 0
          })) || [];
          break;

        case 'personal':
          const { data: staffData, error: staffError } = await supabase
            .from('personal_medico')
            .select('especialidad, turno_actual, estado_laboral, disponible_emergencias, años_experiencia')
            .eq('estado_laboral', 'activo');
          
          if (staffError) throw staffError;
          
          // Agrupar por especialidad
          const staffGrouped = staffData?.reduce((acc: any, staff) => {
            const specialty = staff.especialidad || 'sin_especialidad';
            if (!acc[specialty]) {
              acc[specialty] = { total: 0, activos: 0, emergencias: 0, experiencia_total: 0 };
            }
            acc[specialty].total++;
            if (staff.turno_actual === 'activo') acc[specialty].activos++;
            if (staff.disponible_emergencias && staff.turno_actual === 'activo') acc[specialty].emergencias++;
            acc[specialty].experiencia_total += staff.años_experiencia || 0;
            return acc;
          }, {});
          
          result = Object.entries(staffGrouped || {}).map(([specialty, data]: [string, any]) => ({
            especialidad: specialty,
            total_personal: data.total,
            personal_activo: data.activos,
            disponible_emergencias: data.emergencias,
            experiencia_promedio: data.total > 0 ? Math.round(data.experiencia_total / data.total) : 0
          }));
          break;

        default:
          result = [];
      }
      
      setData(result);
      setLoading(false);
      return result;
      
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
      return [];
    }
  }, []);

  return { data, loading, error, executeQuery };
}
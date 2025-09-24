import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface QueryResult {
  data: any[] | null;
  error: string | null;
  loading: boolean;
}

export function useSupabaseQuery() {
  const [result, setResult] = useState<QueryResult>({
    data: null,
    error: null,
    loading: false
  });

  const executeQuery = async (query: string): Promise<any[]> => {
    setResult({ data: null, error: null, loading: true });
    
    try {
      const result = await executeDirectQuery(query);
      setResult({ data: result, error: null, loading: false });
      return result;
    } catch (error) {
      console.error('Query execution error:', error);
      setResult({ data: null, error: 'Error ejecutando consulta', loading: false });
      return [];
    }
  };

  const executeDirectQuery = async (query: string): Promise<any[]> => {
    // Analizar el tipo de consulta y ejecutar la correspondiente
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('unidades_medicas') && lowerQuery.includes('camas')) {
      // Consulta de ocupación de camas
      const { data: units } = await supabase
        .from('unidades_medicas')
        .select(`
          nombre_unidad,
          tipo_unidad,
          capacidad_total,
          camas:camas(estado)
        `);
      
      return units?.map(unit => ({
        nombre_unidad: unit.nombre_unidad,
        tipo_unidad: unit.tipo_unidad,
        total_camas: unit.capacidad_total,
        camas_ocupadas: unit.camas?.filter((c: any) => c.estado === 'ocupada').length || 0,
        camas_libres: unit.camas?.filter((c: any) => c.estado === 'disponible').length || 0,
        camas_mantenimiento: unit.camas?.filter((c: any) => c.estado === 'mantenimiento').length || 0,
        porcentaje_ocupacion: Math.round(
          ((unit.camas?.filter((c: any) => c.estado === 'ocupada').length || 0) / unit.capacidad_total) * 100
        )
      })) || [];
    }
    
    if (lowerQuery.includes('pacientes') && lowerQuery.includes('gravedad')) {
      // Consulta de pacientes por gravedad
      const { data } = await supabase
        .from('pacientes')
        .select('estado_gravedad, fecha_ingreso, fecha_alta');
      
      const groupedData = data?.reduce((acc: any, patient: any) => {
        const gravedad = patient.estado_gravedad || 'leve';
        if (!acc[gravedad]) {
          acc[gravedad] = { count: 0, totalDays: 0 };
        }
        acc[gravedad].count++;
        
        const ingreso = new Date(patient.fecha_ingreso);
        const alta = patient.fecha_alta ? new Date(patient.fecha_alta) : new Date();
        const days = Math.ceil((alta.getTime() - ingreso.getTime()) / (1000 * 60 * 60 * 24));
        acc[gravedad].totalDays += days;
        
        return acc;
      }, {});
      
      return Object.entries(groupedData || {}).map(([gravedad, data]: [string, any]) => ({
        estado_gravedad: gravedad,
        total_pacientes: data.count,
        pacientes_hospitalizados: data.count, // Simplificado
        promedio_dias_estancia: Math.round((data.totalDays / data.count) * 10) / 10
      }));
    }
    
    if (lowerQuery.includes('emergencias') && lowerQuery.includes('prioridad')) {
      // Consulta de emergencias
      const { data } = await supabase
        .from('emergencias')
        .select('prioridad, tiempo_atencion_minutos, estado')
        .gte('fecha_ingreso', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      
      const groupedData = data?.reduce((acc: any, emergency: any) => {
        const prioridad = emergency.prioridad || 'verde';
        if (!acc[prioridad]) {
          acc[prioridad] = { 
            total: 0, 
            tiempos: [], 
            atendidos: 0, 
            derivados: 0 
          };
        }
        acc[prioridad].total++;
        if (emergency.tiempo_atencion_minutos) {
          acc[prioridad].tiempos.push(emergency.tiempo_atencion_minutos);
        }
        if (emergency.estado === 'atendido') acc[prioridad].atendidos++;
        if (emergency.estado === 'derivado') acc[prioridad].derivados++;
        
        return acc;
      }, {});
      
      return Object.entries(groupedData || {}).map(([prioridad, data]: [string, any]) => ({
        prioridad,
        total_emergencias: data.total,
        tiempo_promedio_atencion: data.tiempos.length > 0 
          ? Math.round((data.tiempos.reduce((a: number, b: number) => a + b, 0) / data.tiempos.length) * 10) / 10
          : 0,
        emergencias_resueltas: data.atendidos,
        emergencias_derivadas: data.derivados
      }));
    }
    
    if (lowerQuery.includes('quirofanos')) {
      // Consulta de quirófanos
      const { data: quirofanos } = await supabase
        .from('quirofanos')
        .select(`
          numero_quirofano,
          estado,
          activo,
          cirugias:cirugias!inner(estado, tipo_cirugia)
        `)
        .eq('activo', true);
      
      return quirofanos?.map(q => ({
        numero_quirofano: q.numero_quirofano,
        estado_quirofano: q.estado,
        cirugias_programadas_hoy: q.cirugias?.length || 0,
        cirugias_completadas: q.cirugias?.filter((c: any) => c.estado === 'completada').length || 0,
        cirugias_en_proceso: q.cirugias?.filter((c: any) => c.estado === 'en_proceso').length || 0,
        cirugias_pendientes: q.cirugias?.filter((c: any) => c.estado === 'programada').length || 0
      })) || [];
    }
    
    if (lowerQuery.includes('personal_medico')) {
      // Consulta de personal médico
      const { data } = await supabase
        .from('personal_medico')
        .select('especialidad, turno_actual, disponible_emergencias, años_experiencia, nombre, apellido')
        .eq('estado_laboral', 'activo');
      
      const groupedData = data?.reduce((acc: any, person: any) => {
        const especialidad = person.especialidad || 'General';
        if (!acc[especialidad]) {
          acc[especialidad] = { 
            total: 0, 
            activos: 0, 
            emergencias: 0, 
            experiencias: [],
            nombres: []
          };
        }
        acc[especialidad].total++;
        if (person.turno_actual === 'activo') acc[especialidad].activos++;
        if (person.disponible_emergencias && person.turno_actual === 'activo') {
          acc[especialidad].emergencias++;
        }
        acc[especialidad].experiencias.push(person.años_experiencia || 0);
        acc[especialidad].nombres.push(`${person.nombre} ${person.apellido}`);
        
        return acc;
      }, {});
      
      return Object.entries(groupedData || {}).map(([especialidad, data]: [string, any]) => ({
        especialidad,
        total_personal: data.total,
        personal_activo: data.activos,
        disponible_emergencias: data.emergencias,
        experiencia_promedio: Math.round(
          (data.experiencias.reduce((a: number, b: number) => a + b, 0) / data.experiencias.length) * 10
        ) / 10
      }));
    }
    
    if (lowerQuery.includes('historial_ocupacion_camas')) {
      // Consulta histórica
      const { data } = await supabase
        .from('historial_ocupacion_camas')
        .select('fecha_ocupacion, fecha_liberacion, estado_durante_ocupacion, cama_id')
        .gte('fecha_ocupacion', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('fecha_ocupacion', { ascending: false })
        .limit(30);
      
      const groupedByDate = data?.reduce((acc: any, record: any) => {
        const date = new Date(record.fecha_ocupacion).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { 
            camas_ocupadas: new Set(), 
            criticos: 0, 
            graves: 0, 
            moderados: 0,
            altas: 0
          };
        }
        acc[date].camas_ocupadas.add(record.cama_id);
        
        if (record.estado_durante_ocupacion === 'critico') acc[date].criticos++;
        if (record.estado_durante_ocupacion === 'grave') acc[date].graves++;
        if (record.estado_durante_ocupacion === 'moderado') acc[date].moderados++;
        
        if (record.fecha_liberacion && 
            new Date(record.fecha_liberacion).toISOString().split('T')[0] === date) {
          acc[date].altas++;
        }
        
        return acc;
      }, {});
      
      return Object.entries(groupedByDate || {}).map(([fecha, data]: [string, any]) => ({
        fecha,
        camas_ocupadas_dia: data.camas_ocupadas.size,
        pacientes_criticos: data.criticos,
        pacientes_graves: data.graves,
        pacientes_moderados: data.moderados,
        altas_mismo_dia: data.altas
      })).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 30);
    }
    
    return [];
  };

  return { result, executeQuery };
}
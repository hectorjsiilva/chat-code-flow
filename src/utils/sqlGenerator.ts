// Generador de consultas SQL coherentes con prompts médicos

interface SQLTemplate {
  keywords: string[];
  query: string;
  description: string;
}

const sqlTemplates: SQLTemplate[] = [
  {
    keywords: ['camas', 'ocupación', 'disponibles', 'libres', 'unidad'],
    query: `-- Consulta de ocupación de camas por unidad médica
SELECT 
    um.nombre_unidad,
    um.tipo_unidad,
    COUNT(c.id) as total_camas,
    COUNT(CASE WHEN c.estado = 'ocupada' THEN 1 END) as camas_ocupadas,
    COUNT(CASE WHEN c.estado = 'disponible' THEN 1 END) as camas_libres,
    COUNT(CASE WHEN c.estado = 'mantenimiento' THEN 1 END) as camas_mantenimiento,
    ROUND((COUNT(CASE WHEN c.estado = 'ocupada' THEN 1 END) * 100.0 / COUNT(c.id)), 2) as porcentaje_ocupacion
FROM unidades_medicas um
LEFT JOIN camas c ON um.id = c.unidad_id
WHERE um.activa = true
GROUP BY um.id, um.nombre_unidad, um.tipo_unidad
ORDER BY porcentaje_ocupacion DESC;`,
    description: 'Consulta sobre ocupación de camas por unidad'
  },
  {
    keywords: ['pacientes', 'gravedad', 'crítico', 'grave', 'leve', 'moderado'],
    query: `-- Análisis de pacientes por gravedad y días de estancia
SELECT 
    p.estado_gravedad,
    COUNT(*) as total_pacientes,
    COUNT(CASE WHEN p.fecha_alta IS NULL THEN 1 END) as pacientes_hospitalizados,
    ROUND(AVG(EXTRACT(DAY FROM (NOW() - p.fecha_ingreso))), 1) as promedio_dias_estancia,
    MIN(p.fecha_ingreso) as primer_ingreso,
    MAX(p.fecha_ingreso) as ultimo_ingreso
FROM pacientes p
WHERE p.fecha_ingreso >= NOW() - INTERVAL '30 days'
GROUP BY p.estado_gravedad
ORDER BY 
    CASE p.estado_gravedad 
        WHEN 'critico' THEN 1
        WHEN 'grave' THEN 2  
        WHEN 'moderado' THEN 3
        WHEN 'leve' THEN 4
    END;`,
    description: 'Análisis de pacientes por nivel de gravedad'
  },
  {
    keywords: ['emergencias', 'urgencias', 'prioridad', 'tiempo', 'atención'],
    query: `-- Reporte de emergencias por prioridad y tiempo de atención
SELECT 
    e.prioridad,
    COUNT(*) as total_emergencias,
    ROUND(AVG(e.tiempo_atencion_minutos), 1) as tiempo_promedio_atencion,
    MIN(e.tiempo_atencion_minutos) as tiempo_minimo,
    MAX(e.tiempo_atencion_minutos) as tiempo_maximo,
    COUNT(CASE WHEN e.estado = 'atendido' THEN 1 END) as emergencias_resueltas,
    COUNT(CASE WHEN e.estado = 'derivado' THEN 1 END) as emergencias_derivadas
FROM emergencias e
WHERE e.fecha_ingreso >= NOW() - INTERVAL '7 days'
GROUP BY e.prioridad
ORDER BY 
    CASE e.prioridad 
        WHEN 'roja' THEN 1
        WHEN 'amarilla' THEN 2
        WHEN 'verde' THEN 3
        WHEN 'azul' THEN 4
    END;`,
    description: 'Reporte de emergencias por prioridad'
  },
  {
    keywords: ['quirófanos', 'cirugías', 'operaciones', 'quirófano', 'sala'],
    query: `-- Estado actual de quirófanos y cirugías programadas
SELECT 
    q.numero_quirofano,
    q.estado as estado_quirofano,
    COUNT(c.id) as cirugias_programadas_hoy,
    COUNT(CASE WHEN c.estado = 'completada' THEN 1 END) as cirugias_completadas,
    COUNT(CASE WHEN c.estado = 'en_proceso' THEN 1 END) as cirugias_en_proceso,
    COUNT(CASE WHEN c.estado = 'programada' THEN 1 END) as cirugias_pendientes,
    STRING_AGG(DISTINCT c.tipo_cirugia, ', ') as tipos_cirugia_hoy
FROM quirofanos q
LEFT JOIN cirugias c ON q.id = c.quirofano_id 
    AND c.fecha_cirugia = CURRENT_DATE
WHERE q.activo = true
GROUP BY q.id, q.numero_quirofano, q.estado
ORDER BY q.numero_quirofano;`,
    description: 'Estado de quirófanos y programación de cirugías'
  },
  {
    keywords: ['personal', 'médico', 'doctores', 'especialidad', 'turno'],
    query: `-- Personal médico disponible por especialidad y turno
SELECT 
    pm.especialidad,
    COUNT(*) as total_personal,
    COUNT(CASE WHEN pm.turno_actual = 'activo' THEN 1 END) as personal_activo,
    COUNT(CASE WHEN pm.disponible_emergencias = true AND pm.turno_actual = 'activo' THEN 1 END) as disponible_emergencias,
    ROUND(AVG(pm.años_experiencia), 1) as experiencia_promedio,
    STRING_AGG(DISTINCT pm.nombre || ' ' || pm.apellido, ', ') as nombres_personal
FROM personal_medico pm
WHERE pm.estado_laboral = 'activo'
GROUP BY pm.especialidad
ORDER BY personal_activo DESC, total_personal DESC;`,
    description: 'Personal médico por especialidad'
  },
  {
    keywords: ['historial', 'ocupación', 'tendencia', 'días', 'estadística'],
    query: `-- Histórico de ocupación de camas últimos 30 días
SELECT 
    DATE(hoc.fecha_ocupacion) as fecha,
    COUNT(DISTINCT hoc.cama_id) as camas_ocupadas_dia,
    COUNT(CASE WHEN hoc.estado_durante_ocupacion = 'critico' THEN 1 END) as pacientes_criticos,
    COUNT(CASE WHEN hoc.estado_durante_ocupacion = 'grave' THEN 1 END) as pacientes_graves,
    COUNT(CASE WHEN hoc.estado_durante_ocupacion = 'moderado' THEN 1 END) as pacientes_moderados,
    COUNT(CASE WHEN hoc.fecha_liberacion IS NOT NULL 
          AND DATE(hoc.fecha_liberacion) = DATE(hoc.fecha_ocupacion) THEN 1 END) as altas_mismo_dia
FROM historial_ocupacion_camas hoc
WHERE hoc.fecha_ocupacion >= NOW() - INTERVAL '30 days'
GROUP BY DATE(hoc.fecha_ocupacion)
ORDER BY fecha DESC
LIMIT 30;`,
    description: 'Histórico de ocupación de camas'
  }
];

export function generateCoherentSQL(prompt: string): { query: string; description: string } {
  const lowerPrompt = prompt.toLowerCase();
  
  // Buscar el template que mejor coincida con el prompt
  const matchedTemplate = sqlTemplates.find(template => 
    template.keywords.some(keyword => lowerPrompt.includes(keyword))
  );
  
  if (matchedTemplate) {
    return {
      query: matchedTemplate.query,
      description: matchedTemplate.description
    };
  }
  
  // Si no hay coincidencia exacta, devolver una consulta general
  return {
    query: sqlTemplates[0].query, // Consulta de camas por defecto
    description: 'Consulta general de ocupación hospitalaria'
  };
}

export function getSuggestedPrompts(): string[] {
  return [
    "Muestra el estado actual de ocupación de camas por unidad",
    "Análisis de pacientes críticos y graves hospitalizados",
    "Reporte de emergencias rojas y amarillas de esta semana",
    "Estado de quirófanos y cirugías programadas para hoy",
    "Personal médico disponible para emergencias por especialidad",
    "Tendencia de ocupación de camas en los últimos 30 días",
    "Pacientes con mayor tiempo de hospitalización",
    "Quirófanos en mantenimiento y su impacto",
  ];
}
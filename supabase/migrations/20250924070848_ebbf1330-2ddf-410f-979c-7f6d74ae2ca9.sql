-- Añadir más cirugías programadas
INSERT INTO cirugias (fecha_cirugia, tipo_cirugia, estado, hora_inicio, hora_fin, quirofano_id) 
SELECT 
    CURRENT_DATE + (CASE (random() * 3)::int WHEN 0 THEN 0 WHEN 1 THEN 1 ELSE -1 END) * INTERVAL '1 day',
    CASE (random() * 8)::int
        WHEN 0 THEN 'Apendicectomía'
        WHEN 1 THEN 'Colecistectomía'  
        WHEN 2 THEN 'Hernia inguinal'
        WHEN 3 THEN 'Bypass coronario'
        WHEN 4 THEN 'Reemplazo rodilla'
        WHEN 5 THEN 'Cesaría'
        WHEN 6 THEN 'Catarata'
        ELSE 'Artroscopia'
    END,
    CASE (random() * 3)::int
        WHEN 0 THEN 'completada'
        WHEN 1 THEN 'en_proceso'
        ELSE 'programada'
    END,
    ('06:00'::time + (random() * 12 * 60)::int * INTERVAL '1 minute'),
    ('08:00'::time + (random() * 14 * 60)::int * INTERVAL '1 minute'),
    q.id
FROM quirofanos q
WHERE q.activo = true
AND random() < 0.8; -- 80% de los quirófanos tendrán cirugías adicionales

-- Generar mucho historial de ocupación de camas (últimos 60 días)
INSERT INTO historial_ocupacion_camas (cama_id, fecha_ocupacion, fecha_liberacion, estado_durante_ocupacion)
SELECT 
    c.id,
    NOW() - (random() * 60 || ' days')::interval - (random() * 12 || ' hours')::interval,
    CASE 
        WHEN random() < 0.75 THEN NOW() - (random() * 55 || ' days')::interval - (random() * 12 || ' hours')::interval
        ELSE NULL
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'critico'
        WHEN 1 THEN 'grave'  
        WHEN 2 THEN 'moderado'
        ELSE 'leve'
    END
FROM camas c
WHERE random() < 0.9; -- 90% de las camas tendrán historial
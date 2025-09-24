-- Insertar datos de muestra en unidades médicas
INSERT INTO unidades_medicas (nombre_unidad, tipo_unidad, capacidad_total) VALUES
('UCI Adultos', 'Cuidados Intensivos', 20),
('UCI Pediátrica', 'Cuidados Intensivos', 15),
('Emergencias', 'Emergencias', 30),
('Cirugía General', 'Hospitalización', 25),
('Medicina Interna', 'Hospitalización', 35),
('Cardiología', 'Especialidad', 18),
('Neurología', 'Especialidad', 22);

-- Insertar camas para cada unidad
INSERT INTO camas (numero_cama, tipo_cama, estado, unidad_id)
SELECT 
    um.nombre_unidad || '-' || generate_series(1, um.capacidad_total),
    CASE 
        WHEN um.tipo_unidad = 'Cuidados Intensivos' THEN 'uci'
        WHEN um.tipo_unidad = 'Emergencias' THEN 'emergencia'
        ELSE 'standard'
    END,
    CASE 
        WHEN random() < 0.7 THEN 'ocupada'
        WHEN random() < 0.85 THEN 'disponible'
        ELSE 'mantenimiento'
    END,
    um.id
FROM unidades_medicas um;

-- Insertar quirófanos
INSERT INTO quirofanos (numero_quirofano, estado, activo, tipo_cirugia_actual) VALUES
('QX-01', 'ocupado', true, 'Cirugía General'),
('QX-02', 'disponible', true, NULL),
('QX-03', 'en_proceso', true, 'Cardiocirugía'),
('QX-04', 'mantenimiento', false, NULL),
('QX-05', 'disponible', true, NULL);

-- Insertar personal médico
INSERT INTO personal_medico (numero_empleado, nombre, apellido, especialidad, años_experiencia, turno_actual, estado_laboral, disponible_emergencias) VALUES
('MED001', 'Dr. Carlos', 'Rodriguez', 'Cardiología', 15, 'activo', 'activo', true),
('MED002', 'Dra. Ana', 'García', 'Emergencias', 8, 'activo', 'activo', true),
('MED003', 'Dr. Luis', 'Martinez', 'Cirugía General', 12, 'descanso', 'activo', false),
('MED004', 'Dra. Maria', 'Lopez', 'UCI', 10, 'activo', 'activo', true),
('MED005', 'Dr. Jorge', 'Fernandez', 'Neurología', 18, 'activo', 'activo', false);

-- Insertar emergencias
INSERT INTO emergencias (numero_emergencia, prioridad, estado, tiempo_atencion_minutos, diagnostico_emergencia, fecha_ingreso) VALUES
('EMG001', 'roja', 'atendido', 15, 'Infarto agudo', NOW() - INTERVAL '2 hours'),
('EMG002', 'amarilla', 'en_atencion', 45, 'Fractura de brazo', NOW() - INTERVAL '1 hour'),
('EMG003', 'verde', 'derivado', 120, 'Dolor abdominal', NOW() - INTERVAL '3 hours'),
('EMG004', 'roja', 'atendido', 8, 'Paro cardíaco', NOW() - INTERVAL '4 hours'),
('EMG005', 'azul', 'atendido', 180, 'Consulta rutinaria', NOW() - INTERVAL '6 hours');

-- Insertar cirugías programadas
INSERT INTO cirugias (fecha_cirugia, tipo_cirugia, estado, hora_inicio, hora_fin, quirofano_id) 
SELECT 
    CURRENT_DATE,
    CASE (random() * 4)::int
        WHEN 0 THEN 'Apendicectomía'
        WHEN 1 THEN 'Colecistectomía'  
        WHEN 2 THEN 'Hernia inguinal'
        ELSE 'Cirugía menor'
    END,
    CASE (random() * 3)::int
        WHEN 0 THEN 'completada'
        WHEN 1 THEN 'en_proceso'
        ELSE 'programada'
    END,
    '08:00'::time + (random() * 10 || ' hours')::interval,
    '08:00'::time + (random() * 12 || ' hours')::interval,
    q.id
FROM quirofanos q
WHERE q.activo = true;

-- Insertar historial de ocupación de camas (últimos 30 días)
INSERT INTO historial_ocupacion_camas (cama_id, fecha_ocupacion, fecha_liberacion, estado_durante_ocupacion)
SELECT 
    c.id,
    NOW() - (random() * 30 || ' days')::interval,
    CASE 
        WHEN random() < 0.7 THEN NOW() - (random() * 25 || ' days')::interval
        ELSE NULL
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'critico'
        WHEN 1 THEN 'grave'  
        WHEN 2 THEN 'moderado'
        ELSE 'leve'
    END
FROM camas c
WHERE random() < 0.8;
-- Poblar datos de muestra de forma más simple

-- Insertar algunos pacientes de muestra
INSERT INTO public.pacientes (numero_historia, nombre, apellido, fecha_nacimiento, genero, telefono, estado_gravedad, fecha_ingreso, diagnostico_principal, medico_responsable) VALUES
('H000001', 'Ana', 'García', '1980-05-15', 'F', '+59521234567', 'critico', NOW() - INTERVAL '2 days', 'Infarto agudo de miocardio', 'Dr. Carlos López'),
('H000002', 'José', 'Martín', '1965-03-22', 'M', '+59521234568', 'grave', NOW() - INTERVAL '1 day', 'Accidente cerebrovascular', 'Dr. María González'),
('H000003', 'Carmen', 'Rodríguez', '1992-11-08', 'F', '+59521234569', 'moderado', NOW() - INTERVAL '3 hours', 'Neumonía', 'Dr. Luis Pérez'),
('H000004', 'Miguel', 'Torres', '1988-07-14', 'M', '+59521234570', 'leve', NOW() - INTERVAL '6 hours', 'Gastroenteritis', 'Dr. Elena Sánchez'),
('H000005', 'Laura', 'Flores', '1975-09-30', 'F', '+59521234571', 'critico', NOW() - INTERVAL '4 days', 'Sepsis', 'Dr. Rafael Ruiz'),
('H000006', 'Pedro', 'Rivera', '1958-12-03', 'M', '+59521234572', 'grave', NOW() - INTERVAL '1 day', 'EPOC reagudizado', 'Dr. Sofia Ramírez'),
('H000007', 'Isabel', 'Gómez', '1983-04-18', 'F', '+59521234573', 'moderado', NOW() - INTERVAL '8 hours', 'Apendicitis aguda', 'Dr. Antonio Díaz'),
('H000008', 'Juan', 'Morales', '1990-08-25', 'M', '+59521234574', 'leve', NOW() - INTERVAL '2 hours', 'Cefalea', 'Dr. Patricia Ortiz'),
('H000009', 'Cristina', 'Delgado', '1968-06-12', 'F', '+59521234575', 'grave', NOW() - INTERVAL '5 days', 'Insuficiencia cardíaca', 'Dr. Diego Castro'),
('H000010', 'Javier', 'Herrera', '1995-10-07', 'M', '+59521234576', 'critico', NOW() - INTERVAL '3 days', 'Traumatismo craneoencefálico', 'Dr. Lucía Vega');

-- Insertar emergencias de muestra
INSERT INTO public.emergencias (numero_emergencia, fecha_ingreso, prioridad, tiempo_atencion_minutos, diagnostico_emergencia, estado) VALUES
('EMG000001', NOW() - INTERVAL '1 hour', 'roja', 15, 'Paro cardíaco', 'atendido'),
('EMG000002', NOW() - INTERVAL '2 hours', 'amarilla', 45, 'Dolor torácico', 'atendido'),
('EMG000003', NOW() - INTERVAL '3 hours', 'verde', 90, 'Herida menor', 'atendido'),
('EMG000004', NOW() - INTERVAL '4 hours', 'roja', 8, 'Shock hipovolémico', 'derivado'),
('EMG000005', NOW() - INTERVAL '5 hours', 'amarilla', 60, 'Fractura de muñeca', 'atendido'),
('EMG000006', NOW() - INTERVAL '6 hours', 'azul', 120, 'Consulta general', 'atendido'),
('EMG000007', NOW() - INTERVAL '7 hours', 'roja', 12, 'Convulsiones', 'derivado'),
('EMG000008', NOW() - INTERVAL '8 hours', 'verde', 75, 'Contusión', 'atendido'),
('EMG000009', NOW() - INTERVAL '9 hours', 'amarilla', 55, 'Dificultad respiratoria', 'atendido'),
('EMG000010', NOW() - INTERVAL '10 hours', 'verde', 95, 'Dolor abdominal leve', 'atendido');

-- Actualizar algunas camas como ocupadas por pacientes específicos
UPDATE public.camas SET estado = 'ocupada' WHERE id IN (
    SELECT id FROM public.camas LIMIT 180
);

-- Insertar historial de ocupación
DO $$
DECLARE 
    cama_rec RECORD;
    patient_ids UUID[] := ARRAY(SELECT id FROM public.pacientes LIMIT 10);
    counter INTEGER := 1;
BEGIN
    FOR cama_rec IN SELECT id FROM public.camas WHERE estado = 'ocupada' LIMIT 10 LOOP
        INSERT INTO public.historial_ocupacion_camas (cama_id, paciente_id, fecha_ocupacion, estado_durante_ocupacion)
        VALUES (
            cama_rec.id, 
            patient_ids[counter],
            NOW() - INTERVAL '1 day' * counter,
            CASE counter % 4
                WHEN 0 THEN 'critico'
                WHEN 1 THEN 'grave'  
                WHEN 2 THEN 'moderado'
                ELSE 'leve'
            END
        );
        counter := counter + 1;
        IF counter > array_length(patient_ids, 1) THEN
            counter := 1;
        END IF;
    END LOOP;
END $$;
-- Añadir más personal médico con especialidades cortas
INSERT INTO personal_medico (numero_empleado, nombre, apellido, especialidad, años_experiencia, turno_actual, estado_laboral, disponible_emergencias) VALUES
-- Cardiología
('MED006', 'Dr. Miguel', 'Santos', 'Cardiología', 20, 'activo', 'activo', true),
('MED007', 'Dra. Carmen', 'Ruiz', 'Cardiología', 15, 'activo', 'activo', false),
('MED008', 'Dr. Antonio', 'Vega', 'Cardiología', 12, 'descanso', 'activo', true),
-- Oncología
('MED009', 'Dra. Isabel', 'Moreno', 'Oncología', 18, 'activo', 'activo', false),
('MED010', 'Dr. Ricardo', 'Herrera', 'Oncología', 22, 'activo', 'activo', false),
('MED011', 'Dra. Patricia', 'Jiménez', 'Oncología', 14, 'activo', 'activo', false),
-- Neurología
('MED012', 'Dr. Francisco', 'Ortega', 'Neurología', 25, 'activo', 'activo', true),
('MED013', 'Dra. Elena', 'Castillo', 'Neurología', 16, 'activo', 'activo', false),
-- UCI
('MED014', 'Dr. Alejandro', 'Ramos', 'UCI', 13, 'activo', 'activo', true),
('MED015', 'Dra. Rosa', 'Delgado', 'UCI', 11, 'activo', 'activo', true),
('MED016', 'Dr. Sergio', 'Vargas', 'UCI', 9, 'activo', 'activo', true),
-- Emergencias
('MED017', 'Dra. Beatriz', 'Gil', 'Emergencias', 8, 'activo', 'activo', true),
('MED018', 'Dr. Raúl', 'Mendez', 'Emergencias', 10, 'activo', 'activo', true),
('MED019', 'Dra. Cristina', 'Peña', 'Emergencias', 7, 'descanso', 'activo', true);
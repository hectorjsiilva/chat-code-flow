-- Añadir más pacientes - Lote 2: Pacientes moderados y leves
INSERT INTO pacientes (numero_historia, nombre, apellido, genero, fecha_nacimiento, estado_gravedad, diagnostico_principal, medico_responsable, fecha_ingreso, fecha_alta) VALUES
-- Pacientes moderados
('PAC041', 'Lucía', 'Aguilar Ibáñez', 'F', '1995-07-14', 'moderado', 'Diabetes descompensada', 'Dr. Manuel Prieto', NOW() - INTERVAL '1 day', NULL),
('PAC042', 'Roberto', 'Romero Cano', 'M', '1988-11-29', 'moderado', 'Hipertensión severa', 'Dr. Carlos Rodriguez', NOW() - INTERVAL '2 days', NULL),
('PAC043', 'Pilar', 'Mendez Vargas', 'F', '1983-04-02', 'moderado', 'Colecistitis aguda', 'Dr. Pablo Aguilar', NOW() - INTERVAL '1 day', NULL),
('PAC044', 'Ángel', 'Guerrero Silva', 'M', '1991-08-18', 'moderado', 'Fractura fémur', 'Dr. Andrés Cabrera', NOW() - INTERVAL '3 days', NULL),
('PAC045', 'Manuela', 'Navarro Ruiz', 'F', '1986-01-25', 'moderado', 'Neumonía atípica', 'Dra. Mónica Romero', NOW() - INTERVAL '1 day', NULL),
('PAC046', 'Joaquín', 'Cabrera López', 'M', '1979-06-11', 'moderado', 'Artritis reumatoide', 'Dra. Carmen Blanco', NOW() - INTERVAL '2 days', NULL),
('PAC047', 'Esperanza', 'Medina García', 'F', '1965-09-17', 'moderado', 'Depresión mayor', 'Dra. Teresa Medina', NOW() - INTERVAL '4 days', NULL),
('PAC048', 'Vicente', 'Soto Hernández', 'M', '1973-12-04', 'moderado', 'Insuficiencia renal', 'Dr. Daniel Torres', NOW() - INTERVAL '5 days', NULL),
-- Pacientes leves
('PAC049', 'Remedios', 'Ibáñez Morales', 'F', '1951-02-13', 'leve', 'Cataratas bilateral', 'Dr. Javier Soto', NOW() - INTERVAL '1 day', NULL),
('PAC050', 'Esteban', 'Cano Santos', 'M', '1987-10-30', 'leve', 'Hernia inguinal', 'Dr. Luis Martinez', NOW() - INTERVAL '2 days', NULL),
('PAC051', 'Cristina', 'Vázquez Prieto', 'F', '1993-03-22', 'leve', 'Apendicitis simple', 'Dr. Luis Martinez', NOW() - INTERVAL '1 day', NULL),
('PAC052', 'Ignacio', 'Blanco Rubio', 'M', '1980-08-17', 'leve', 'Sinusitis crónica', 'Dr. Rafael Rubio', NOW() - INTERVAL '2 days', NULL),
('PAC053', 'Beatriz', 'Pascual Moreno', 'F', '1990-05-09', 'leve', 'Dermatitis atópica', 'Dra. Amparo Ibáñez', NOW() - INTERVAL '1 day', NULL),
('PAC054', 'Sergio', 'López Vargas', 'M', '1985-11-14', 'leve', 'Esguince tobillo', 'Dr. Emilio Cano', NOW() - INTERVAL '3 days', NULL),
('PAC055', 'Paloma', 'García Delgado', 'F', '1988-07-03', 'leve', 'Cistitis recurrente', 'Dr. Víctor Guerrero', NOW() - INTERVAL '1 day', NULL);
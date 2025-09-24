-- Añadir muchos más pacientes - Lote 1: Pacientes críticos y graves
INSERT INTO pacientes (numero_historia, nombre, apellido, genero, fecha_nacimiento, estado_gravedad, diagnostico_principal, medico_responsable, fecha_ingreso, fecha_alta) VALUES
-- Pacientes críticos actuales
('PAC026', 'Juan', 'García López', 'M', '1975-03-15', 'critico', 'Infarto agudo miocardio', 'Dr. Carlos Rodriguez', NOW() - INTERVAL '2 days', NULL),
('PAC027', 'María', 'Martínez Sánchez', 'F', '1968-11-22', 'critico', 'Accidente cerebrovascular', 'Dr. Francisco Ortega', NOW() - INTERVAL '5 days', NULL),
('PAC028', 'Antonio', 'López Fernández', 'M', '1982-07-08', 'critico', 'Politraumatismo severo', 'Dr. Andrés Cabrera', NOW() - INTERVAL '1 day', NULL),
('PAC029', 'Carmen', 'González Ruiz', 'F', '1955-12-03', 'critico', 'Insuf. respiratoria', 'Dra. Mónica Romero', NOW() - INTERVAL '3 days', NULL),
('PAC030', 'José', 'Rodríguez Moreno', 'M', '1971-09-14', 'critico', 'Sepsis severa', 'Dra. Rosa Delgado', NOW() - INTERVAL '4 days', NULL),
('PAC031', 'Ana', 'Hernández Vega', 'F', '1963-04-27', 'critico', 'Shock cardiogénico', 'Dr. Miguel Santos', NOW() - INTERVAL '7 days', NULL),
('PAC032', 'Francisco', 'Jiménez Castro', 'M', '1978-01-19', 'critico', 'Hemorragia cerebral', 'Dr. Francisco Ortega', NOW() - INTERVAL '6 days', NULL),
-- Pacientes graves
('PAC033', 'Isabel', 'Morales Ortega', 'F', '1989-08-11', 'grave', 'Embarazo alto riesgo', 'Dra. Laura Flores', NOW() - INTERVAL '2 days', NULL),
('PAC034', 'Miguel', 'Santos Delgado', 'M', '1944-06-30', 'grave', 'Insuf. cardíaca', 'Dr. Miguel Santos', NOW() - INTERVAL '5 days', NULL),
('PAC035', 'Rosa', 'Vega Guerrero', 'F', '1958-10-12', 'grave', 'Cirrosis hepática', 'Dr. Pablo Aguilar', NOW() - INTERVAL '8 days', NULL),
('PAC036', 'Pedro', 'Castillo Ramos', 'M', '1985-02-28', 'grave', 'Pancreatitis aguda', 'Dr. Pablo Aguilar', NOW() - INTERVAL '3 days', NULL),
('PAC037', 'Dolores', 'Gil Navarro', 'F', '1976-12-07', 'grave', 'Crisis hipertensiva', 'Dr. Carlos Rodriguez', NOW() - INTERVAL '2 days', NULL),
('PAC038', 'Ramón', 'Peña Cabrera', 'M', '1967-05-16', 'grave', 'Úlcera perforada', 'Dr. Pablo Aguilar', NOW() - INTERVAL '4 days', NULL),
('PAC039', 'Esperanza', 'Torres Medina', 'F', '1992-09-23', 'grave', 'Parto complicado', 'Dra. Laura Flores', NOW() - INTERVAL '1 day', NULL),
('PAC040', 'Salvador', 'Flores Soto', 'M', '1958-03-09', 'grave', 'Cálculos renales', 'Dr. Daniel Torres', NOW() - INTERVAL '3 days', NULL);
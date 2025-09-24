-- Añadir muchas más emergencias con diferentes prioridades y tiempos
INSERT INTO emergencias (numero_emergencia, prioridad, estado, tiempo_atencion_minutos, diagnostico_emergencia, fecha_ingreso) VALUES
-- Emergencias rojas (críticas)
('EMG006', 'roja', 'atendido', 5, 'Paro cardíaco', NOW() - INTERVAL '30 minutes'),
('EMG007', 'roja', 'atendido', 12, 'Trauma craneal severo', NOW() - INTERVAL '2 hours'),
('EMG008', 'roja', 'en_atencion', 8, 'Shock hemorrágico', NOW() - INTERVAL '45 minutes'),
('EMG009', 'roja', 'atendido', 15, 'Infarto STEMI', NOW() - INTERVAL '3 hours'),
('EMG010', 'roja', 'derivado', 20, 'Quemaduras graves', NOW() - INTERVAL '4 hours'),
-- Emergencias amarillas (urgentes)
('EMG011', 'amarilla', 'atendido', 25, 'Fractura abierta', NOW() - INTERVAL '1 hour'),
('EMG012', 'amarilla', 'en_atencion', 35, 'Crisis asmática', NOW() - INTERVAL '2 hours'),
('EMG013', 'amarilla', 'atendido', 40, 'Dolor torácico', NOW() - INTERVAL '3 hours'),
('EMG014', 'amarilla', 'atendido', 30, 'Convulsiones', NOW() - INTERVAL '5 hours'),
('EMG015', 'amarilla', 'derivado', 45, 'Hemorragia digestiva', NOW() - INTERVAL '6 hours'),
('EMG016', 'amarilla', 'atendido', 28, 'Crisis hipertensiva', NOW() - INTERVAL '4 hours'),
('EMG017', 'amarilla', 'en_atencion', 50, 'Abdomen agudo', NOW() - INTERVAL '2 hours'),
-- Emergencias verdes (moderadas)
('EMG018', 'verde', 'atendido', 60, 'Gastroenteritis', NOW() - INTERVAL '3 hours'),
('EMG019', 'verde', 'atendido', 75, 'Cefalea intensa', NOW() - INTERVAL '4 hours'),
('EMG020', 'verde', 'derivado', 90, 'Lumbalgia aguda', NOW() - INTERVAL '5 hours'),
('EMG021', 'verde', 'atendido', 55, 'Faringitis aguda', NOW() - INTERVAL '2 hours'),
('EMG022', 'verde', 'atendido', 80, 'Esguince severo', NOW() - INTERVAL '6 hours'),
('EMG023', 'verde', 'en_atencion', 45, 'Reacción alérgica', NOW() - INTERVAL '1 hour'),
-- Emergencias azules (leves)
('EMG024', 'azul', 'atendido', 120, 'Consulta menor', NOW() - INTERVAL '4 hours'),
('EMG025', 'azul', 'atendido', 150, 'Control rutinario', NOW() - INTERVAL '5 hours'),
('EMG026', 'azul', 'atendido', 90, 'Síntomas leves', NOW() - INTERVAL '3 hours'),
('EMG027', 'azul', 'derivado', 180, 'Consulta psicológica', NOW() - INTERVAL '7 hours');
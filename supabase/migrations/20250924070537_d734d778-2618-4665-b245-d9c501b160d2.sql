-- Insertar camas para las nuevas unidades médicas
INSERT INTO camas (numero_cama, tipo_cama, estado, unidad_id)
SELECT 
    um.nombre_unidad || '-' || generate_series(1, LEAST(um.capacidad_total, 40)),
    CASE 
        WHEN um.tipo_unidad = 'Cuidados Intensivos' THEN 'uci'
        WHEN um.tipo_unidad = 'Emergencias' THEN 'emergencia'
        WHEN um.nombre_unidad IN ('Oncología', 'Hematología') THEN 'especializada'
        ELSE 'standard'
    END,
    CASE 
        WHEN random() < 0.65 THEN 'ocupada'
        WHEN random() < 0.85 THEN 'disponible'
        ELSE 'mantenimiento'
    END,
    um.id
FROM unidades_medicas um
WHERE um.created_at > NOW() - INTERVAL '1 minute';
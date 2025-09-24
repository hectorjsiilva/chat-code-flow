-- Crear tablas para el sistema hospitalario KlinikaAI
-- 1. Tabla de unidades médicas
CREATE TABLE public.unidades_medicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_unidad VARCHAR(100) NOT NULL,
    tipo_unidad VARCHAR(50) NOT NULL, -- 'UCI', 'Cardiologia', 'Neurologia', etc.
    capacidad_total INTEGER NOT NULL DEFAULT 0,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de camas
CREATE TABLE public.camas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_cama VARCHAR(20) NOT NULL,
    unidad_id UUID REFERENCES public.unidades_medicas(id) ON DELETE CASCADE,
    estado VARCHAR(20) DEFAULT 'disponible', -- 'disponible', 'ocupada', 'mantenimiento', 'limpieza'
    tipo_cama VARCHAR(30) DEFAULT 'standard', -- 'standard', 'critica', 'pediatrica'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(numero_cama, unidad_id)
);

-- 3. Tabla de pacientes
CREATE TABLE public.pacientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_historia VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    genero VARCHAR(10),
    telefono VARCHAR(20),
    estado_gravedad VARCHAR(20) DEFAULT 'leve', -- 'leve', 'moderado', 'grave', 'critico'
    fecha_ingreso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_alta TIMESTAMP WITH TIME ZONE,
    diagnostico_principal TEXT,
    cama_id UUID REFERENCES public.camas(id),
    medico_responsable VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de historial de ocupación de camas
CREATE TABLE public.historial_ocupacion_camas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cama_id UUID REFERENCES public.camas(id) ON DELETE CASCADE,
    paciente_id UUID REFERENCES public.pacientes(id),
    fecha_ocupacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_liberacion TIMESTAMP WITH TIME ZONE,
    estado_durante_ocupacion VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de personal médico
CREATE TABLE public.personal_medico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_empleado VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100),
    turno_actual VARCHAR(20) DEFAULT 'activo', -- 'activo', 'descanso', 'vacaciones'
    disponible_emergencias BOOLEAN DEFAULT true,
    años_experiencia INTEGER DEFAULT 0,
    unidad_asignada UUID REFERENCES public.unidades_medicas(id),
    estado_laboral VARCHAR(20) DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla de emergencias
CREATE TABLE public.emergencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_emergencia VARCHAR(30) UNIQUE NOT NULL,
    paciente_id UUID REFERENCES public.pacientes(id),
    fecha_ingreso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    prioridad VARCHAR(10) DEFAULT 'verde', -- 'roja', 'amarilla', 'verde', 'azul'
    tiempo_atencion_minutos INTEGER,
    medico_atencion UUID REFERENCES public.personal_medico(id),
    diagnostico_emergencia TEXT,
    estado VARCHAR(20) DEFAULT 'activo', -- 'activo', 'atendido', 'derivado'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabla de quirófanos
CREATE TABLE public.quirofanos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_quirofano VARCHAR(10) NOT NULL,
    estado VARCHAR(20) DEFAULT 'disponible', -- 'disponible', 'ocupado', 'mantenimiento'
    tipo_cirugia_actual VARCHAR(100),
    mantenimiento_programado BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabla de cirugías
CREATE TABLE public.cirugias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID REFERENCES public.pacientes(id),
    quirofano_id UUID REFERENCES public.quirofanos(id),
    fecha_cirugia DATE NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    tipo_cirugia VARCHAR(100),
    cirujano_principal UUID REFERENCES public.personal_medico(id),
    estado VARCHAR(20) DEFAULT 'programada', -- 'programada', 'en_proceso', 'completada', 'cancelada'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.unidades_medicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historial_ocupacion_camas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_medico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quirofanos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cirugias ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - Para este caso permitimos lectura completa para el dashboard médico
CREATE POLICY "Allow read access to medical data" ON public.unidades_medicas FOR SELECT USING (true);
CREATE POLICY "Allow read access to beds" ON public.camas FOR SELECT USING (true);
CREATE POLICY "Allow read access to patients" ON public.pacientes FOR SELECT USING (true);
CREATE POLICY "Allow read access to bed history" ON public.historial_ocupacion_camas FOR SELECT USING (true);
CREATE POLICY "Allow read access to medical staff" ON public.personal_medico FOR SELECT USING (true);
CREATE POLICY "Allow read access to emergencies" ON public.emergencias FOR SELECT USING (true);
CREATE POLICY "Allow read access to operating rooms" ON public.quirofanos FOR SELECT USING (true);
CREATE POLICY "Allow read access to surgeries" ON public.cirugias FOR SELECT USING (true);

-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar timestamps automáticamente
CREATE TRIGGER update_unidades_medicas_updated_at BEFORE UPDATE ON public.unidades_medicas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_camas_updated_at BEFORE UPDATE ON public.camas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pacientes_updated_at BEFORE UPDATE ON public.pacientes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_personal_medico_updated_at BEFORE UPDATE ON public.personal_medico FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_emergencias_updated_at BEFORE UPDATE ON public.emergencias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quirofanos_updated_at BEFORE UPDATE ON public.quirofanos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cirugias_updated_at BEFORE UPDATE ON public.cirugias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
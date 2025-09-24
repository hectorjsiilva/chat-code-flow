export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      camas: {
        Row: {
          created_at: string | null
          estado: string | null
          id: string
          numero_cama: string
          tipo_cama: string | null
          unidad_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estado?: string | null
          id?: string
          numero_cama: string
          tipo_cama?: string | null
          unidad_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: string | null
          id?: string
          numero_cama?: string
          tipo_cama?: string | null
          unidad_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "camas_unidad_id_fkey"
            columns: ["unidad_id"]
            isOneToOne: false
            referencedRelation: "unidades_medicas"
            referencedColumns: ["id"]
          },
        ]
      }
      cirugias: {
        Row: {
          cirujano_principal: string | null
          created_at: string | null
          estado: string | null
          fecha_cirugia: string
          hora_fin: string | null
          hora_inicio: string | null
          id: string
          paciente_id: string | null
          quirofano_id: string | null
          tipo_cirugia: string | null
          updated_at: string | null
        }
        Insert: {
          cirujano_principal?: string | null
          created_at?: string | null
          estado?: string | null
          fecha_cirugia: string
          hora_fin?: string | null
          hora_inicio?: string | null
          id?: string
          paciente_id?: string | null
          quirofano_id?: string | null
          tipo_cirugia?: string | null
          updated_at?: string | null
        }
        Update: {
          cirujano_principal?: string | null
          created_at?: string | null
          estado?: string | null
          fecha_cirugia?: string
          hora_fin?: string | null
          hora_inicio?: string | null
          id?: string
          paciente_id?: string | null
          quirofano_id?: string | null
          tipo_cirugia?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cirugias_cirujano_principal_fkey"
            columns: ["cirujano_principal"]
            isOneToOne: false
            referencedRelation: "personal_medico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cirugias_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cirugias_quirofano_id_fkey"
            columns: ["quirofano_id"]
            isOneToOne: false
            referencedRelation: "quirofanos"
            referencedColumns: ["id"]
          },
        ]
      }
      emergencias: {
        Row: {
          created_at: string | null
          diagnostico_emergencia: string | null
          estado: string | null
          fecha_ingreso: string | null
          id: string
          medico_atencion: string | null
          numero_emergencia: string
          paciente_id: string | null
          prioridad: string | null
          tiempo_atencion_minutos: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          diagnostico_emergencia?: string | null
          estado?: string | null
          fecha_ingreso?: string | null
          id?: string
          medico_atencion?: string | null
          numero_emergencia: string
          paciente_id?: string | null
          prioridad?: string | null
          tiempo_atencion_minutos?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          diagnostico_emergencia?: string | null
          estado?: string | null
          fecha_ingreso?: string | null
          id?: string
          medico_atencion?: string | null
          numero_emergencia?: string
          paciente_id?: string | null
          prioridad?: string | null
          tiempo_atencion_minutos?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergencias_medico_atencion_fkey"
            columns: ["medico_atencion"]
            isOneToOne: false
            referencedRelation: "personal_medico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergencias_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      historial_ocupacion_camas: {
        Row: {
          cama_id: string | null
          created_at: string | null
          estado_durante_ocupacion: string | null
          fecha_liberacion: string | null
          fecha_ocupacion: string | null
          id: string
          paciente_id: string | null
        }
        Insert: {
          cama_id?: string | null
          created_at?: string | null
          estado_durante_ocupacion?: string | null
          fecha_liberacion?: string | null
          fecha_ocupacion?: string | null
          id?: string
          paciente_id?: string | null
        }
        Update: {
          cama_id?: string | null
          created_at?: string | null
          estado_durante_ocupacion?: string | null
          fecha_liberacion?: string | null
          fecha_ocupacion?: string | null
          id?: string
          paciente_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historial_ocupacion_camas_cama_id_fkey"
            columns: ["cama_id"]
            isOneToOne: false
            referencedRelation: "camas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historial_ocupacion_camas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          apellido: string
          cama_id: string | null
          created_at: string | null
          diagnostico_principal: string | null
          estado_gravedad: string | null
          fecha_alta: string | null
          fecha_ingreso: string | null
          fecha_nacimiento: string | null
          genero: string | null
          id: string
          medico_responsable: string | null
          nombre: string
          numero_historia: string
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          apellido: string
          cama_id?: string | null
          created_at?: string | null
          diagnostico_principal?: string | null
          estado_gravedad?: string | null
          fecha_alta?: string | null
          fecha_ingreso?: string | null
          fecha_nacimiento?: string | null
          genero?: string | null
          id?: string
          medico_responsable?: string | null
          nombre: string
          numero_historia: string
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          apellido?: string
          cama_id?: string | null
          created_at?: string | null
          diagnostico_principal?: string | null
          estado_gravedad?: string | null
          fecha_alta?: string | null
          fecha_ingreso?: string | null
          fecha_nacimiento?: string | null
          genero?: string | null
          id?: string
          medico_responsable?: string | null
          nombre?: string
          numero_historia?: string
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_cama_id_fkey"
            columns: ["cama_id"]
            isOneToOne: false
            referencedRelation: "camas"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_medico: {
        Row: {
          años_experiencia: number | null
          apellido: string
          created_at: string | null
          disponible_emergencias: boolean | null
          especialidad: string | null
          estado_laboral: string | null
          id: string
          nombre: string
          numero_empleado: string
          turno_actual: string | null
          unidad_asignada: string | null
          updated_at: string | null
        }
        Insert: {
          años_experiencia?: number | null
          apellido: string
          created_at?: string | null
          disponible_emergencias?: boolean | null
          especialidad?: string | null
          estado_laboral?: string | null
          id?: string
          nombre: string
          numero_empleado: string
          turno_actual?: string | null
          unidad_asignada?: string | null
          updated_at?: string | null
        }
        Update: {
          años_experiencia?: number | null
          apellido?: string
          created_at?: string | null
          disponible_emergencias?: boolean | null
          especialidad?: string | null
          estado_laboral?: string | null
          id?: string
          nombre?: string
          numero_empleado?: string
          turno_actual?: string | null
          unidad_asignada?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_medico_unidad_asignada_fkey"
            columns: ["unidad_asignada"]
            isOneToOne: false
            referencedRelation: "unidades_medicas"
            referencedColumns: ["id"]
          },
        ]
      }
      quirofanos: {
        Row: {
          activo: boolean | null
          created_at: string | null
          estado: string | null
          id: string
          mantenimiento_programado: boolean | null
          numero_quirofano: string
          tipo_cirugia_actual: string | null
          ultima_actualizacion: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          estado?: string | null
          id?: string
          mantenimiento_programado?: boolean | null
          numero_quirofano: string
          tipo_cirugia_actual?: string | null
          ultima_actualizacion?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          estado?: string | null
          id?: string
          mantenimiento_programado?: boolean | null
          numero_quirofano?: string
          tipo_cirugia_actual?: string | null
          ultima_actualizacion?: string | null
        }
        Relationships: []
      }
      unidades_medicas: {
        Row: {
          activa: boolean | null
          capacidad_total: number
          created_at: string | null
          id: string
          nombre_unidad: string
          tipo_unidad: string
          updated_at: string | null
        }
        Insert: {
          activa?: boolean | null
          capacidad_total?: number
          created_at?: string | null
          id?: string
          nombre_unidad: string
          tipo_unidad: string
          updated_at?: string | null
        }
        Update: {
          activa?: boolean | null
          capacidad_total?: number
          created_at?: string | null
          id?: string
          nombre_unidad?: string
          tipo_unidad?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

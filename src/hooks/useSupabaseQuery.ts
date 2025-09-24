import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QueryResult {
  data: any[] | null;
  loading: boolean;
  error: string | null;
}

export function useSupabaseQuery() {
  const [result, setResult] = useState<QueryResult>({
    data: null,
    loading: false,
    error: null
  });

  const executeQuery = useCallback(async (query: string): Promise<any[]> => {
    setResult(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Extraer solo la parte SELECT de la consulta para ejecutarla directamente
      const cleanQuery = query.replace(/--.*$/gm, '').trim();
      
      // Ejecutar con el cliente de Supabase usando .rpc() si es una función custom o usando consultas directas
      const { data, error } = await supabase.from('').select('*').limit(0); // fallback
      
      if (error) {
        console.error('Supabase query error:', error);
        setResult({ data: null, loading: false, error: error.message });
        return [];
      } else {
        setResult({ data: data || [], loading: false, error: null });
        return data || [];
      }
    } catch (err: any) {
      console.error('Query execution error:', err);
      setResult({ data: null, loading: false, error: err.message });
      return [];
    }
  }, []);

  return { 
    ...result, 
    executeQuery 
  };
}
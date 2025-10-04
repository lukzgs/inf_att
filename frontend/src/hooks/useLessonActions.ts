import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { toast } from 'sonner';

export interface OpenLessonResponse {
  lessonId: number;
  presenceCode: string;
  openedAt: string;
  message: string;
}

export interface CloseLessonResponse {
  lessonId: number;
  closedAt: string;
  automaticAbsencesCount: number;
  message: string;
}

/**
 * Hook para abrir uma aula
 * 
 * Ao abrir uma aula:
 * - Define isOpen=true no banco
 * - Gera um código de presença de 6 dígitos
 * - Registra o timestamp openedAt
 * - Retorna o código para exibição
 * 
 * @example
 * ```tsx
 * const { mutate: openLesson, isPending } = useOpenLesson();
 * 
 * openLesson(lessonId, {
 *   onSuccess: (data) => {
 *     console.log('Código:', data.presenceCode);
 *   }
 * });
 * ```
 */
export const useOpenLesson = () => {
  const queryClient = useQueryClient();

  return useMutation<OpenLessonResponse, Error, number>({
    mutationFn: async (lessonId: number) => {
      const response = await api.patch(`/lessons/${lessonId}/open`);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate lessons queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lessonsByClass'] });
      
      toast.success('Aula aberta com sucesso!', {
        description: `Código de presença: ${data.presenceCode}`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao abrir aula';
      toast.error('Erro ao abrir aula', {
        description: message,
      });
    },
  });
};

/**
 * Hook para fechar uma aula
 * 
 * Ao fechar uma aula:
 * - Define isOpen=false no banco
 * - Registra o timestamp closedAt
 * - Marca automaticamente como falta os alunos que não registraram presença
 * - Desativa o código de presença
 * 
 * @example
 * ```tsx
 * const { mutate: closeLesson, isPending } = useCloseLesson();
 * 
 * closeLesson(lessonId, {
 *   onSuccess: (data) => {
 *     console.log('Faltas automáticas:', data.automaticAbsencesCount);
 *   }
 * });
 * ```
 */
export const useCloseLesson = () => {
  const queryClient = useQueryClient();

  return useMutation<CloseLessonResponse, Error, number>({
    mutationFn: async (lessonId: number) => {
      const response = await api.patch(`/lessons/${lessonId}/close`);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lessonsByClass'] });
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      
      toast.success('Aula fechada com sucesso!', {
        description: `${data.automaticAbsencesCount} falta(s) automática(s) registrada(s)`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao fechar aula';
      toast.error('Erro ao fechar aula', {
        description: message,
      });
    },
  });
};

/**
 * Hook para buscar o código de presença ativo de uma aula
 * 
 * Retorna o código de 6 dígitos se a aula estiver aberta.
 * Usado para exibir o código durante a aula.
 * 
 * @example
 * ```tsx
 * const { mutate: getPresenceCode } = useGetPresenceCode();
 * 
 * getPresenceCode(lessonId, {
 *   onSuccess: (code) => {
 *     console.log('Código:', code);
 *   }
 * });
 * ```
 */
export const useGetPresenceCode = () => {
  return useMutation<string, Error, number>({
    mutationFn: async (lessonId: number) => {
      const response = await api.get(`/lessons/${lessonId}/presence-code`);
      return response.data.presenceCode;
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao buscar código';
      toast.error('Erro', {
        description: message,
      });
    },
  });
};

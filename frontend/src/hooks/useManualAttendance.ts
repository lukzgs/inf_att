import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { toast } from 'sonner';

export interface ManualAttendanceEntry {
  userId: number;
  isPresent: boolean;
  justification?: string;
}

export interface BulkAttendanceDto {
  lessonId: number;
  attendances: ManualAttendanceEntry[];
  editReason: string;
}

export interface BulkAttendanceResponse {
  lessonId: number;
  updated: number;
  created: number;
  message: string;
}

/**
 * Hook para registrar ou editar presenças manualmente em lote
 * 
 * Casos de uso:
 * - Professor marca presença manualmente quando sistema falha
 * - Correção de presenças após a aula
 * - Registro de alunos que chegaram atrasados
 * - Justificativa de faltas
 * 
 * Todas as edições são auditadas:
 * - editedBy: ID do professor
 * - editReason: Motivo da edição manual
 * - editedAt: Timestamp da edição
 * 
 * @example
 * ```tsx
 * const { mutate: saveAttendances, isPending } = useManualAttendance();
 * 
 * saveAttendances({
 *   lessonId: 123,
 *   attendances: [
 *     { userId: 1, isPresent: true },
 *     { userId: 2, isPresent: false, justification: "Atestado médico" }
 *   ],
 *   editReason: "Registro manual - sistema offline"
 * }, {
 *   onSuccess: (data) => {
 *     console.log(`${data.updated} atualizados, ${data.created} criados`);
 *   }
 * });
 * ```
 */
export const useManualAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation<BulkAttendanceResponse, Error, BulkAttendanceDto>({
    mutationFn: async (data: BulkAttendanceDto) => {
      const response = await api.post(`/attendances/bulk`, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate all attendance-related queries
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      queryClient.invalidateQueries({ queryKey: ['attendancesByLesson'] });
      queryClient.invalidateQueries({ queryKey: ['real-time-attendances'] });
      queryClient.invalidateQueries({ queryKey: ['student-classes'] });
      
      toast.success('Presenças salvas com sucesso!', {
        description: `${data.updated} registro(s) atualizado(s), ${data.created} criado(s)`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao salvar presenças';
      toast.error('Erro ao salvar presenças', {
        description: message,
      });
    },
  });
};

/**
 * Hook para editar uma única presença
 * 
 * Usado para correções pontuais (ex: marcar um aluno específico como presente/ausente).
 * 
 * @example
 * ```tsx
 * const { mutate: editAttendance } = useEditSingleAttendance();
 * 
 * editAttendance({
 *   lessonId: 123,
 *   userId: 45,
 *   isPresent: true,
 *   justification: null,
 *   editReason: "Aluno chegou atrasado, professor marcou manualmente"
 * });
 * ```
 */
export const useEditSingleAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      lessonId: number;
      userId: number;
      isPresent: boolean;
      justification?: string;
      editReason: string;
    }) => {
      const response = await api.put(
        `/attendances/${data.lessonId}/${data.userId}`,
        {
          isPresent: data.isPresent,
          justification: data.justification,
          editReason: data.editReason,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      queryClient.invalidateQueries({ queryKey: ['attendancesByLesson'] });
      queryClient.invalidateQueries({ queryKey: ['real-time-attendances'] });
      
      toast.success('Presença atualizada!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao editar presença';
      toast.error('Erro', { description: message });
    },
  });
};

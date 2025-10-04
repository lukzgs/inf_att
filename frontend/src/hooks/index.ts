/**
 * Custom hooks para a aplicação
 * 
 * @module hooks
 */

// Hook de frequência
export {
  useFrequency,
  useFrequencyPercentage,
  useIsApproved,
  type FrequencyStats,
} from './useFrequency';

// Hook de presença em tempo real
export {
  useRealTimeAttendance,
  useAttendanceListener,
  useAttendanceCounter,
  type RealtimeAttendance,
  type RealtimeLessonStats,
} from './useRealTimeAttendance';

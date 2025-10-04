/**
 * Utils para cálculos e lógica de frequência/presença
 * 
 * @module utils/attendance
 */

// Cálculos de frequência
export {
  calculateFrequency,
  calculateFrequencyPrecise,
  isApprovedByFrequency,
  calculateRemainingAbsences,
  calculateFrequencyStats,
} from './calculateFrequency';

// Status de frequência
export {
  getFrequencyStatus,
  isCriticalFrequency,
  needsFrequencyAlert,
  getStatusMessage,
  getStatusEmoji,
  type FrequencyStatus,
  type FrequencyThresholds,
} from './getFrequencyStatus';

// Classes de cor
export {
  getFrequencyTextColor,
  getFrequencyBgColor,
  getFrequencyBorderColor,
  getFrequencyBadgeClass,
  getFrequencyButtonClass,
  getFrequencyColorClasses,
  getFrequencyProgressClass,
  type FrequencyColorClasses,
} from './getFrequencyColor';

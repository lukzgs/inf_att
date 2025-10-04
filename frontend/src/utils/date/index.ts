/**
 * Utils para manipulação e formatação de datas
 * 
 * @module utils/date
 */

// Formatação de datas
export {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeDate,
  formatFullDate,
  formatISODate,
  formatWeekday,
} from './formatDate';

// Cálculo de tempo restante
export {
  getTimeRemaining,
  formatTimeRemaining,
  formatTimeRemainingVerbose,
  isTimeExpired,
  getTimeElapsedPercentage,
  type TimeRemaining,
} from './getTimeRemaining';

// Validação de janelas de tempo
export {
  isWithinTimeWindow,
  canRegisterAttendance,
  getWindowEndDate,
  isFutureDate,
  isPastDate,
  isToday,
  addMinutes,
} from './isWithinTimeWindow';

/**
 * Utils para formatação de dados
 * 
 * @module utils/format
 */

// Formatação de porcentagens
export {
  formatPercentage,
  formatPercentageWithSign,
  decimalToPercentage,
  percentageToDecimal,
  formatPercentageForProgress,
} from './formatPercentage';

// Formatação de nomes
export {
  formatNameToInitials,
  formatNameToDisplay,
  formatNameAbbreviated,
  getFirstName,
  getLastName,
  isValidFullName,
} from './formatName';

// Formatação de números
export {
  formatNumber,
  formatNumberCompact,
  formatBytes,
  formatCPF,
  formatPhone,
  truncateText,
} from './formatNumber';

// Formatação de datas
export {
  formatDateLocal,
  formatDateBR,
  formatDateShort,
} from './formatDate';

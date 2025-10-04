/**
 * Utils para validação de dados
 * 
 * @module utils/validation
 */

// Validação de código de presença
export {
  validatePresenceCode,
  formatPresenceCode,
  cleanPresenceCode,
  canGenerateCode,
  generatePresenceCode,
  validateCodeWithMessage,
} from './validateCode';

// Validação de email
export {
  validateEmail,
  validateEmailWithMessage,
  normalizeEmail,
  isEmailFromDomain,
  extractEmailDomain,
  validateEmailList,
} from './validateEmail';

// Validação de formulários
export {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumeric,
  validateRange,
  validateMultiple,
} from './validateForm';

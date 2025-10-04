/**
 * Valida campo obrigatório
 * 
 * @param value - Valor a validar
 * @param fieldName - Nome do campo (para mensagem de erro)
 * @returns Objeto com validação e mensagem
 * 
 * @example
 * validateRequired('John', 'Nome')  // { valid: true, message: '' }
 * validateRequired('', 'Nome')      // { valid: false, message: 'Nome é obrigatório' }
 */
export function validateRequired(
  value: string | number | boolean | null | undefined,
  fieldName: string = 'Campo'
): {
  valid: boolean;
  message: string;
} {
  // Verifica se é undefined ou null
  if (value === undefined || value === null) {
    return {
      valid: false,
      message: `${fieldName} é obrigatório`,
    };
  }

  // Verifica se é string vazia (após trim)
  if (typeof value === 'string' && value.trim() === '') {
    return {
      valid: false,
      message: `${fieldName} é obrigatório`,
    };
  }

  return {
    valid: true,
    message: '',
  };
}

/**
 * Valida tamanho mínimo de string
 * 
 * @param value - Valor a validar
 * @param minLength - Tamanho mínimo
 * @param fieldName - Nome do campo
 * @returns Objeto com validação e mensagem
 * 
 * @example
 * validateMinLength('Hello', 3, 'Nome')  // { valid: true, message: '' }
 * validateMinLength('Hi', 3, 'Nome')     // { valid: false, message: 'Nome deve ter no mínimo 3 caracteres' }
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string = 'Campo'
): {
  valid: boolean;
  message: string;
} {
  if (!value || typeof value !== 'string') {
    return {
      valid: false,
      message: `${fieldName} é obrigatório`,
    };
  }

  const cleanValue = value.trim();

  if (cleanValue.length < minLength) {
    return {
      valid: false,
      message: `${fieldName} deve ter no mínimo ${minLength} caracteres`,
    };
  }

  return {
    valid: true,
    message: '',
  };
}

/**
 * Valida tamanho máximo de string
 * 
 * @param value - Valor a validar
 * @param maxLength - Tamanho máximo
 * @param fieldName - Nome do campo
 * @returns Objeto com validação e mensagem
 * 
 * @example
 * validateMaxLength('Hi', 10, 'Nome')     // { valid: true, message: '' }
 * validateMaxLength('VeryLongName', 5, 'Nome')  // { valid: false, message: 'Nome deve ter no máximo 5 caracteres' }
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string = 'Campo'
): {
  valid: boolean;
  message: string;
} {
  if (!value || typeof value !== 'string') {
    return {
      valid: true,
      message: '',
    };
  }

  const cleanValue = value.trim();

  if (cleanValue.length > maxLength) {
    return {
      valid: false,
      message: `${fieldName} deve ter no máximo ${maxLength} caracteres`,
    };
  }

  return {
    valid: true,
    message: '',
  };
}

/**
 * Valida se valor é numérico
 * 
 * @param value - Valor a validar
 * @param fieldName - Nome do campo
 * @returns Objeto com validação e mensagem
 * 
 * @example
 * validateNumeric('123', 'Idade')  // { valid: true, message: '' }
 * validateNumeric('abc', 'Idade')  // { valid: false, message: 'Idade deve ser numérico' }
 */
export function validateNumeric(
  value: string | number,
  fieldName: string = 'Campo'
): {
  valid: boolean;
  message: string;
} {
  if (typeof value === 'number') {
    return {
      valid: !isNaN(value),
      message: isNaN(value) ? `${fieldName} deve ser um número válido` : '',
    };
  }

  if (!value || typeof value !== 'string') {
    return {
      valid: false,
      message: `${fieldName} é obrigatório`,
    };
  }

  const cleanValue = value.trim();
  const numValue = Number(cleanValue);

  if (isNaN(numValue)) {
    return {
      valid: false,
      message: `${fieldName} deve ser numérico`,
    };
  }

  return {
    valid: true,
    message: '',
  };
}

/**
 * Valida se valor está dentro de um intervalo
 * 
 * @param value - Valor a validar
 * @param min - Valor mínimo
 * @param max - Valor máximo
 * @param fieldName - Nome do campo
 * @returns Objeto com validação e mensagem
 * 
 * @example
 * validateRange(50, 0, 100, 'Nota')   // { valid: true, message: '' }
 * validateRange(150, 0, 100, 'Nota')  // { valid: false, message: 'Nota deve estar entre 0 e 100' }
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = 'Campo'
): {
  valid: boolean;
  message: string;
} {
  if (typeof value !== 'number' || isNaN(value)) {
    return {
      valid: false,
      message: `${fieldName} deve ser um número válido`,
    };
  }

  if (value < min || value > max) {
    return {
      valid: false,
      message: `${fieldName} deve estar entre ${min} e ${max}`,
    };
  }

  return {
    valid: true,
    message: '',
  };
}

/**
 * Valida múltiplos campos e retorna erros
 * 
 * @param validations - Array de validações
 * @returns Objeto com todos os erros
 * 
 * @example
 * const errors = validateMultiple([
 *   validateRequired(name, 'Nome'),
 *   validateEmail(email),
 * ])
 * // errors = { valid: false, messages: ['Nome é obrigatório'] }
 */
export function validateMultiple(
  validations: Array<{ valid: boolean; message: string }>
): {
  valid: boolean;
  messages: string[];
} {
  const messages = validations
    .filter(v => !v.valid)
    .map(v => v.message);

  return {
    valid: messages.length === 0,
    messages,
  };
}

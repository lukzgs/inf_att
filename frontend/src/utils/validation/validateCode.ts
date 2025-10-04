/**
 * Valida código de presença (6 dígitos numéricos)
 * 
 * @param code - Código a validar
 * @returns true se válido, false caso contrário
 * 
 * @example
 * validatePresenceCode('123456')  // true
 * validatePresenceCode('12345')   // false (menos de 6 dígitos)
 * validatePresenceCode('abcdef')  // false (não numérico)
 */
export function validatePresenceCode(code: string): boolean {
  if (!code || typeof code !== 'string') {
    return false;
  }

  // Remove espaços
  const cleanCode = code.trim();

  // Verifica se tem exatamente 6 caracteres
  if (cleanCode.length !== 6) {
    return false;
  }

  // Verifica se todos os caracteres são dígitos
  return /^\d{6}$/.test(cleanCode);
}

/**
 * Formata código de presença (adiciona espaço a cada 3 dígitos)
 * 
 * @param code - Código a formatar
 * @returns Código formatado
 * 
 * @example
 * formatPresenceCode('123456')  // '123 456'
 */
export function formatPresenceCode(code: string): string {
  if (!code) {
    return '';
  }

  const cleanCode = code.replace(/\D/g, '').slice(0, 6);
  
  if (cleanCode.length <= 3) {
    return cleanCode;
  }

  return `${cleanCode.slice(0, 3)} ${cleanCode.slice(3)}`;
}

/**
 * Limpa código removendo caracteres não numéricos
 * 
 * @param code - Código a limpar
 * @returns Código limpo (apenas dígitos)
 * 
 * @example
 * cleanPresenceCode('123 456')  // '123456'
 * cleanPresenceCode('1a2b3c')   // '123'
 */
export function cleanPresenceCode(code: string): string {
  if (!code) {
    return '';
  }

  return code.replace(/\D/g, '').slice(0, 6);
}

/**
 * Valida se o código pode ser gerado (6 dígitos únicos)
 * 
 * @param code - Código a validar
 * @returns true se pode ser gerado
 * 
 * @example
 * canGenerateCode('123456')  // true
 * canGenerateCode('111111')  // true (repetição permitida)
 */
export function canGenerateCode(code: string): boolean {
  return validatePresenceCode(code);
}

/**
 * Gera um código de presença aleatório (6 dígitos)
 * 
 * @returns Código de 6 dígitos
 * 
 * @example
 * generatePresenceCode()  // '842915'
 */
export function generatePresenceCode(): string {
  const code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  
  return code;
}

/**
 * Valida se o código está no formato correto e retorna mensagem de erro
 * 
 * @param code - Código a validar
 * @returns Objeto com validação e mensagem de erro
 * 
 * @example
 * validateCodeWithMessage('123456')  // { valid: true, message: '' }
 * validateCodeWithMessage('123')     // { valid: false, message: 'Código deve ter 6 dígitos' }
 */
export function validateCodeWithMessage(code: string): {
  valid: boolean;
  message: string;
} {
  if (!code || code.trim() === '') {
    return {
      valid: false,
      message: 'Código é obrigatório',
    };
  }

  const cleanCode = cleanPresenceCode(code);

  if (cleanCode.length < 6) {
    return {
      valid: false,
      message: 'Código deve ter 6 dígitos',
    };
  }

  if (cleanCode.length > 6) {
    return {
      valid: false,
      message: 'Código deve ter apenas 6 dígitos',
    };
  }

  if (!/^\d{6}$/.test(cleanCode)) {
    return {
      valid: false,
      message: 'Código deve conter apenas números',
    };
  }

  return {
    valid: true,
    message: '',
  };
}

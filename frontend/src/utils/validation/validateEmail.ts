/**
 * Valida formato de email
 * 
 * @param email - Email a validar
 * @returns true se válido, false caso contrário
 * 
 * @example
 * validateEmail('user@example.com')  // true
 * validateEmail('invalid-email')     // false
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const cleanEmail = email.trim();

  if (cleanEmail === '') {
    return false;
  }

  // Regex padrão para validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleanEmail);
}

/**
 * Valida email com mensagem de erro detalhada
 * 
 * @param email - Email a validar
 * @returns Objeto com validação e mensagem
 * 
 * @example
 * validateEmailWithMessage('user@example.com')  // { valid: true, message: '' }
 * validateEmailWithMessage('invalid')           // { valid: false, message: 'Email inválido' }
 */
export function validateEmailWithMessage(email: string): {
  valid: boolean;
  message: string;
} {
  if (!email || email.trim() === '') {
    return {
      valid: false,
      message: 'Email é obrigatório',
    };
  }

  const cleanEmail = email.trim();

  if (!cleanEmail.includes('@')) {
    return {
      valid: false,
      message: 'Email deve conter @',
    };
  }

  if (!cleanEmail.includes('.')) {
    return {
      valid: false,
      message: 'Email deve conter um domínio válido',
    };
  }

  if (cleanEmail.indexOf('@') === 0) {
    return {
      valid: false,
      message: 'Email não pode começar com @',
    };
  }

  if (cleanEmail.indexOf('@') === cleanEmail.length - 1) {
    return {
      valid: false,
      message: 'Email deve ter um domínio após @',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return {
      valid: false,
      message: 'Formato de email inválido',
    };
  }

  return {
    valid: true,
    message: '',
  };
}

/**
 * Normaliza email (lowercase e trim)
 * 
 * @param email - Email a normalizar
 * @returns Email normalizado
 * 
 * @example
 * normalizeEmail('  USER@EXAMPLE.COM  ')  // 'user@example.com'
 */
export function normalizeEmail(email: string): string {
  if (!email) {
    return '';
  }

  return email.trim().toLowerCase();
}

/**
 * Valida se email pertence a um domínio específico
 * 
 * @param email - Email a validar
 * @param domain - Domínio permitido
 * @returns true se pertence ao domínio
 * 
 * @example
 * isEmailFromDomain('user@ifal.edu.br', 'ifal.edu.br')  // true
 * isEmailFromDomain('user@gmail.com', 'ifal.edu.br')    // false
 */
export function isEmailFromDomain(email: string, domain: string): boolean {
  if (!validateEmail(email)) {
    return false;
  }

  const normalizedEmail = normalizeEmail(email);
  const normalizedDomain = domain.toLowerCase();

  return normalizedEmail.endsWith(`@${normalizedDomain}`);
}

/**
 * Extrai o domínio do email
 * 
 * @param email - Email
 * @returns Domínio (ex: 'example.com')
 * 
 * @example
 * extractEmailDomain('user@example.com')  // 'example.com'
 */
export function extractEmailDomain(email: string): string {
  if (!validateEmail(email)) {
    return '';
  }

  const normalizedEmail = normalizeEmail(email);
  const parts = normalizedEmail.split('@');
  
  return parts[1] || '';
}

/**
 * Valida lista de emails separados por vírgula ou ponto e vírgula
 * 
 * @param emailList - Lista de emails
 * @returns Array com emails válidos
 * 
 * @example
 * validateEmailList('user1@example.com, user2@example.com')  // ['user1@example.com', 'user2@example.com']
 */
export function validateEmailList(emailList: string): string[] {
  if (!emailList) {
    return [];
  }

  const emails = emailList.split(/[,;]/).map(email => email.trim());
  
  return emails.filter(email => validateEmail(email));
}

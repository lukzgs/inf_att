/**
 * Formata número para exibição
 * 
 * @param value - Número a formatar
 * @param options - Opções de formatação
 * @returns String formatada
 * 
 * @example
 * formatNumber(1234)                    // '1.234'
 * formatNumber(1234.56)                 // '1.234,56'
 * formatNumber(1234.56, { decimals: 0 }) // '1.235'
 */
export function formatNumber(
  value: number,
  options: {
    decimals?: number;
    thousandsSeparator?: string;
    decimalSeparator?: string;
  } = {}
): string {
  const {
    decimals = 2,
    thousandsSeparator = '.',
    decimalSeparator = ',',
  } = options;

  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }

  // Arredonda
  const rounded = value.toFixed(decimals);
  const [integerPart, decimalPart] = rounded.split('.');

  // Adiciona separador de milhares
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

  if (decimals === 0 || !decimalPart) {
    return formattedInteger;
  }

  return `${formattedInteger}${decimalSeparator}${decimalPart}`;
}

/**
 * Formata número compacto (1K, 1M, etc)
 * 
 * @param value - Número a formatar
 * @returns String formatada compacta
 * 
 * @example
 * formatNumberCompact(1234)      // '1.2K'
 * formatNumberCompact(1234567)   // '1.2M'
 * formatNumberCompact(123)       // '123'
 */
export function formatNumberCompact(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue < 1000) {
    return `${sign}${absValue}`;
  }

  if (absValue < 1000000) {
    return `${sign}${(absValue / 1000).toFixed(1)}K`;
  }

  if (absValue < 1000000000) {
    return `${sign}${(absValue / 1000000).toFixed(1)}M`;
  }

  return `${sign}${(absValue / 1000000000).toFixed(1)}B`;
}

/**
 * Formata bytes para tamanho legível
 * 
 * @param bytes - Tamanho em bytes
 * @returns String formatada
 * 
 * @example
 * formatBytes(1024)       // '1 KB'
 * formatBytes(1048576)    // '1 MB'
 * formatBytes(1073741824) // '1 GB'
 */
export function formatBytes(bytes: number): string {
  if (typeof bytes !== 'number' || isNaN(bytes)) {
    return '0 B';
  }

  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  return `${value.toFixed(1)} ${units[i]}`;
}

/**
 * Formata CPF (apenas dígitos para formato XXX.XXX.XXX-XX)
 * 
 * @param cpf - CPF (apenas números)
 * @returns CPF formatado
 * 
 * @example
 * formatCPF('12345678901')  // '123.456.789-01'
 */
export function formatCPF(cpf: string): string {
  if (!cpf || typeof cpf !== 'string') {
    return '';
  }

  const cleanCPF = cpf.replace(/\D/g, '').slice(0, 11);

  if (cleanCPF.length !== 11) {
    return cleanCPF;
  }

  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata telefone brasileiro
 * 
 * @param phone - Telefone (apenas números)
 * @returns Telefone formatado
 * 
 * @example
 * formatPhone('11987654321')  // '(11) 98765-4321'
 * formatPhone('1134567890')   // '(11) 3456-7890'
 */
export function formatPhone(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  const cleanPhone = phone.replace(/\D/g, '');

  // Celular (11 dígitos)
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  // Fixo (10 dígitos)
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return cleanPhone;
}

/**
 * Trunca texto adicionando reticências
 * 
 * @param text - Texto a truncar
 * @param maxLength - Tamanho máximo
 * @param suffix - Sufixo (padrão: '...')
 * @returns Texto truncado
 * 
 * @example
 * truncateText('Hello World', 5)  // 'Hello...'
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Formata nome completo para iniciais
 * 
 * @param fullName - Nome completo
 * @returns Iniciais (máximo 2 letras)
 * 
 * @example
 * formatNameToInitials('João Silva')           // 'JS'
 * formatNameToInitials('Maria da Silva')       // 'MS'
 * formatNameToInitials('João Pedro da Silva')  // 'JS'
 */
export function formatNameToInitials(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') {
    return '';
  }

  const cleanName = fullName.trim();
  
  if (cleanName === '') {
    return '';
  }

  const words = cleanName.split(' ').filter(word => word.length > 0);

  if (words.length === 0) {
    return '';
  }

  if (words.length === 1) {
    // Se tem apenas uma palavra, pega as duas primeiras letras
    return words[0].substring(0, 2).toUpperCase();
  }

  // Pega a primeira letra do primeiro e último nome (ignora preposições)
  const ignoredWords = ['da', 'de', 'do', 'das', 'dos', 'e'];
  const significantWords = words.filter(word => !ignoredWords.includes(word.toLowerCase()));

  if (significantWords.length === 0) {
    return words[0][0].toUpperCase();
  }

  if (significantWords.length === 1) {
    return significantWords[0].substring(0, 2).toUpperCase();
  }

  const firstInitial = significantWords[0][0];
  const lastInitial = significantWords[significantWords.length - 1][0];

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

/**
 * Formata nome para exibição (capitaliza primeira letra de cada palavra)
 * 
 * @param name - Nome a formatar
 * @returns Nome formatado
 * 
 * @example
 * formatNameToDisplay('joão silva')  // 'João Silva'
 * formatNameToDisplay('MARIA SILVA')  // 'Maria Silva'
 */
export function formatNameToDisplay(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const cleanName = name.trim().toLowerCase();
  
  if (cleanName === '') {
    return '';
  }

  const words = cleanName.split(' ');

  const capitalizedWords = words.map(word => {
    if (word.length === 0) {
      return '';
    }

    // Não capitaliza preposições
    const ignoredWords = ['da', 'de', 'do', 'das', 'dos', 'e'];
    if (ignoredWords.includes(word)) {
      return word;
    }

    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return capitalizedWords.join(' ');
}

/**
 * Formata nome abreviando nomes do meio
 * 
 * @param fullName - Nome completo
 * @returns Nome abreviado
 * 
 * @example
 * formatNameAbbreviated('João Pedro Silva')  // 'João P. Silva'
 * formatNameAbbreviated('Maria da Silva')    // 'Maria Silva'
 */
export function formatNameAbbreviated(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') {
    return '';
  }

  const cleanName = fullName.trim();
  
  if (cleanName === '') {
    return '';
  }

  const words = cleanName.split(' ').filter(word => word.length > 0);

  if (words.length <= 2) {
    return formatNameToDisplay(cleanName);
  }

  // Pega primeiro e último nome completos
  const firstName = words[0];
  const lastName = words[words.length - 1];
  
  // Abrevia nomes do meio (exceto preposições)
  const ignoredWords = ['da', 'de', 'do', 'das', 'dos', 'e'];
  const middleNames = words.slice(1, -1)
    .filter(word => !ignoredWords.includes(word.toLowerCase()))
    .map(word => `${word.charAt(0).toUpperCase()}.`);

  const parts = [firstName, ...middleNames, lastName];
  
  return formatNameToDisplay(parts.join(' '));
}

/**
 * Extrai primeiro nome
 * 
 * @param fullName - Nome completo
 * @returns Primeiro nome
 * 
 * @example
 * getFirstName('João Silva')  // 'João'
 */
export function getFirstName(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') {
    return '';
  }

  const cleanName = fullName.trim();
  const words = cleanName.split(' ');
  
  return formatNameToDisplay(words[0] || '');
}

/**
 * Extrai último nome (sobrenome)
 * 
 * @param fullName - Nome completo
 * @returns Sobrenome
 * 
 * @example
 * getLastName('João Silva')  // 'Silva'
 */
export function getLastName(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') {
    return '';
  }

  const cleanName = fullName.trim();
  const words = cleanName.split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) {
    return '';
  }

  return formatNameToDisplay(words[words.length - 1]);
}

/**
 * Valida se nome tem pelo menos nome e sobrenome
 * 
 * @param fullName - Nome completo
 * @returns true se válido
 * 
 * @example
 * isValidFullName('João Silva')  // true
 * isValidFullName('João')        // false
 */
export function isValidFullName(fullName: string): boolean {
  if (!fullName || typeof fullName !== 'string') {
    return false;
  }

  const cleanName = fullName.trim();
  const words = cleanName.split(' ').filter(word => word.length > 0);
  
  return words.length >= 2;
}

/**
 * Gera um código de presença aleatório de 6 dígitos
 * 
 * Formato: NNNNNN (6 dígitos numéricos)
 * Exemplo: 123456, 789012
 * 
 * Nota: Esta função é usada apenas para preview no frontend.
 * O código real é gerado pelo backend ao abrir a aula.
 * 
 * @returns string com 6 dígitos
 * 
 * @example
 * ```tsx
 * const code = generatePresenceCode();
 * console.log(code); // "847293"
 * ```
 */
export function generatePresenceCode(): string {
  const min = 100000; // Mínimo 6 dígitos
  const max = 999999; // Máximo 6 dígitos
  const code = Math.floor(Math.random() * (max - min + 1)) + min;
  return code.toString();
}

/**
 * Formata um código de presença para exibição
 * 
 * Divide em dois grupos de 3 dígitos para facilitar leitura
 * 
 * @param code - Código de 6 dígitos
 * @returns string formatada (XXX XXX)
 * 
 * @example
 * ```tsx
 * const formatted = formatPresenceCode("123456");
 * console.log(formatted); // "123 456"
 * ```
 */
export function formatPresenceCode(code: string): string {
  if (!code || code.length !== 6) {
    return code;
  }
  
  return `${code.substring(0, 3)} ${code.substring(3)}`;
}

/**
 * Calcula o tempo restante até o fechamento automático da aula
 * 
 * As aulas permanecem abertas por 20 minutos (1200 segundos)
 * após a abertura.
 * 
 * @param openedAt - Timestamp ISO de quando a aula foi aberta
 * @returns Segundos restantes (0 se já passou o tempo)
 * 
 * @example
 * ```tsx
 * const remaining = getTimeRemainingToClose(lesson.openedAt);
 * console.log(remaining); // 845 (segundos)
 * ```
 */
export function getTimeRemainingToClose(openedAt: string): number {
  const LESSON_DURATION_SECONDS = 20 * 60; // 20 minutos
  
  const openedTime = new Date(openedAt).getTime();
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - openedTime) / 1000);
  
  const remaining = LESSON_DURATION_SECONDS - elapsedSeconds;
  
  return Math.max(0, remaining);
}

/**
 * Formata segundos para formato MM:SS
 * 
 * @param seconds - Total de segundos
 * @returns string no formato MM:SS
 * 
 * @example
 * ```tsx
 * const formatted = formatSecondsToMMSS(845);
 * console.log(formatted); // "14:05"
 * ```
 */
export function formatSecondsToMMSS(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

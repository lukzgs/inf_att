import { FiAlertTriangle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { calculateRemainingAbsences } from '@/utils/attendance/calculateFrequency';
import type { StudentClassWithStats } from '@/hooks/useStudentClasses';

interface LowFrequencyAlertProps {
  /** Disciplinas com frequência baixa (< 80%) */
  classes: StudentClassWithStats[];
}

/**
 * Componente de alerta para disciplinas com frequência baixa
 * 
 * Exibe um banner de aviso quando o aluno tem disciplinas com frequência
 * abaixo de 80%, mostrando quantas faltas ainda são permitidas.
 * 
 * @example
 * ```tsx
 * const lowFrequencyClasses = classes.filter(c => c.attendancePercentage < 80);
 * 
 * <LowFrequencyAlert classes={lowFrequencyClasses} />
 * ```
 */
export function LowFrequencyAlert({ classes }: LowFrequencyAlertProps) {
  // Não mostrar se não houver disciplinas com frequência baixa
  if (!classes || classes.length === 0) {
    return null;
  }

  // Disciplinas críticas (< 75%)
  const criticalClasses = classes.filter(c => c.attendancePercentage < 75);
  
  // Disciplinas em alerta (75-79%)
  const warningClasses = classes.filter(
    c => c.attendancePercentage >= 75 && c.attendancePercentage < 80
  );

  return (
    <div className="space-y-3">
      {/* Critical Alert - Reprovação por frequência */}
      {criticalClasses.length > 0 && (
        <div className="alert alert-error shadow-lg">
          <FiAlertTriangle className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-base">
              {criticalClasses.length === 1
                ? 'Atenção: Risco de Reprovação!'
                : `Atenção: ${criticalClasses.length} Disciplinas em Risco!`}
            </h3>
            <div className="text-sm mt-1 space-y-2">
              {criticalClasses.map((cls) => {
                const remaining = calculateRemainingAbsences(
                  cls.totalPresent,
                  cls.totalLessons,
                  75
                );
                
                return (
                  <div key={cls.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <span className="font-semibold">{cls.subject?.name}</span>
                      <span className="opacity-90"> - Frequência: {cls.attendancePercentage}%</span>
                    </div>
                    <div className="text-xs sm:text-sm">
                      {remaining === 0 ? (
                        <span className="font-bold">
                          ❌ Já reprovou por frequência
                        </span>
                      ) : (
                        <span>
                          Você pode faltar <strong>apenas {remaining}</strong> {remaining === 1 ? 'aula' : 'aulas'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Warning Alert - Frequência baixa mas ainda aprovado */}
      {warningClasses.length > 0 && (
        <div className="alert alert-warning shadow-lg">
          <FiAlertTriangle className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-base">
              {warningClasses.length === 1
                ? 'Cuidado: Frequência Baixa'
                : `Cuidado: ${warningClasses.length} Disciplinas com Frequência Baixa`}
            </h3>
            <div className="text-sm mt-1 space-y-2">
              {warningClasses.map((cls) => {
                const remaining = calculateRemainingAbsences(
                  cls.totalPresent,
                  cls.totalLessons,
                  75
                );
                
                return (
                  <div key={cls.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <span className="font-semibold">{cls.subject?.name}</span>
                      <span className="opacity-90"> - Frequência: {cls.attendancePercentage}%</span>
                    </div>
                    <div className="text-xs sm:text-sm">
                      Você pode faltar <strong>{remaining}</strong> {remaining === 1 ? 'aula' : 'aulas'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        <Link 
          to="#" 
          className="link link-primary text-sm"
          onClick={(e) => {
            e.preventDefault();
            // Scroll to classes section
            document.querySelector('#minhas-disciplinas')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
        >
          Ver disciplinas →
        </Link>
      </div>
    </div>
  );
}

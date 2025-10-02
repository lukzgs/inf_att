import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * Input Component - Baseado em DaisyUI
 * 
 * Usa classes DaisyUI como base para consistência com o design system.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'input input-bordered w-full',
            error && 'input-error',
            className,
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <label className="label">
            <span className={cn('label-text-alt', error && 'text-error')}>
              {helperText}
            </span>
          </label>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };


import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Button Component - Baseado em DaisyUI + CVA para variantes extras
 * 
 * Usa classes DaisyUI como base para consistência com o design system,
 * e CVA apenas para variantes adicionais não suportadas pelo DaisyUI.
 */
const buttonVariants = cva(
  // Base: usa btn do DaisyUI como fundação
  'btn',
  {
    variants: {
      variant: {
        default: 'btn-accent',
        secondary: 'btn-secondary',
        accent: 'btn-accent',
        ghost: 'btn-ghost',
        link: 'btn-link',
        outline: 'btn-outline',
        error: 'btn-error',
        success: 'btn-success',
        warning: 'btn-warning',
        info: 'btn-info',
      },
      size: {
        default: '',
        xs: 'btn-xs',
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg',
        wide: 'btn-wide',
        block: 'btn-block',
        square: 'btn-square',
        circle: 'btn-circle',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

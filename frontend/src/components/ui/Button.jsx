import * as React from 'react';
import { cn } from '@/lib/utils';

const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default:
        'bg-brand text-[#0f0f0f] hover:bg-brand-light shadow-lg shadow-brand/30',
      outline:
        'border border-input bg-transparent hover:bg-secondary text-foreground',
      ghost: 'hover:bg-secondary text-foreground',
      link: 'text-brand underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-11 px-6 py-2',
      sm: 'h-9 px-4 text-sm',
      lg: 'h-12 px-8 text-lg',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };

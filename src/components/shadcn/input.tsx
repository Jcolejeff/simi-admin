import * as React from 'react';

import { cn } from 'lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'border-input ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm !ring-0 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-gray-200 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:border-gray-200 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };

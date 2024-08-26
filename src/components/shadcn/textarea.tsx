import * as React from 'react';

import { cn } from 'lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm  placeholder:text-muted-foreground focus-within:border-gray-200 focus-visible:outline-none  focus-visible:ring-0 focus-visible:ring-offset-0 active:border-gray-200 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };

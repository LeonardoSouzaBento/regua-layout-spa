import * as React from 'react';

type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
};

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, style, ...props }, ref) => {
    const orientationClasses = orientation === 'horizontal' ? 'h-px w-full scale-y-90' : 'h-full w-px scale-x-90';

    const ariaProps = decorative
      ? { role: 'none' as const }
      : {
          role: 'separator' as const,
          'aria-orientation': orientation,
        };

    return (
      <div
        ref={ref}
        className={`shrink-0 bg-border opacity-75 ${orientationClasses} ${className}`}
        style={style}
        {...ariaProps}
        {...props}
      />
    );
  },
);
Separator.displayName = 'Separator';

export { Separator };

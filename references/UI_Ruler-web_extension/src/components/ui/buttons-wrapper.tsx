import React, { type ReactNode } from 'react';

interface ButtonsWrapperProps {
  children: ReactNode;
  className?: string;
  gap?: number;
}

export const ButtonsWrapper: React.FC<ButtonsWrapperProps> = ({
  children,
  className = '',
  gap = 3,
}) => {
  return (
    <div className={`h-auto flex flex-wrap items-center gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

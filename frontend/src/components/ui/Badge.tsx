import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'severe' | 'mild' | 'low' | 'reported' | 'in_progress' | 'resolved';
  size?: 'sm' | 'md';
}

const Badge = ({ children, variant = 'reported', size = 'md' }: BadgeProps) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full border';
  
  const variants = {
    severe: 'status-severe',
    mild: 'status-mild', 
    low: 'status-low',
    reported: 'status-reported',
    in_progress: 'status-in-progress',
    resolved: 'status-resolved'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm'
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export default Badge;
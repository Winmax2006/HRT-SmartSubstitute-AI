
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  icon, 
  action,
  active = false,
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-900 rounded-xl p-6 transition-all duration-300
        ${active 
          ? 'border border-indigo-500 dark:border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] -translate-y-1' 
          : 'border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none hover:shadow-md hover:-translate-y-1'
        }
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {(title || icon || action) && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {icon && <div className="text-indigo-500 dark:text-indigo-400 text-xl">{icon}</div>}
            {title && <h3 className={`text-xl font-semibold ${active ? 'text-indigo-900 dark:text-white' : 'text-slate-800 dark:text-slate-100'}`}>{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

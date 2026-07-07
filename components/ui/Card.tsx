
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
        bg-white rounded-[2rem] p-8 transition-all duration-300
        border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {(title || icon || action) && (
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {icon && <div className="text-blue-600 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center p-2">{icon}</div>}
            {title && <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

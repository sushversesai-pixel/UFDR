import React from 'react';
import { CheckCircle2, Clock, PlayCircle, AlertTriangle } from 'lucide-react';
import './ui.css';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', icon = false }) => {
  const renderIcon = () => {
    if (!icon) return null;
    switch (variant) {
      case 'success': return <CheckCircle2 size={14} />;
      case 'warning': return <Clock size={14} />;
      case 'danger': return <AlertTriangle size={14} />;
      case 'info': return <PlayCircle size={14} />;
      default: return null;
    }
  };

  return (
    <span className={`ui-badge badge-${variant}`}>
      {renderIcon()}
      {children}
    </span>
  );
};

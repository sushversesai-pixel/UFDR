import React from 'react';
import './ui.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverable = false }) => {
  return (
    <div 
      className={`ui-card card-glass ${hoverable ? 'hoverable' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

import React from 'react';
import './ui.css';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  subLabel?: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label, 
  subLabel,
  color = 'var(--accent-color)' 
}) => {
  return (
    <div className="ui-progress-container">
      {(label || subLabel) && (
        <div className="ui-progress-header">
          {label && <span className="ui-progress-label">{label}</span>}
          {subLabel && <span className="ui-progress-sublabel">{subLabel}</span>}
        </div>
      )}
      <div className="ui-progress-track">
        <div 
          className="ui-progress-fill" 
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

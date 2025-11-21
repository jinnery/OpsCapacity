import React from 'react';

interface CapacityIndicatorProps {
  usage: number;
  label?: string;
}

const CapacityIndicator: React.FC<CapacityIndicatorProps> = ({ usage, label }) => {
  const getCapacityClass = (usage: number): string => {
    if (usage >= 80) return 'capacity-high';
    if (usage >= 60) return 'capacity-medium';
    return 'capacity-low';
  };

  const getCapacityColor = (usage: number): string => {
    if (usage >= 80) return '#e74c3c';
    if (usage >= 60) return '#f39c12';
    return '#27ae60';
  };

  return (
    <div>
      {label && <div className="metric-label">{label}</div>}
      <div className="metric-value">{usage.toFixed(1)}%</div>
      <div className="capacity-indicator">
        <div
          className={`capacity-bar ${getCapacityClass(usage)}`}
          style={{ width: `${Math.min(usage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default CapacityIndicator;
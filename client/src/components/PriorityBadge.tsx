import React from 'react';

interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getBadgeClass = (priority: string): string => {
    switch (priority) {
      case 'P1':
        return 'priority-p1';
      case 'P2':
        return 'priority-p2';
      case 'P3':
        return 'priority-p3';
      case 'P4':
        return 'priority-p4';
      default:
        return 'priority-p4';
    }
  };

  return (
    <span className={`priority-badge ${getBadgeClass(priority)}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
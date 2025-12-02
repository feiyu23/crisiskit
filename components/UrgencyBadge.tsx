import React from 'react';
import { UrgencyLevel } from '../types';

export const UrgencyBadge: React.FC<{ level: UrgencyLevel }> = ({ level }) => {
  const styles = {
    CRITICAL: 'bg-danger-100 text-danger-600 ring-danger-600/10',
    MODERATE: 'bg-warning-100 text-warning-600 ring-warning-600/10',
    LOW: 'bg-success-100 text-success-600 ring-success-600/10',
    UNKNOWN: 'bg-gray-100 text-gray-600 ring-gray-600/10',
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[level]}`}>
      {level}
    </span>
  );
};
import React from 'react';
import { ResponseStatus } from '../types';
import { Clock, PlayCircle, CheckCircle, Copy } from 'lucide-react';

interface StatusBadgeProps {
  status: ResponseStatus;
  compact?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'pending', compact = false }) => {
  const getStatusConfig = (s: ResponseStatus) => {
    switch (s) {
      case 'pending':
        return {
          icon: Clock,
          label: 'Pending',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300'
        };
      case 'in_progress':
        return {
          icon: PlayCircle,
          label: 'In Progress',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-300'
        };
      case 'resolved':
        return {
          icon: CheckCircle,
          label: 'Resolved',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          borderColor: 'border-green-300'
        };
      case 'duplicate':
        return {
          icon: Copy,
          label: 'Duplicate',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-700',
          borderColor: 'border-purple-300'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      <Icon className="w-3 h-3" />
      {!compact && config.label}
    </span>
  );
};

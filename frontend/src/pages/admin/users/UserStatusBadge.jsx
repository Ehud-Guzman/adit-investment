import React from 'react';
import PropTypes from 'prop-types';
import { 
  CheckCircleIcon, 
  LockClosedIcon, 
  TrashIcon,
  ExclamationCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const statusConfig = {
  active: {
    label: 'Active',
    icon: <CheckCircleIcon className="h-4 w-4" />,
    bg: 'bg-green-100',
    text: 'text-green-800',
    iconColor: 'text-green-500',
    pulse: false
  },
  locked: {
    label: 'Locked',
    icon: <LockClosedIcon className="h-4 w-4" />,
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    iconColor: 'text-amber-500',
    pulse: false
  },
  suspended: {
    label: 'Suspended',
    icon: <ExclamationCircleIcon className="h-4 w-4" />,
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    iconColor: 'text-orange-500',
    pulse: true
  },
  deleted: {
    label: 'Deleted',
    icon: <TrashIcon className="h-4 w-4" />,
    bg: 'bg-red-100',
    text: 'text-red-800',
    iconColor: 'text-red-500',
    pulse: false
  },
  pending: {
    label: 'Pending',
    icon: <UserIcon className="h-4 w-4" />,
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    iconColor: 'text-blue-500',
    pulse: true
  }
};

const UserStatusBadge = ({ status, size = 'md', showIcon = true }) => {
  const config = statusConfig[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    icon: <UserIcon className="h-4 w-4" />,
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    iconColor: 'text-gray-500',
    pulse: false
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <div 
      className={`
        inline-flex items-center rounded-full font-medium
        ${config.bg} ${config.text} ${sizeClasses[size]}
        transition-all duration-200 hover:opacity-90
        ${config.pulse ? 'animate-pulse' : ''}
      `}
      title={`User status: ${config.label}`}
      aria-label={`User status: ${config.label}`}
    >
      {showIcon && (
        <span className={`mr-1.5 ${config.iconColor}`}>
          {config.icon}
        </span>
      )}
      {config.label}
    </div>
  );
};

UserStatusBadge.propTypes = {
  status: PropTypes.oneOf([
    'active', 
    'locked', 
    'suspended', 
    'deleted', 
    'pending'
  ]).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showIcon: PropTypes.bool
};

export default UserStatusBadge;
"use client";

import React from 'react';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending' | 'completed' | 'in-progress' | 'cancelled';
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'soft';
  showIcon?: boolean;
  className?: string;
}

export default function StatusBadge({
  status,
  label,
  size = 'md',
  variant = 'soft',
  showIcon = false,
  className = ''
}: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return {
          icon: '✓',
          solid: 'bg-green-600 text-white',
          outline: 'border-green-600 text-green-600 dark:text-green-400',
          soft: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        };
      case 'warning':
      case 'pending':
        return {
          icon: '⚠',
          solid: 'bg-yellow-600 text-white',
          outline: 'border-yellow-600 text-yellow-600 dark:text-yellow-400',
          soft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        };
      case 'error':
      case 'cancelled':
        return {
          icon: '✕',
          solid: 'bg-red-600 text-white',
          outline: 'border-red-600 text-red-600 dark:text-red-400',
          soft: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        };
      case 'info':
        return {
          icon: 'ℹ',
          solid: 'bg-blue-600 text-white',
          outline: 'border-blue-600 text-blue-600 dark:text-blue-400',
          soft: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
        };
      case 'in-progress':
        return {
          icon: '⟳',
          solid: 'bg-indigo-600 text-white',
          outline: 'border-indigo-600 text-indigo-600 dark:text-indigo-400',
          soft: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
        };
      case 'neutral':
      default:
        return {
          icon: '•',
          solid: 'bg-gray-600 text-white',
          outline: 'border-gray-600 text-gray-600 dark:text-gray-400',
          soft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-3 py-1.5 text-sm';
      default:
        return 'px-2.5 py-1 text-sm';
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);
  const variantClasses = config[variant as keyof typeof config];

  return (
    <span
      className={`
        inline-flex items-center space-x-1 rounded-full font-medium
        ${variant === 'outline' ? 'border' : ''}
        ${variantClasses}
        ${sizeClasses}
        ${className}
      `}
    >
      {showIcon && (
        <span className="flex-shrink-0">
          {config.icon}
        </span>
      )}
      <span className="truncate">{label}</span>
    </span>
  );
}

// Predefined status badges for common use cases
export const StatusBadges = {
  // Order Status
  OrderPending: () => <StatusBadge status="pending" label="Pending" showIcon />,
  OrderProcessing: () => <StatusBadge status="in-progress" label="Processing" showIcon />,
  OrderCompleted: () => <StatusBadge status="completed" label="Completed" showIcon />,
  OrderCancelled: () => <StatusBadge status="cancelled" label="Cancelled" showIcon />,

  // Inventory Status
  InStock: () => <StatusBadge status="success" label="In Stock" showIcon />,
  LowStock: () => <StatusBadge status="warning" label="Low Stock" showIcon />,
  OutOfStock: () => <StatusBadge status="error" label="Out of Stock" showIcon />,

  // Production Status
  ProductionActive: () => <StatusBadge status="in-progress" label="Active" showIcon />,
  ProductionPaused: () => <StatusBadge status="warning" label="Paused" showIcon />,
  ProductionCompleted: () => <StatusBadge status="completed" label="Completed" showIcon />,

  // Quality Status
  QualityPassed: () => <StatusBadge status="success" label="Passed" showIcon />,
  QualityFailed: () => <StatusBadge status="error" label="Failed" showIcon />,
  QualityPending: () => <StatusBadge status="pending" label="Pending Review" showIcon />,

  // Alert Status
  AlertCritical: () => <StatusBadge status="error" label="Critical" showIcon />,
  AlertHigh: () => <StatusBadge status="warning" label="High" showIcon />,
  AlertMedium: () => <StatusBadge status="info" label="Medium" showIcon />,
  AlertLow: () => <StatusBadge status="neutral" label="Low" showIcon />
};

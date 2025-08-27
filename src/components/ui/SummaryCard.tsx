"use client";

import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    period: string;
  };
  progress?: {
    current: number;
    target: number;
    unit: string;
  };
  status?: {
    type: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    label: string;
  };
  actions?: {
    label: string;
    icon: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  }[];
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  compact?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  progress,
  status,
  actions,
  color = 'blue',
  compact = false,
  clickable = false,
  onClick
}: SummaryCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-600 dark:text-blue-400',
          icon: 'text-blue-500 dark:text-blue-400'
        };
      case 'green':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-600 dark:text-green-400',
          icon: 'text-green-500 dark:text-green-400'
        };
      case 'red':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-600 dark:text-red-400',
          icon: 'text-red-500 dark:text-red-400'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-600 dark:text-yellow-400',
          icon: 'text-yellow-500 dark:text-yellow-400'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/20',
          border: 'border-purple-200 dark:border-purple-800',
          text: 'text-purple-600 dark:text-purple-400',
          icon: 'text-purple-500 dark:text-purple-400'
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-900/20',
          border: 'border-indigo-200 dark:border-indigo-800',
          text: 'text-indigo-600 dark:text-indigo-400',
          icon: 'text-indigo-500 dark:text-indigo-400'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-200 dark:border-gray-700',
          text: 'text-gray-600 dark:text-gray-400',
          icon: 'text-gray-500 dark:text-gray-400'
        };
    }
  };

  const getStatusClasses = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getActionVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-indigo-600 hover:bg-indigo-700 text-white';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      default:
        return 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };

  const colors = getColorClasses(color);
  const progressPercentage = progress ? (progress.current / progress.target) * 100 : 0;

  return (
    <div 
      className={`
        ${colors.bg} ${colors.border} border rounded-lg p-4 transition-all duration-200
        ${clickable ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''}
        ${compact ? 'p-3' : 'p-4'}
      `}
      onClick={clickable ? onClick : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-2">
            {icon && (
              <span className={`${colors.icon} ${compact ? 'text-lg' : 'text-xl'}`}>
                {icon}
              </span>
            )}
            <h3 className={`${colors.text} font-medium ${compact ? 'text-sm' : 'text-base'} truncate`}>
              {title}
            </h3>
            {status && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(status.type)}`}>
                {status.label}
              </span>
            )}
          </div>

          {/* Value */}
          <div className="mb-2">
            <p className={`text-2xl font-bold text-gray-900 dark:text-gray-100 ${compact ? 'text-xl' : 'text-2xl'}`}>
              {value}
            </p>
            {subtitle && (
              <p className={`text-sm text-gray-600 dark:text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Trend Indicator */}
          {trend && (
            <div className="flex items-center space-x-1 mb-2">
              <span className={`text-sm font-medium ${
                trend.direction === 'up' ? 'text-green-600 dark:text-green-400' :
                trend.direction === 'down' ? 'text-red-600 dark:text-red-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
              </span>
              <span className={`text-sm ${
                trend.direction === 'up' ? 'text-green-600 dark:text-green-400' :
                trend.direction === 'down' ? 'text-red-600 dark:text-red-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {Math.abs(trend.percentage)}% {trend.period}
              </span>
            </div>
          )}

          {/* Progress Bar */}
          {progress && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>{progress.current} {progress.unit}</span>
                <span>{progress.target} {progress.unit}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progressPercentage >= 80 ? 'bg-green-500' :
                    progressPercentage >= 60 ? 'bg-yellow-500' :
                    progressPercentage >= 40 ? 'bg-blue-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {actions && actions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.action();
                  }}
                  className={`
                    ${getActionVariantClasses(action.variant || 'default')}
                    px-2 py-1 rounded text-xs font-medium transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  `}
                >
                  <span className="mr-1">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

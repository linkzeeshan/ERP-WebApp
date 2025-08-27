"use client";

import React, { useState } from 'react';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  tooltip?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
  compact?: boolean;
  showLabels?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export default function QuickActions({ 
  actions, 
  title,
  compact = false,
  showLabels = true,
  orientation = 'horizontal'
}: QuickActionsProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white border-red-600';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white border-green-600';
      default:
        return 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };

  const handleAction = (action: QuickAction) => {
    if (!action.disabled) {
      action.action();
    }
  };

  return (
    <div className={`${orientation === 'vertical' ? 'flex flex-col' : 'flex flex-wrap'} gap-2`}>
      {title && (
        <h3 className={`font-medium text-gray-700 dark:text-gray-300 ${compact ? 'text-sm' : 'text-base'} mb-2`}>
          {title}
        </h3>
      )}
      
      <div className={`flex ${orientation === 'vertical' ? 'flex-col' : 'flex-wrap'} gap-2`}>
        {actions.map((action) => (
          <div key={action.id} className="relative">
            <button
              onClick={() => handleAction(action)}
              disabled={action.disabled}
              onMouseEnter={() => setShowTooltip(action.id)}
              onMouseLeave={() => setShowTooltip(null)}
              className={`
                ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'}
                ${showLabels ? 'flex items-center space-x-2' : 'flex items-center justify-center'}
                border rounded-md font-medium transition-all duration-200
                ${getVariantClasses(action.variant || 'default')}
                ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${compact ? 'min-w-8' : 'min-w-10'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              `}
            >
              <span className={`${compact ? 'text-sm' : 'text-base'}`}>
                {action.icon}
              </span>
              {showLabels && (
                <span className={`${compact ? 'text-xs' : 'text-sm'} hidden sm:inline`}>
                  {action.label}
                </span>
              )}
            </button>
            
            {/* Tooltip */}
            {action.tooltip && showTooltip === action.id && (
              <div className="absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-md shadow-lg -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                {action.tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Predefined action sets
export const commonActions = {
  export: (onExport: () => void): QuickAction => ({
    id: 'export',
    label: 'Export',
    icon: '📤',
    action: onExport,
    variant: 'primary',
    tooltip: 'Export data to Excel/CSV'
  }),
  
  print: (onPrint: () => void): QuickAction => ({
    id: 'print',
    label: 'Print',
    icon: '🖨️',
    action: onPrint,
    variant: 'secondary',
    tooltip: 'Print current view'
  }),
  
  share: (onShare: () => void): QuickAction => ({
    id: 'share',
    label: 'Share',
    icon: '📤',
    action: onShare,
    variant: 'success',
    tooltip: 'Share report'
  }),
  
  refresh: (onRefresh: () => void): QuickAction => ({
    id: 'refresh',
    label: 'Refresh',
    icon: '🔄',
    action: onRefresh,
    variant: 'secondary',
    tooltip: 'Refresh data'
  }),
  
  download: (onDownload: () => void): QuickAction => ({
    id: 'download',
    label: 'Download',
    icon: '⬇️',
    action: onDownload,
    variant: 'primary',
    tooltip: 'Download report'
  }),
  
  delete: (onDelete: () => void): QuickAction => ({
    id: 'delete',
    label: 'Delete',
    icon: '🗑️',
    action: onDelete,
    variant: 'danger',
    tooltip: 'Delete item'
  })
};

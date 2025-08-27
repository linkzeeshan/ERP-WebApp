"use client";

import React from 'react';

interface ActionButton {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
}

interface ActionButtonsProps {
  actions: ActionButton[];
  title?: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
  compact?: boolean;
  showLabels?: boolean;
  responsive?: boolean;
  className?: string;
}

export default function ActionButtons({
  actions,
  title,
  layout = 'horizontal',
  compact = false,
  showLabels = true,
  responsive = true,
  className = ''
}: ActionButtonsProps) {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white border-indigo-600';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white border-gray-600';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white border-red-600';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white border-green-600';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white border-yellow-600';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white border-blue-600';
      default:
        return 'bg-white hover:bg-gray-50 focus:ring-gray-500 text-gray-700 border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const getLayoutClasses = (layout: string) => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col space-y-2';
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2';
      default:
        return 'flex flex-wrap gap-2';
    }
  };

  const handleAction = (action: ActionButton) => {
    if (!action.disabled && !action.loading) {
      action.action();
    }
  };

  return (
    <div className={`${className}`}>
      {title && (
        <h3 className={`font-medium text-gray-700 dark:text-gray-300 mb-3 ${compact ? 'text-sm' : 'text-base'}`}>
          {title}
        </h3>
      )}
      
      <div className={getLayoutClasses(layout)}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action)}
            disabled={action.disabled || action.loading}
            className={`
              ${getVariantClasses(action.variant || 'default')}
              ${getSizeClasses(action.size || 'md')}
              ${compact ? 'text-xs px-2 py-1' : ''}
              ${showLabels ? 'flex items-center space-x-2' : 'flex items-center justify-center'}
              ${responsive ? 'w-full sm:w-auto' : ''}
              border rounded-md font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:shadow-sm active:scale-95
            `}
            title={action.tooltip}
          >
            {action.loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <span className={`${compact ? 'text-sm' : 'text-base'}`}>
                {action.icon}
              </span>
            )}
            {showLabels && (
              <span className={`${compact ? 'text-xs' : 'text-sm'} ${responsive ? 'hidden sm:inline' : ''}`}>
                {action.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Predefined action sets for common use cases
export const CommonActions = {
  // CRUD Operations
  create: (onCreate: () => void, label = 'Create'): ActionButton => ({
    id: 'create',
    label,
    icon: '➕',
    action: onCreate,
    variant: 'success',
    tooltip: 'Create new item'
  }),

  edit: (onEdit: () => void, label = 'Edit'): ActionButton => ({
    id: 'edit',
    label,
    icon: '✏️',
    action: onEdit,
    variant: 'primary',
    tooltip: 'Edit item'
  }),

  delete: (onDelete: () => void, label = 'Delete'): ActionButton => ({
    id: 'delete',
    label,
    icon: '🗑️',
    action: onDelete,
    variant: 'danger',
    tooltip: 'Delete item'
  }),

  view: (onView: () => void, label = 'View'): ActionButton => ({
    id: 'view',
    label,
    icon: '👁️',
    action: onView,
    variant: 'info',
    tooltip: 'View details'
  }),

  // Data Operations
  export: (onExport: () => void, label = 'Export'): ActionButton => ({
    id: 'export',
    label,
    icon: '📤',
    action: onExport,
    variant: 'primary',
    tooltip: 'Export data'
  }),

  import: (onImport: () => void, label = 'Import'): ActionButton => ({
    id: 'import',
    label,
    icon: '📥',
    action: onImport,
    variant: 'secondary',
    tooltip: 'Import data'
  }),

  download: (onDownload: () => void, label = 'Download'): ActionButton => ({
    id: 'download',
    label,
    icon: '⬇️',
    action: onDownload,
    variant: 'primary',
    tooltip: 'Download file'
  }),

  print: (onPrint: () => void, label = 'Print'): ActionButton => ({
    id: 'print',
    label,
    icon: '🖨️',
    action: onPrint,
    variant: 'secondary',
    tooltip: 'Print document'
  }),

  // Status Operations
  approve: (onApprove: () => void, label = 'Approve'): ActionButton => ({
    id: 'approve',
    label,
    icon: '✅',
    action: onApprove,
    variant: 'success',
    tooltip: 'Approve item'
  }),

  reject: (onReject: () => void, label = 'Reject'): ActionButton => ({
    id: 'reject',
    label,
    icon: '❌',
    action: onReject,
    variant: 'danger',
    tooltip: 'Reject item'
  }),

  pause: (onPause: () => void, label = 'Pause'): ActionButton => ({
    id: 'pause',
    label,
    icon: '⏸️',
    action: onPause,
    variant: 'warning',
    tooltip: 'Pause operation'
  }),

  resume: (onResume: () => void, label = 'Resume'): ActionButton => ({
    id: 'resume',
    label,
    icon: '▶️',
    action: onResume,
    variant: 'success',
    tooltip: 'Resume operation'
  }),

  // Navigation
  back: (onBack: () => void, label = 'Back'): ActionButton => ({
    id: 'back',
    label,
    icon: '⬅️',
    action: onBack,
    variant: 'secondary',
    tooltip: 'Go back'
  }),

  next: (onNext: () => void, label = 'Next'): ActionButton => ({
    id: 'next',
    label,
    icon: '➡️',
    action: onNext,
    variant: 'primary',
    tooltip: 'Continue'
  }),

  save: (onSave: () => void, label = 'Save'): ActionButton => ({
    id: 'save',
    label,
    icon: '💾',
    action: onSave,
    variant: 'success',
    tooltip: 'Save changes'
  }),

  cancel: (onCancel: () => void, label = 'Cancel'): ActionButton => ({
    id: 'cancel',
    label,
    icon: '❌',
    action: onCancel,
    variant: 'secondary',
    tooltip: 'Cancel operation'
  })
};

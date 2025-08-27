"use client";

import React from 'react';

interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  onNavigate?: (item: BreadcrumbItem) => void;
  showHome?: boolean;
  compact?: boolean;
}

export default function BreadcrumbNav({ 
  items, 
  onNavigate, 
  showHome = true,
  compact = false 
}: BreadcrumbNavProps) {
  const handleClick = (item: BreadcrumbItem, index: number) => {
    if (onNavigate && index < items.length - 1) {
      onNavigate(item);
    }
  };

  const allItems = showHome 
    ? [{ id: 'home', label: 'Home', href: '/', icon: '🏠' }, ...items]
    : items;

  return (
    <nav className={`flex ${compact ? 'text-sm' : 'text-base'} text-gray-600 dark:text-gray-400`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-2">
        {allItems.map((item, index) => (
          <li key={item.id} className="flex items-center">
            {index > 0 && (
              <svg 
                className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} mx-1 md:mx-2 text-gray-400`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            
            <button
              onClick={() => handleClick(item, index)}
              disabled={index === allItems.length - 1}
              className={`flex items-center space-x-1 md:space-x-2 px-2 py-1 rounded-md transition-colors duration-200 ${
                index === allItems.length - 1
                  ? 'text-gray-900 dark:text-gray-100 font-medium cursor-default'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
              }`}
            >
              {item.icon && (
                <span className={`${compact ? 'text-xs' : 'text-sm'}`}>
                  {item.icon}
                </span>
              )}
              <span className={`${compact ? 'text-xs' : 'text-sm'} truncate max-w-20 md:max-w-none`}>
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

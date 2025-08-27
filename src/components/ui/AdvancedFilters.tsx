"use client";

import React, { useState, useEffect } from 'react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterConfig {
  id: string;
  label: string;
  type: 'search' | 'select' | 'multiselect' | 'range' | 'date' | 'toggle';
  options?: FilterOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

interface FilterValue {
  [key: string]: string | string[] | number[] | boolean;
}

interface AdvancedFiltersProps {
  filters: FilterConfig[];
  onFiltersChange: (filters: FilterValue) => void;
  showSearch?: boolean;
  showClearAll?: boolean;
  compact?: boolean;
}

export default function AdvancedFilters({
  filters,
  onFiltersChange,
  showSearch = true,
  showClearAll = true,
  compact = false
}: AdvancedFiltersProps) {
  const [filterValues, setFilterValues] = useState<FilterValue>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize filter values
  useEffect(() => {
    const initialValues: FilterValue = {};
    filters.forEach(filter => {
      switch (filter.type) {
        case 'search':
          initialValues[filter.id] = '';
          break;
        case 'multiselect':
          initialValues[filter.id] = [];
          break;
        case 'range':
          initialValues[filter.id] = [filter.min || 0, filter.max || 100];
          break;
        case 'toggle':
          initialValues[filter.id] = false;
          break;
        default:
          initialValues[filter.id] = '';
      }
    });
    setFilterValues(initialValues);
  }, [filters]);

  const handleFilterChange = (filterId: string, value: any) => {
    const newValues = { ...filterValues, [filterId]: value };
    setFilterValues(newValues);
    onFiltersChange(newValues);
  };

  const clearAllFilters = () => {
    const clearedValues: FilterValue = {};
    filters.forEach(filter => {
      switch (filter.type) {
        case 'search':
          clearedValues[filter.id] = '';
          break;
        case 'multiselect':
          clearedValues[filter.id] = [];
          break;
        case 'range':
          clearedValues[filter.id] = [filter.min || 0, filter.max || 100];
          break;
        case 'toggle':
          clearedValues[filter.id] = false;
          break;
        default:
          clearedValues[filter.id] = '';
      }
    });
    setFilterValues(clearedValues);
    setSearchTerm('');
    onFiltersChange(clearedValues);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filterValues).filter(value => {
      if (Array.isArray(value)) {
        return value.length > 0 && (typeof value[0] === 'string' ? value.some(v => v !== '') : true);
      }
      return value !== '' && value !== false;
    }).length;
  };

  const renderFilter = (filter: FilterConfig) => {
    const value = filterValues[filter.id];

    switch (filter.type) {
      case 'search':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <input
              type="text"
              value={value as string}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              placeholder={filter.placeholder || `Search ${filter.label.toLowerCase()}...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case 'select':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <select
              value={value as string}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All {filter.label}</option>
              {filter.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.count && `(${option.count})`}
                </option>
              ))}
            </select>
          </div>
        );

      case 'multiselect':
        const selectedValues = value as string[];
        return (
          <div key={filter.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filter.options?.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter(v => v !== option.value);
                      handleFilterChange(filter.id, newValues);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {option.label} {option.count && `(${option.count})`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'range':
        const rangeValues = value as number[];
        return (
          <div key={filter.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={rangeValues[0]}
                onChange={(e) => handleFilterChange(filter.id, [parseInt(e.target.value), rangeValues[1]])}
                min={filter.min}
                max={filter.max}
                step={filter.step}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={rangeValues[1]}
                onChange={(e) => handleFilterChange(filter.id, [rangeValues[0], parseInt(e.target.value)])}
                min={filter.min}
                max={filter.max}
                step={filter.step}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        );

      case 'date':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <input
              type="date"
              value={value as string}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case 'toggle':
        return (
          <div key={filter.id} className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <button
              type="button"
              onClick={() => handleFilterChange(filter.id, !value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                value ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            {getActiveFiltersCount() > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getActiveFiltersCount()} active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {showClearAll && getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? 'Hide' : 'Show'} filters
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search across all data..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4">
          <div className={`grid gap-4 ${compact ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
            {filters.map(renderFilter)}
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {getActiveFiltersCount() > 0 && (
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => {
              const value = filterValues[filter.id];
              if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'boolean' && !value)) return null;

              let displayValue = '';
              if (Array.isArray(value)) {
                if (filter.type === 'range') {
                  displayValue = `${value[0]} - ${value[1]}`;
                } else {
                  displayValue = value.join(', ');
                }
              } else {
                displayValue = value.toString();
              }

              return (
                <span
                  key={filter.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  <span className="font-medium">{filter.label}:</span>
                  <span className="ml-1">{displayValue}</span>
                  <button
                    onClick={() => {
                      const newValues = { ...filterValues };
                      switch (filter.type) {
                        case 'multiselect':
                          newValues[filter.id] = [];
                          break;
                        case 'range':
                          newValues[filter.id] = [filter.min || 0, filter.max || 100];
                          break;
                        case 'toggle':
                          newValues[filter.id] = false;
                          break;
                        default:
                          newValues[filter.id] = '';
                      }
                      setFilterValues(newValues);
                      onFiltersChange(newValues);
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

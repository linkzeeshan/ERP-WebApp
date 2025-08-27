"use client";

import React, { useState } from 'react';

interface Alert {
  id: string;
  type: 'stock' | 'production' | 'quality' | 'sales' | 'system' | 'financial';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
  threshold: {
    metric: string;
    current: number;
    limit: number;
    unit: string;
  };
  actions?: string[];
  assignee?: string;
  category: string;
}

interface AlertSystemProps {
  alerts: Alert[];
  title?: string;
  showFilters?: boolean;
  maxAlerts?: number;
}

export default function AlertSystem({ 
  alerts, 
  title = "Alert System", 
  showFilters = true,
  maxAlerts = 10 
}: AlertSystemProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stock': return '📦';
      case 'production': return '🏭';
      case 'quality': return '✅';
      case 'sales': return '📈';
      case 'system': return '⚙️';
      case 'financial': return '💰';
      default: return '⚠️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stock': return 'border-l-red-500';
      case 'production': return 'border-l-orange-500';
      case 'quality': return 'border-l-yellow-500';
      case 'sales': return 'border-l-blue-500';
      case 'system': return 'border-l-purple-500';
      case 'financial': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ${unit}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K ${unit}`;
    }
    return `${value.toLocaleString()} ${unit}`;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const filteredAlerts = alerts.filter(alert => {
    if (!showResolved && alert.resolved) return false;
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterType !== 'all' && alert.type !== filterType) return false;
    return true;
  }).slice(0, maxAlerts);

  const criticalAlerts = filteredAlerts.filter(a => a.severity === 'critical' && !a.resolved);
  const highAlerts = filteredAlerts.filter(a => a.severity === 'high' && !a.resolved);
  const mediumAlerts = filteredAlerts.filter(a => a.severity === 'medium' && !a.resolved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <div className="flex items-center space-x-2">
            {criticalAlerts.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {criticalAlerts.length} Critical
              </span>
            )}
            {highAlerts.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {highAlerts.length} High
              </span>
            )}
            {mediumAlerts.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {mediumAlerts.length} Medium
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            View All
          </button>
          <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            Settings
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Severity
              </label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Types</option>
                <option value="stock">Stock</option>
                <option value="production">Production</option>
                <option value="quality">Quality</option>
                <option value="sales">Sales</option>
                <option value="system">System</option>
                <option value="financial">Financial</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-resolved"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="show-resolved" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Show Resolved
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Alerts
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              All systems are running smoothly!
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 ${getTypeColor(alert.type)} border border-gray-200 dark:border-gray-700 p-4 ${
                alert.resolved ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {/* Icon and Severity */}
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-2xl">{getTypeIcon(alert.type)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {alert.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getTimeAgo(alert.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {alert.message}
                    </p>

                    {/* Threshold Information */}
                    {alert.threshold && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {alert.threshold.metric}:
                          </span>
                          <span className={`font-medium ${
                            alert.threshold.current > alert.threshold.limit ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatValue(alert.threshold.current, alert.threshold.unit)} / {formatValue(alert.threshold.limit, alert.threshold.unit)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${
                              alert.threshold.current > alert.threshold.limit ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ 
                              width: `${Math.min((alert.threshold.current / alert.threshold.limit) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {alert.actions && alert.actions.length > 0 && (
                      <div className="flex items-center space-x-2">
                        {alert.actions.map((action, index) => (
                          <button
                            key={index}
                            className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 px-2 py-1 rounded"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col items-end space-y-2 ml-4">
                  {alert.resolved && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Resolved
                    </span>
                  )}
                  {alert.acknowledged && !alert.resolved && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Acknowledged
                    </span>
                  )}
                  <div className="flex items-center space-x-1">
                    {!alert.acknowledged && (
                      <button className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        Acknowledge
                      </button>
                    )}
                    {!alert.resolved && (
                      <button className="text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                        Resolve
                      </button>
                    )}
                    <button className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Alert Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.severity === 'critical' && !a.resolved).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => a.severity === 'high' && !a.resolved).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">High</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {alerts.filter(a => a.severity === 'medium' && !a.resolved).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Medium</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.resolved).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Resolved</div>
          </div>
        </div>
      </div>
    </div>
  );
}

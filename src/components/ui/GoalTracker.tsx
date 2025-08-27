"use client";

import React from 'react';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  period: string;
  category: 'sales' | 'production' | 'inventory' | 'quality' | 'efficiency';
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  description?: string;
}

interface GoalTrackerProps {
  goals: Goal[];
  title?: string;
  showDetails?: boolean;
  compact?: boolean;
}

export default function GoalTracker({ 
  goals, 
  title = "Goal Tracking", 
  showDetails = true,
  compact = false 
}: GoalTrackerProps) {
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number, priority: string) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales': return '📈';
      case 'production': return '🏭';
      case 'inventory': return '📦';
      case 'quality': return '✅';
      case 'efficiency': return '⚡';
      default: return '📊';
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatValue = (value: number, unit: string) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ${unit}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K ${unit}`;
    }
    return `${value.toLocaleString()} ${unit}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span>On Track</span>
          <span className="w-3 h-3 bg-yellow-500 rounded-full ml-2"></span>
          <span>At Risk</span>
          <span className="w-3 h-3 bg-red-500 rounded-full ml-2"></span>
          <span>Behind</span>
        </div>
      </div>

      {/* Goals Grid */}
      <div className={`grid gap-6 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {goals.map((goal) => {
          const progressPercentage = getProgressPercentage(goal.current, goal.target);
          const daysRemaining = getDaysRemaining(goal.endDate);
          const isOverdue = daysRemaining < 0;
          const isAtRisk = daysRemaining <= 7 && progressPercentage < 80;

          return (
            <div
              key={goal.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${
                isOverdue ? 'ring-2 ring-red-500' : isAtRisk ? 'ring-2 ring-yellow-500' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {goal.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {goal.period}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                  {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Progress
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {progressPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progressPercentage, goal.priority)}`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Values */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Current</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatValue(goal.current, goal.unit)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Target</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatValue(goal.target, goal.unit)}
                  </p>
                </div>
              </div>

              {/* Time Remaining */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`text-sm font-medium ${
                    isOverdue ? 'text-red-600' : isAtRisk ? 'text-yellow-600' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
                  </span>
                </div>
                {isOverdue && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Overdue
                  </span>
                )}
                {isAtRisk && !isOverdue && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    At Risk
                  </span>
                )}
              </div>

              {/* Description */}
              {showDetails && goal.description && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {goal.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {showDetails && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Update Progress
                  </button>
                  <button className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    View Details
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      {showDetails && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Goal Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {goals.filter(g => getProgressPercentage(g.current, g.target) >= 100).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {goals.filter(g => {
                  const p = getProgressPercentage(g.current, g.target);
                  return p >= 80 && p < 100;
                }).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">On Track</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {goals.filter(g => {
                  const p = getProgressPercentage(g.current, g.target);
                  return p >= 60 && p < 80;
                }).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">At Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {goals.filter(g => getProgressPercentage(g.current, g.target) < 60).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Behind</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

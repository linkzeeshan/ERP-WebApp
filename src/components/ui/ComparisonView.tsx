"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Area, AreaChart } from 'recharts';

interface ComparisonData {
  period: string;
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
}

interface ComparisonViewProps {
  data: ComparisonData[];
  title?: string;
  metric: string;
  unit: string;
  comparisonType: 'month-over-month' | 'year-over-year' | 'quarter-over-quarter';
  showChart?: boolean;
  showTable?: boolean;
}

export default function ComparisonView({
  data,
  title,
  metric,
  unit,
  comparisonType,
  showChart = true,
  showTable = true
}: ComparisonViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
        return '→';
      default:
        return '→';
    }
  };

  const getTrendColor = (trend: string, isPositive: boolean) => {
    if (trend === 'stable') return 'text-gray-500';
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  const getComparisonLabel = () => {
    switch (comparisonType) {
      case 'month-over-month': return 'MoM';
      case 'year-over-year': return 'YoY';
      case 'quarter-over-quarter': return 'QoQ';
      default: return 'Comparison';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current: {formatValue(payload[0].value)} {unit}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Previous: {formatValue(payload[1].value)} {unit}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Change: {payload[0].payload.changePercentage > 0 ? '+' : ''}{payload[0].payload.changePercentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const chartData = data.map(item => ({
    ...item,
    current: item.current,
    previous: item.previous,
    change: item.change,
    changePercentage: item.changePercentage
  }));

  const totalCurrent = data.reduce((sum, item) => sum + item.current, 0);
  const totalPrevious = data.reduce((sum, item) => sum + item.previous, 0);
  const totalChange = totalCurrent - totalPrevious;
  const totalChangePercentage = totalPrevious > 0 ? (totalChange / totalPrevious) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title || `${metric} ${getComparisonLabel()} Analysis`}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {comparisonType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} comparison
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Period:</span>
          <select
            value={selectedPeriod || 'all'}
            onChange={(e) => setSelectedPeriod(e.target.value === 'all' ? null : e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Periods</option>
            {data.map(item => (
              <option key={item.period} value={item.period}>{item.period}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Current</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatValue(totalCurrent)} {unit}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Previous</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatValue(totalPrevious)} {unit}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Change</h3>
          <p className={`text-2xl font-bold ${getTrendColor('up', totalChange > 0)}`}>
            {totalChange > 0 ? '+' : ''}{formatValue(totalChange)} {unit}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Change %</h3>
          <p className={`text-2xl font-bold ${getTrendColor('up', totalChangePercentage > 0)}`}>
            {totalChangePercentage > 0 ? '+' : ''}{totalChangePercentage.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      {showChart && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {metric} Trend Comparison
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="period" 
                  stroke="#6B7280"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6B7280"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatValue(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Current Period"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="previous" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Previous Period"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {showTable && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Detailed Comparison
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Current ({unit})
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Previous ({unit})
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Change ({unit})
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Change %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((item, index) => (
                  <tr 
                    key={index}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                      selectedPeriod === item.period ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => setSelectedPeriod(selectedPeriod === item.period ? null : item.period)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatValue(item.current)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatValue(item.previous)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${getTrendColor(item.trend, item.change > 0)}`}>
                        {item.change > 0 ? '+' : ''}{formatValue(item.change)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${getTrendColor(item.trend, item.changePercentage > 0)}`}>
                        {item.changePercentage > 0 ? '+' : ''}{item.changePercentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <span className="text-lg">{getTrendIcon(item.trend)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">●</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Best performing period: <strong>{data.reduce((max, item) => item.changePercentage > max.changePercentage ? item : max).period}</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-red-500">●</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Lowest performing period: <strong>{data.reduce((min, item) => item.changePercentage < min.changePercentage ? item : min).period}</strong>
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-blue-500">●</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Average change: <strong>{totalChangePercentage.toFixed(1)}%</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-500">●</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Growth periods: <strong>{data.filter(item => item.changePercentage > 0).length}</strong> out of <strong>{data.length}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

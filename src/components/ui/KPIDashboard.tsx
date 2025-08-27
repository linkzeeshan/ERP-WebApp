"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface KPIData {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  color: string;
  icon: string;
  chartData?: Array<{ date: string; value: number }>;
  description?: string;
}

interface KPIDashboardProps {
  data: KPIData[];
  title?: string;
  showCharts?: boolean;
  compact?: boolean;
}

export default function KPIDashboard({ 
  data, 
  title = "Key Performance Indicators", 
  showCharts = true,
  compact = false 
}: KPIDashboardProps) {
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({});

  // Animate values on mount
  useEffect(() => {
    data.forEach(kpi => {
      const timer = setTimeout(() => {
        setAnimatedValues(prev => ({
          ...prev,
          [kpi.id]: kpi.value
        }));
      }, 100 * data.indexOf(kpi));
      return () => clearTimeout(timer);
    });
  }, [data]);

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

  const getTrendBgColor = (trend: string, isPositive: boolean) => {
    if (trend === 'stable') return 'bg-gray-100';
    return isPositive ? 'bg-green-100' : 'bg-red-100';
  };

  const formatValue = (value: number, unit: string) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ${unit}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K ${unit}`;
    }
    return `${value.toLocaleString()} ${unit}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Value: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span>Positive</span>
          <span className="w-3 h-3 bg-red-500 rounded-full ml-2"></span>
          <span>Negative</span>
          <span className="w-3 h-3 bg-gray-500 rounded-full ml-2"></span>
          <span>Stable</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className={`grid gap-6 ${compact ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
        {data.map((kpi) => {
          const animatedValue = animatedValues[kpi.id] || 0;
          const isPositive = kpi.trend === 'up' || (kpi.trend === 'down' && kpi.trendPercentage < 0);
          
          return (
            <div
              key={kpi.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
                selectedKPI === kpi.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedKPI(selectedKPI === kpi.id ? null : kpi.id)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{kpi.icon}</span>
                  <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendBgColor(kpi.trend, isPositive)} ${getTrendColor(kpi.trend, isPositive)}`}>
                  {getTrendIcon(kpi.trend)}
                </div>
              </div>

              {/* Value */}
              <div className="mb-2">
                <div className="text-3xl font-bold text-gray-900">
                  {formatValue(animatedValue, kpi.unit)}
                </div>
              </div>

              {/* Trend */}
              <div className="flex items-center justify-between">
                <div className={`text-sm font-medium ${getTrendColor(kpi.trend, isPositive)}`}>
                  {kpi.trendPercentage > 0 ? '+' : ''}{kpi.trendPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">
                  vs previous period
                </div>
              </div>

              {/* Mini Chart */}
              {showCharts && kpi.chartData && (
                <div className="mt-4 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={kpi.chartData}>
                      <defs>
                        <linearGradient id={`gradient-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={kpi.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={kpi.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={kpi.color} 
                        fill={`url(#gradient-${kpi.id})`}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Description */}
              {kpi.description && (
                <div className="mt-2 text-xs text-gray-500">
                  {kpi.description}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Chart for Selected KPI */}
      {selectedKPI && showCharts && (() => {
        const selectedData = data.find(kpi => kpi.id === selectedKPI);
        if (!selectedData?.chartData) return null;

        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedData.title} - Trend Analysis
              </h3>
              <button
                onClick={() => setSelectedKPI(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={selectedData.color} 
                    strokeWidth={3}
                    dot={{ fill: selectedData.color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-sm text-gray-500">Current</div>
                <div className="text-lg font-semibold">{formatValue(selectedData.value, selectedData.unit)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Previous</div>
                <div className="text-lg font-semibold">{formatValue(selectedData.previousValue, selectedData.unit)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Change</div>
                <div className={`text-lg font-semibold ${getTrendColor(selectedData.trend, selectedData.trendPercentage > 0)}`}>
                  {selectedData.trendPercentage > 0 ? '+' : ''}{selectedData.trendPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

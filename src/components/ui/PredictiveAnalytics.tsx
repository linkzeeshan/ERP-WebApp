"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ForecastData {
  period: string;
  actual: number;
  forecast: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

interface StockOutRisk {
  product: string;
  currentStock: number;
  dailyDemand: number;
  daysUntilStockOut: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendedAction: string;
  confidence: number;
}

interface SeasonalTrend {
  month: string;
  demand: number;
  seasonality: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  peakSeason: boolean;
}

interface CustomerBehavior {
  segment: string;
  customers: number;
  avgOrderValue: number;
  frequency: number;
  churnRisk: number;
  lifetimeValue: number;
  growthRate: number;
}

interface PredictiveAnalyticsProps {
  forecastData: ForecastData[];
  stockOutRisks: StockOutRisk[];
  seasonalTrends: SeasonalTrend[];
  customerBehaviors: CustomerBehavior[];
  title?: string;
}

export default function PredictiveAnalytics({
  forecastData,
  stockOutRisks,
  seasonalTrends,
  customerBehaviors,
  title = "Predictive Analytics"
}: PredictiveAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'forecast' | 'stockout' | 'seasonal' | 'customers'>('forecast');

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getRiskBgColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
              {entry.name}: {formatValue(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const tabs = [
    { id: 'forecast', label: 'Demand Forecast', icon: '📈' },
    { id: 'stockout', label: 'Stock-out Risk', icon: '⚠️' },
    { id: 'seasonal', label: 'Seasonal Trends', icon: '🌱' },
    { id: 'customers', label: 'Customer Behavior', icon: '👥' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered predictions and insights for business planning
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Confidence:</span>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-xs">High</span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full ml-2"></span>
            <span className="text-xs">Medium</span>
            <span className="w-3 h-3 bg-red-500 rounded-full ml-2"></span>
            <span className="text-xs">Low</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Demand Forecasting */}
        {activeTab === 'forecast' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Demand Forecast with Confidence Intervals
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData}>
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
                    <defs>
                      <linearGradient id="confidenceArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="upperBound" 
                      stackId="1" 
                      stroke="none" 
                      fill="url(#confidenceArea)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="lowerBound" 
                      stackId="1" 
                      stroke="none" 
                      fill="url(#confidenceArea)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Actual"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      name="Forecast"
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Forecast Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Confidence</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {(forecastData.reduce((sum, item) => sum + item.confidence, 0) / forecastData.length).toFixed(1)}%
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Forecast Accuracy</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">94.2%</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Trend Direction</h4>
                <p className="text-2xl font-bold text-green-600">↗️ Increasing</p>
              </div>
            </div>
          </div>
        )}

        {/* Stock-out Risk Assessment */}
        {activeTab === 'stockout' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Distribution Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Stock-out Risk Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Critical', value: stockOutRisks.filter(r => r.riskLevel === 'critical').length, color: '#EF4444' },
                          { name: 'High', value: stockOutRisks.filter(r => r.riskLevel === 'high').length, color: '#F59E0B' },
                          { name: 'Medium', value: stockOutRisks.filter(r => r.riskLevel === 'medium').length, color: '#3B82F6' },
                          { name: 'Low', value: stockOutRisks.filter(r => r.riskLevel === 'low').length, color: '#10B981' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {[
                          { name: 'Critical', value: stockOutRisks.filter(r => r.riskLevel === 'critical').length, color: '#EF4444' },
                          { name: 'High', value: stockOutRisks.filter(r => r.riskLevel === 'high').length, color: '#F59E0B' },
                          { name: 'Medium', value: stockOutRisks.filter(r => r.riskLevel === 'medium').length, color: '#3B82F6' },
                          { name: 'Low', value: stockOutRisks.filter(r => r.riskLevel === 'low').length, color: '#10B981' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Critical Risks List */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Critical Stock-out Risks
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {stockOutRisks
                    .filter(risk => risk.riskLevel === 'critical' || risk.riskLevel === 'high')
                    .slice(0, 5)
                    .map((risk, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {risk.product}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBgColor(risk.riskLevel)}`}>
                            {risk.riskLevel.charAt(0).toUpperCase() + risk.riskLevel.slice(1)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <p>Current Stock: {formatValue(risk.currentStock)}</p>
                          <p>Days Until Stock-out: {risk.daysUntilStockOut}</p>
                          <p>Confidence: {risk.confidence}%</p>
                          <p className="font-medium text-blue-600">Action: {risk.recommendedAction}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Risk Summary Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Stock-out Risk Assessment
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Current Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Days Until Stock-out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Risk Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Recommended Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {stockOutRisks.map((risk, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {risk.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {formatValue(risk.currentStock)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {risk.daysUntilStockOut} days
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBgColor(risk.riskLevel)}`}>
                            {risk.riskLevel.charAt(0).toUpperCase() + risk.riskLevel.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {risk.confidence}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {risk.recommendedAction}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Seasonal Trends */}
        {activeTab === 'seasonal' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Seasonal Demand Patterns
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={seasonalTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6B7280"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => formatValue(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="demand" 
                      fill="#3B82F6" 
                      name="Demand"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Seasonal Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Peak Seasons
                </h4>
                <div className="space-y-3">
                  {seasonalTrends
                    .filter(trend => trend.peakSeason)
                    .map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {trend.month}
                        </span>
                        <span className="text-sm text-green-600 dark:text-green-400">
                          +{trend.seasonality.toFixed(1)}% above average
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Trend Analysis
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Overall Trend:</span>
                    <span className="text-sm font-medium text-green-600">↗️ Increasing</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Seasonality Strength:</span>
                    <span className="text-sm font-medium text-blue-600">High</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Peak Months:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {seasonalTrends.filter(t => t.peakSeason).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Behavior */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Segments */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Customer Segments
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerBehaviors.map(behavior => ({
                          name: behavior.segment,
                          value: behavior.customers,
                          color: `hsl(${Math.random() * 360}, 70%, 50%)`
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {customerBehaviors.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Customer Metrics */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Customer Behavior Metrics
                </h3>
                <div className="space-y-4">
                  {customerBehaviors.map((behavior, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {behavior.segment}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <div>Customers: {behavior.customers.toLocaleString()}</div>
                        <div>Avg Order: ${behavior.avgOrderValue.toLocaleString()}</div>
                        <div>Frequency: {behavior.frequency}/month</div>
                        <div>Churn Risk: {behavior.churnRisk}%</div>
                        <div>LTV: ${behavior.lifetimeValue.toLocaleString()}</div>
                        <div>Growth: {behavior.growthRate}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Customer Behavior Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {customerBehaviors.reduce((sum, b) => sum + b.customers, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${(customerBehaviors.reduce((sum, b) => sum + b.lifetimeValue * b.customers, 0) / 
                       customerBehaviors.reduce((sum, b) => sum + b.customers, 0)).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Customer LTV</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {customerBehaviors.reduce((sum, b) => sum + b.churnRisk * b.customers, 0) / 
                     customerBehaviors.reduce((sum, b) => sum + b.customers, 0)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Churn Risk</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

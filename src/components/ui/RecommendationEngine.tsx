"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Recommendation {
  id: string;
  type: 'restock' | 'reduce' | 'optimize' | 'discontinue';
  product: string;
  category: string;
  currentStock: number;
  recommendedAction: number;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  savings: number;
  description: string;
  priority: number;
  timeframe: string;
}

interface RecommendationEngineProps {
  recommendations: Recommendation[];
  title?: string;
  showChart?: boolean;
  showTable?: boolean;
  compact?: boolean;
}

export default function RecommendationEngine({
  recommendations,
  title = "Inventory Optimization Recommendations",
  showChart = true,
  showTable = true,
  compact = false
}: RecommendationEngineProps) {
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'restock' | 'reduce' | 'optimize' | 'discontinue'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'savings' | 'confidence'>('priority');

  const filteredRecommendations = filterType === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === filterType);

  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    switch (sortBy) {
      case 'priority': return b.priority - a.priority;
      case 'savings': return b.savings - a.savings;
      case 'confidence': return b.confidence - a.confidence;
      default: return 0;
    }
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'restock': return '#10B981';
      case 'reduce': return '#F59E0B';
      case 'optimize': return '#3B82F6';
      case 'discontinue': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'restock': return '📦';
      case 'reduce': return '📉';
      case 'optimize': return '⚡';
      case 'discontinue': return '❌';
      default: return '📊';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Chart data preparation
  const typeDistribution = recommendations.reduce((acc, rec) => {
    acc[rec.type] = (acc[rec.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(typeDistribution).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    color: getTypeColor(type)
  }));

  const savingsData = sortedRecommendations.slice(0, 10).map(rec => ({
    product: rec.product,
    savings: rec.savings,
    type: rec.type,
    color: getTypeColor(rec.type)
  }));

  const totalSavings = recommendations.reduce((sum, rec) => sum + rec.savings, 0);
  const highPriorityCount = recommendations.filter(rec => rec.priority >= 8).length;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          >
            <option value="all">All Types</option>
            <option value="restock">Restock</option>
            <option value="reduce">Reduce</option>
            <option value="optimize">Optimize</option>
            <option value="discontinue">Discontinue</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          >
            <option value="priority">Sort by Priority</option>
            <option value="savings">Sort by Savings</option>
            <option value="confidence">Sort by Confidence</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{recommendations.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Recommendations</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">High Priority</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-green-600">${totalSavings.toLocaleString()}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Potential Savings</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Confidence</div>
        </div>
      </div>

      {showChart && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recommendation Type Distribution */}
          <div>
            <h4 className="text-md font-semibold mb-3">Recommendation Types</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ type, count }) => `${type}: ${count}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Savings Opportunities */}
          <div>
            <h4 className="text-md font-semibold mb-3">Top Savings Opportunities</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={savingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Potential Savings']}
                />
                <Bar dataKey="savings" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {showTable && (
        <div>
          <h4 className="text-md font-semibold mb-3">Optimization Recommendations</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Recommended
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Impact
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Savings
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedRecommendations.map((recommendation) => (
                  <tr 
                    key={recommendation.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedRecommendation(recommendation)}
                  >
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTypeIcon(recommendation.type)}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {recommendation.type.charAt(0).toUpperCase() + recommendation.type.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {recommendation.product}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {recommendation.currentStock}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {recommendation.recommendedAction}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getImpactColor(recommendation.impact)}`}>
                        {recommendation.impact.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-600">
                      ${recommendation.savings.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {recommendation.confidence}%
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(recommendation.priority / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {recommendation.priority}/10
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommendation Detail Modal */}
      {selectedRecommendation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getTypeIcon(selectedRecommendation.type)}</span>
                <h3 className="text-lg font-semibold">Recommendation Details</h3>
              </div>
              <button
                onClick={() => setSelectedRecommendation(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecommendation.product}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecommendation.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Stock</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecommendation.currentStock}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recommended Action</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecommendation.recommendedAction}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecommendation.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-bold text-green-600">${selectedRecommendation.savings.toLocaleString()}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Potential Savings</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{selectedRecommendation.confidence}%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Confidence</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{selectedRecommendation.priority}/10</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Priority</div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedRecommendation(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  console.log('Apply recommendation:', selectedRecommendation);
                  setSelectedRecommendation(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Apply Recommendation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

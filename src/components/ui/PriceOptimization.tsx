"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, ZAxis } from 'recharts';

interface PriceOptimization {
  id: string;
  product: string;
  category: string;
  currentPrice: number;
  suggestedPrice: number;
  priceChange: number;
  priceChangePercent: number;
  expectedRevenue: number;
  revenueIncrease: number;
  demandElasticity: number;
  competitorPrice: number;
  marketPosition: 'premium' | 'standard' | 'budget';
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  factors: {
    demand: number;
    competition: number;
    seasonality: number;
    inventory: number;
    profitMargin: number;
  };
  recommendations: string[];
}

interface PriceOptimizationProps {
  optimizations: PriceOptimization[];
  title?: string;
  showCharts?: boolean;
  showTable?: boolean;
  compact?: boolean;
}

export default function PriceOptimization({
  optimizations,
  title = "Price Optimization Suggestions",
  showCharts = true,
  showTable = true,
  compact = false
}: PriceOptimizationProps) {
  const [selectedOptimization, setSelectedOptimization] = useState<PriceOptimization | null>(null);
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'revenueIncrease' | 'priceChangePercent' | 'confidence'>('revenueIncrease');

  const filteredOptimizations = filterRisk === 'all' 
    ? optimizations 
    : optimizations.filter(opt => opt.risk === filterRisk);

  const sortedOptimizations = [...filteredOptimizations].sort((a, b) => {
    switch (sortBy) {
      case 'revenueIncrease': return b.revenueIncrease - a.revenueIncrease;
      case 'priceChangePercent': return Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent);
      case 'confidence': return b.confidence - a.confidence;
      default: return 0;
    }
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getMarketPositionColor = (position: string) => {
    switch (position) {
      case 'premium': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'standard': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'budget': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Chart data preparation
  const priceChangeData = sortedOptimizations.slice(0, 15).map(opt => ({
    product: opt.product,
    currentPrice: opt.currentPrice,
    suggestedPrice: opt.suggestedPrice,
    priceChange: opt.priceChange,
    revenueIncrease: opt.revenueIncrease,
    color: opt.priceChange > 0 ? '#10B981' : '#EF4444'
  }));

  const revenueImpactData = sortedOptimizations.slice(0, 10).map(opt => ({
    product: opt.product,
    revenueIncrease: opt.revenueIncrease,
    confidence: opt.confidence,
    risk: opt.risk,
    color: opt.risk === 'low' ? '#10B981' : opt.risk === 'medium' ? '#F59E0B' : '#EF4444'
  }));

  const elasticityData = sortedOptimizations.map(opt => ({
    product: opt.product,
    demandElasticity: opt.demandElasticity,
    priceChangePercent: opt.priceChangePercent,
    revenueIncrease: opt.revenueIncrease,
    size: Math.abs(opt.revenueIncrease) / 1000 // Normalize for bubble size
  }));

  const totalRevenueIncrease = optimizations.reduce((sum, opt) => sum + opt.revenueIncrease, 0);
  const avgPriceChange = optimizations.reduce((sum, opt) => sum + opt.priceChangePercent, 0) / optimizations.length;
  const lowRiskOptimizations = optimizations.filter(opt => opt.risk === 'low').length;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">💰</span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value as any)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          >
            <option value="all">All Risks</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          >
            <option value="revenueIncrease">Sort by Revenue Impact</option>
            <option value="priceChangePercent">Sort by Price Change</option>
            <option value="confidence">Sort by Confidence</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{optimizations.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Price Suggestions</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-green-600">${totalRevenueIncrease.toLocaleString()}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue Increase</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{avgPriceChange.toFixed(1)}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Price Change</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{lowRiskOptimizations}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Low Risk Options</div>
        </div>
      </div>

      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Price Change Analysis */}
          <div>
            <h4 className="text-md font-semibold mb-3">Price Change Analysis</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priceChangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'currentPrice' || name === 'suggestedPrice' ? `$${value}` : `$${value.toLocaleString()}`,
                    name === 'currentPrice' ? 'Current Price' : name === 'suggestedPrice' ? 'Suggested Price' : 'Revenue Increase'
                  ]}
                />
                <Bar dataKey="currentPrice" fill="#6B7280" name="Current Price" />
                <Bar dataKey="suggestedPrice" fill="#3B82F6" name="Suggested Price" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Impact vs Confidence */}
          <div>
            <h4 className="text-md font-semibold mb-3">Revenue Impact vs Confidence</h4>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="revenueIncrease" 
                  name="Revenue Increase"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  dataKey="confidence" 
                  name="Confidence %"
                  domain={[0, 100]}
                />
                <ZAxis dataKey="risk" range={[50, 200]} />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'revenueIncrease' ? `$${value.toLocaleString()}` : `${value}%`,
                    name === 'revenueIncrease' ? 'Revenue Increase' : 'Confidence'
                  ]}
                />
                <Scatter data={revenueImpactData} fill="#3B82F6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {showTable && (
        <div>
          <h4 className="text-md font-semibold mb-3">Price Optimization Suggestions</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Suggested Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Revenue Impact
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Market Position
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedOptimizations.map((optimization) => (
                  <tr 
                    key={optimization.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedOptimization(optimization)}
                  >
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {optimization.product}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {optimization.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      ${optimization.currentPrice}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      ${optimization.suggestedPrice}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getPriceChangeColor(optimization.priceChange)}`}>
                        {optimization.priceChange > 0 ? '+' : ''}{optimization.priceChangePercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-600">
                      +${optimization.revenueIncrease.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getMarketPositionColor(optimization.marketPosition)}`}>
                        {optimization.marketPosition.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRiskColor(optimization.risk)}`}>
                        {optimization.risk.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${optimization.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {optimization.confidence}%
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

      {/* Optimization Detail Modal */}
      {selectedOptimization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Price Optimization Details</h3>
              <button
                onClick={() => setSelectedOptimization(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Information */}
              <div className="space-y-4">
                <h4 className="font-semibold">Price Information</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Current Price</div>
                    <div className="text-lg font-bold">${selectedOptimization.currentPrice}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Suggested Price</div>
                    <div className="text-lg font-bold text-blue-600">${selectedOptimization.suggestedPrice}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Price Change</div>
                    <div className={`text-lg font-bold ${getPriceChangeColor(selectedOptimization.priceChange)}`}>
                      {selectedOptimization.priceChange > 0 ? '+' : ''}{selectedOptimization.priceChangePercent.toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Competitor Price</div>
                    <div className="text-lg font-bold">${selectedOptimization.competitorPrice}</div>
                  </div>
                </div>
              </div>

              {/* Impact Analysis */}
              <div className="space-y-4">
                <h4 className="font-semibold">Impact Analysis</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Expected Revenue</div>
                    <div className="text-lg font-bold">${selectedOptimization.expectedRevenue.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Revenue Increase</div>
                    <div className="text-lg font-bold text-green-600">+${selectedOptimization.revenueIncrease.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Demand Elasticity</div>
                    <div className="text-lg font-bold">{selectedOptimization.demandElasticity.toFixed(2)}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
                    <div className="text-lg font-bold">{selectedOptimization.confidence}%</div>
                  </div>
                </div>
              </div>

              {/* Factor Analysis */}
              <div className="space-y-4">
                <h4 className="font-semibold">Factor Analysis</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Demand Factor</span>
                      <span>{selectedOptimization.factors.demand}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${selectedOptimization.factors.demand}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Competition Factor</span>
                      <span>{selectedOptimization.factors.competition}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${selectedOptimization.factors.competition}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Seasonality Factor</span>
                      <span>{selectedOptimization.factors.seasonality}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${selectedOptimization.factors.seasonality}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Inventory Factor</span>
                      <span>{selectedOptimization.factors.inventory}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${selectedOptimization.factors.inventory}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profit Margin Factor</span>
                      <span>{selectedOptimization.factors.profitMargin}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${selectedOptimization.factors.profitMargin}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                <h4 className="font-semibold">Recommendations</h4>
                <ul className="text-sm space-y-2">
                  {selectedOptimization.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedOptimization(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  console.log('Apply price optimization:', selectedOptimization);
                  setSelectedOptimization(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Apply Price Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';

interface CustomerSegment {
  id: string;
  segment: string;
  size: number;
  avgOrderValue: number;
  frequency: number;
  lifetimeValue: number;
  churnRisk: number;
  satisfaction: number;
  demographics: {
    ageGroup: string;
    location: string;
    incomeLevel: string;
  };
  preferences: string[];
  behavior: {
    onlineShopping: number;
    storeVisits: number;
    seasonalBuying: number;
  };
  recommendations: string[];
}

interface CustomerSegmentationProps {
  segments: CustomerSegment[];
  title?: string;
  showCharts?: boolean;
  showTable?: boolean;
  compact?: boolean;
}

export default function CustomerSegmentation({
  segments,
  title = "Customer Segmentation Analysis",
  showCharts = true,
  showTable = true,
  compact = false
}: CustomerSegmentationProps) {
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegment | null>(null);
  const [sortBy, setSortBy] = useState<'size' | 'lifetimeValue' | 'churnRisk'>('size');

  const sortedSegments = [...segments].sort((a, b) => {
    switch (sortBy) {
      case 'size': return b.size - a.size;
      case 'lifetimeValue': return b.lifetimeValue - a.lifetimeValue;
      case 'churnRisk': return a.churnRisk - b.churnRisk;
      default: return 0;
    }
  });

  const getSegmentColor = (segment: string) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    const index = segments.findIndex(s => s.segment === segment);
    return colors[index % colors.length];
  };

  const getChurnRiskColor = (risk: number) => {
    if (risk <= 20) return 'text-green-600 bg-green-50 border-green-200';
    if (risk <= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getSatisfactionColor = (satisfaction: number) => {
    if (satisfaction >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (satisfaction >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Chart data preparation
  const segmentSizeData = sortedSegments.map(segment => ({
    segment: segment.segment,
    size: segment.size,
    color: getSegmentColor(segment.segment)
  }));

  const lifetimeValueData = sortedSegments.map(segment => ({
    segment: segment.segment,
    lifetimeValue: segment.lifetimeValue,
    churnRisk: segment.churnRisk,
    color: getSegmentColor(segment.segment)
  }));

  const behaviorData = sortedSegments.map(segment => ({
    segment: segment.segment,
    onlineShopping: segment.behavior.onlineShopping,
    storeVisits: segment.behavior.storeVisits,
    seasonalBuying: segment.behavior.seasonalBuying,
    color: getSegmentColor(segment.segment)
  }));

  const totalCustomers = segments.reduce((sum, segment) => sum + segment.size, 0);
  const avgLifetimeValue = segments.reduce((sum, segment) => sum + segment.lifetimeValue, 0) / segments.length;
  const highValueSegments = segments.filter(segment => segment.lifetimeValue > avgLifetimeValue).length;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">👥</span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          >
            <option value="size">Sort by Size</option>
            <option value="lifetimeValue">Sort by Lifetime Value</option>
            <option value="churnRisk">Sort by Churn Risk</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{segments.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Customer Segments</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{totalCustomers.toLocaleString()}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Customers</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">${avgLifetimeValue.toLocaleString()}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Lifetime Value</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{highValueSegments}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">High-Value Segments</div>
        </div>
      </div>

      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Segment Size Distribution */}
          <div>
            <h4 className="text-md font-semibold mb-3">Segment Size Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={segmentSizeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="size"
                  label={({ segment, size }) => `${segment}: ${size.toLocaleString()}`}
                >
                  {segmentSizeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [value.toLocaleString(), 'Customers']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Lifetime Value vs Churn Risk */}
          <div>
            <h4 className="text-md font-semibold mb-3">Lifetime Value vs Churn Risk</h4>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="lifetimeValue" 
                  name="Lifetime Value"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  dataKey="churnRisk" 
                  name="Churn Risk %"
                  domain={[0, 100]}
                />
                <ZAxis dataKey="size" range={[50, 200]} />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'lifetimeValue' ? `$${value.toLocaleString()}` : `${value}%`,
                    name === 'lifetimeValue' ? 'Lifetime Value' : 'Churn Risk'
                  ]}
                />
                <Scatter data={lifetimeValueData} fill="#3B82F6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {showTable && (
        <div>
          <h4 className="text-md font-semibold mb-3">Customer Segments</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Segment
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Avg Order Value
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Lifetime Value
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Churn Risk
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Satisfaction
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Demographics
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedSegments.map((segment) => (
                  <tr 
                    key={segment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedSegment(segment)}
                  >
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getSegmentColor(segment.segment) }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {segment.segment}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {segment.size.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      ${segment.avgOrderValue.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-600">
                      ${segment.lifetimeValue.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getChurnRiskColor(segment.churnRisk)}`}>
                        {segment.churnRisk}%
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSatisfactionColor(segment.satisfaction)}`}>
                        {segment.satisfaction}%
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      <div className="text-xs">
                        <div>{segment.demographics.ageGroup}</div>
                        <div className="text-gray-500">{segment.demographics.location}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Segment Detail Modal */}
      {selectedSegment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: getSegmentColor(selectedSegment.segment) }}
                ></div>
                <h3 className="text-lg font-semibold">{selectedSegment.segment} Segment</h3>
              </div>
              <button
                onClick={() => setSelectedSegment(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Metrics */}
              <div className="space-y-4">
                <h4 className="font-semibold">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Size</div>
                    <div className="text-lg font-bold">{selectedSegment.size.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</div>
                    <div className="text-lg font-bold">${selectedSegment.avgOrderValue.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Lifetime Value</div>
                    <div className="text-lg font-bold text-green-600">${selectedSegment.lifetimeValue.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Purchase Frequency</div>
                    <div className="text-lg font-bold">{selectedSegment.frequency}/month</div>
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div className="space-y-4">
                <h4 className="font-semibold">Demographics</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Age Group</label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{selectedSegment.demographics.ageGroup}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{selectedSegment.demographics.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Income Level</label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{selectedSegment.demographics.incomeLevel}</p>
                  </div>
                </div>
              </div>

              {/* Behavior Patterns */}
              <div className="space-y-4">
                <h4 className="font-semibold">Behavior Patterns</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Online Shopping</span>
                      <span>{selectedSegment.behavior.onlineShopping}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${selectedSegment.behavior.onlineShopping}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Store Visits</span>
                      <span>{selectedSegment.behavior.storeVisits}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${selectedSegment.behavior.storeVisits}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Seasonal Buying</span>
                      <span>{selectedSegment.behavior.seasonalBuying}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${selectedSegment.behavior.seasonalBuying}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences & Recommendations */}
              <div className="space-y-4">
                <h4 className="font-semibold">Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSegment.preferences.map((pref, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      {pref}
                    </span>
                  ))}
                </div>
                
                <h4 className="font-semibold">Recommendations</h4>
                <ul className="text-sm space-y-1">
                  {selectedSegment.recommendations.map((rec, index) => (
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
                onClick={() => setSelectedSegment(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  console.log('Create campaign for segment:', selectedSegment);
                  setSelectedSegment(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

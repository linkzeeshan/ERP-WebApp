"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ComposedChart, Area
} from 'recharts';
import { ProductionNeed, PRODUCTS } from '../../services/analysisService';
import { loadDemoData, getCurrentMonth } from '../../services/dataLoader';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const PRIORITY_COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981'
};

export default function ProductionNeedsAnalysis() {
  const [productionNeeds, setProductionNeeds] = useState<ProductionNeed[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>('2024-03');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [currentMonth]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await loadDemoData();
      const month = getCurrentMonth(data.marketDemand);
      setCurrentMonth(month);
      
      // Import the analysis function
      const { calculateProductionNeeds } = await import('../../services/analysisService');
      const needs = calculateProductionNeeds(data.marketDemand, data.inventoryFlows, month);
      setProductionNeeds(needs);
    } catch (error) {
      console.error('Error loading production needs analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNeeds = productionNeeds.filter(item => {
    const matchesProduct = selectedProduct === 'all' || item.productId === selectedProduct;
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    return matchesProduct && matchesPriority;
  });

  const totalProductionNeeded = productionNeeds.reduce((sum, p) => sum + p.productionNeeded, 0);
  const highPriorityNeeds = productionNeeds.filter(p => p.priority === 'high');
  const mediumPriorityNeeds = productionNeeds.filter(p => p.priority === 'medium');
  const lowPriorityNeeds = productionNeeds.filter(p => p.priority === 'low');
  const avgGapPercentage = productionNeeds.reduce((sum, p) => sum + p.gapPercentage, 0) / productionNeeds.length;

  const productionData = filteredNeeds.map(item => ({
    name: item.productName,
    'Demand Forecast': item.demandForecast,
    'Current Stock': item.currentStock,
    'Production Needed': item.productionNeeded,
    'Gap %': item.gapPercentage
  }));

  const priorityData = [
    { name: 'High Priority', value: highPriorityNeeds.length, color: PRIORITY_COLORS.high },
    { name: 'Medium Priority', value: mediumPriorityNeeds.length, color: PRIORITY_COLORS.medium },
    { name: 'Low Priority', value: lowPriorityNeeds.length, color: PRIORITY_COLORS.low }
  ];

  const gapAnalysisData = filteredNeeds.map(item => ({
    name: item.productName,
    'Gap Percentage': item.gapPercentage,
    'Priority': item.priority
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Production Needs Analysis - {currentMonth}</h2>
        <p className="text-gray-600 mb-4">
          Analysis of production requirements based on demand forecasts and current inventory levels
        </p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Production Needed</h3>
            <p className="text-2xl font-bold text-blue-900">{totalProductionNeeded.toFixed(1)} MT</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-600">High Priority Items</h3>
            <p className="text-2xl font-bold text-red-900">{highPriorityNeeds.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600">Medium Priority Items</h3>
            <p className="text-2xl font-bold text-yellow-900">{mediumPriorityNeeds.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Avg Gap %</h3>
            <p className="text-2xl font-bold text-green-900">{avgGapPercentage.toFixed(1)}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Products</option>
              {PRODUCTS.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Needs Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Production Needs by Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => `${value} MT`} />
              <Legend />
              <Bar dataKey="Production Needed" fill="#EF4444" />
              <Area type="monotone" dataKey="Demand Forecast" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="Current Stock" fill="#10B981" stroke="#10B981" fillOpacity={0.3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gap Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Demand-Supply Gap Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={gapAnalysisData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Bar dataKey="Gap Percentage" fill="#8884d8">
              {gapAnalysisData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={
                    entry.Priority === 'high' ? PRIORITY_COLORS.high :
                    entry.Priority === 'medium' ? PRIORITY_COLORS.medium :
                    PRIORITY_COLORS.low
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Production Needs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demand Forecast (MT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock (MT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Production Needed (MT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gap %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recommended Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNeeds.map((item) => (
                <tr key={item.productId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.demandForecast.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.currentStock.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`font-medium ${
                      item.productionNeeded > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {item.productionNeeded.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.gapPercentage > 50 ? 'bg-red-100 text-red-800' :
                      item.gapPercentage > 20 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.gapPercentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.priority === 'high' ? 'bg-red-100 text-red-800' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.priority === 'high' ? 'Immediate production increase required' :
                     item.priority === 'medium' ? 'Moderate production increase needed' :
                     'Monitor and adjust as needed'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Production Recommendations</h3>
        <div className="space-y-4">
          {highPriorityNeeds.map(item => (
            <div key={item.productId} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    High Priority: {item.productName}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Demand: {item.demandForecast.toFixed(1)} MT | Current Stock: {item.currentStock.toFixed(1)} MT</p>
                    <p>Production Needed: {item.productionNeeded.toFixed(1)} MT ({item.gapPercentage.toFixed(1)}% gap)</p>
                    <p>Action: Increase production immediately to meet demand</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {mediumPriorityNeeds.map(item => (
            <div key={item.productId} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Medium Priority: {item.productName}
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Demand: {item.demandForecast.toFixed(1)} MT | Current Stock: {item.currentStock.toFixed(1)} MT</p>
                    <p>Production Needed: {item.productionNeeded.toFixed(1)} MT ({item.gapPercentage.toFixed(1)}% gap)</p>
                    <p>Action: Plan moderate production increase in next cycle</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {lowPriorityNeeds.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Low Priority Items: {lowPriorityNeeds.map(item => item.productName).join(', ')}
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>These products have adequate stock levels relative to demand</p>
                    <p>Action: Monitor and maintain current production levels</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

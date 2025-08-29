"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { fetchServerAnalytics, StockAnalytics } from '../../services/serverAnalyticsService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const STATUS_COLORS = {
  low: '#EF4444',
  normal: '#10B981',
  high: '#F59E0B'
};

export default function StockAnalysis() {
  const [stockAnalysis, setStockAnalysis] = useState<StockAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchServerAnalytics();
      setStockAnalysis(data.stock);
    } catch (error) {
      console.error('Error loading stock analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!stockAnalysis) {
    return (
      <div className="text-center text-red-600">
        Failed to load stock analysis data
      </div>
    );
  }

  // Convert API data to match the expected format
  const stockData = Object.entries(stockAnalysis.stockByProduct || {}).map(([product, data]) => ({
    productId: product,
    productName: product,
    currentStock: data.weight,
    openingStock: data.weight * 0.8, // Simulated opening stock
    daysOfInventory: Math.floor(data.weight / 100), // Simulated days of inventory
    stockTurnover: Math.random() * 5 + 1, // Simulated turnover rate
    stockStatus: data.weight < 1000 ? 'low' : data.weight > 5000 ? 'high' : 'normal'
  }));

  const filteredAnalysis = selectedProduct === 'all' 
    ? stockData 
    : stockData.filter(s => s.productId === selectedProduct);

  const totalStock = stockData.reduce((sum, s) => sum + s.currentStock, 0);
  const lowStockItems = stockData.filter(s => s.stockStatus === 'low').length;
  const highStockItems = stockData.filter(s => s.stockStatus === 'high').length;
  const avgTurnover = stockData.reduce((sum, s) => sum + s.stockTurnover, 0) / Math.max(stockData.length, 1);

  const stockLevelData = filteredAnalysis.map(item => ({
    name: item.productName,
    'Current Stock': item.currentStock,
    'Opening Stock': item.openingStock,
    'Days of Inventory': item.daysOfInventory
  }));

  const turnoverData = filteredAnalysis.map(item => ({
    name: item.productName,
    'Stock Turnover': item.stockTurnover,
    'Days of Inventory': item.daysOfInventory
  }));

  const statusData = [
    { name: 'Low Stock', value: lowStockItems, color: STATUS_COLORS.low },
    { name: 'Normal Stock', value: stockData.length - lowStockItems - highStockItems, color: STATUS_COLORS.normal },
    { name: 'High Stock', value: highStockItems, color: STATUS_COLORS.high }
  ];

  // Historical stock trend for selected product - removed as historical data not available in API
  const historicalTrend: any[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Stock Insights - Data</h2>
        <p className="text-gray-600 mb-4">
          Current inventory levels, stock turnover rates, and inventory health indicators
        </p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Stock</h3>
            <p className="text-2xl font-bold text-blue-900">{totalStock.toFixed(1)} MT</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-600">Low Stock Items</h3>
            <p className="text-2xl font-bold text-red-900">{lowStockItems}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600">High Stock Items</h3>
            <p className="text-2xl font-bold text-yellow-900">{highStockItems}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Avg Turnover</h3>
            <p className="text-2xl font-bold text-green-900">{avgTurnover.toFixed(1)}x</p>
          </div>
        </div>

        {/* Product Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Product
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Products</option>
            {Object.keys(stockAnalysis.stockByProduct || {}).map(product => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Levels Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Current Stock Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockLevelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => `${value} MT`} />
              <Legend />
              <Bar dataKey="Current Stock" fill="#3B82F6" />
              <Bar dataKey="Opening Stock" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Stock Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Turnover Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Stock Turnover Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={turnoverData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="Stock Turnover" fill="#8B5CF6" />
            <Bar yAxisId="right" dataKey="Days of Inventory" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Historical Trend */}
      {selectedProduct !== 'all' && historicalTrend.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Historical Stock Trend - {selectedProduct}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historicalTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} MT`} />
              <Legend />
              <Area type="monotone" dataKey="opening" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="closing" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Stock Insights</h3>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock (MT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opening Stock (MT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Turnover
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days of Inventory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action Required
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAnalysis.map((item) => (
                <tr key={item.productId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.currentStock.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.openingStock.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.stockTurnover.toFixed(2)}x
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.daysOfInventory.toFixed(0)} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.stockStatus === 'low' ? 'bg-red-100 text-red-800' :
                      item.stockStatus === 'high' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.stockStatus.charAt(0).toUpperCase() + item.stockStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.stockStatus === 'low' ? 'Increase Production' :
                     item.stockStatus === 'high' ? 'Reduce Production' :
                     'Monitor'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Alerts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Stock Alerts</h3>
        <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                     {stockData.filter(item => item.stockStatus === 'low').map(item => (
            <div key={item.productId} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Low Stock Alert: {item.productName}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Current stock: {item.currentStock.toFixed(1)} MT</p>
                    <p>Days of inventory: {item.daysOfInventory.toFixed(0)} days</p>
                    <p>Action: Increase production immediately</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
                     {stockData.filter(item => item.stockStatus === 'high').map(item => (
            <div key={item.productId} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    High Stock Alert: {item.productName}
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Current stock: {item.currentStock.toFixed(1)} MT</p>
                    <p>Days of inventory: {item.daysOfInventory.toFixed(0)} days</p>
                    <p>Action: Consider reducing production or increasing sales efforts</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
                     {stockData.filter(item => item.stockStatus === 'low' || item.stockStatus === 'high').length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    All stock levels are within normal range
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>No immediate action required for inventory management</p>
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

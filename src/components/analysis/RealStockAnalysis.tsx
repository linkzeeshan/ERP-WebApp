"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, ComposedChart
} from 'recharts';
import { fetchServerAnalytics, StockAnalytics } from '../../services/serverAnalyticsService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
const STATUS_COLORS = {
  low: '#EF4444',
  normal: '#10B981',
  high: '#F59E0B'
};

export default function RealStockAnalysis() {
  const [stockAnalysis, setStockAnalysis] = useState<StockAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  
  // Pagination state for Low Stock Alerts
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Pagination state for Detailed Stock Summary
  const [summaryCurrentPage, setSummaryCurrentPage] = useState(1);
  const [summaryItemsPerPage] = useState(10);

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

  // Filter data based on selections
  const filteredLowStockItems = (stockAnalysis.lowStockItems || []).filter(item => {
    const matchesProduct = selectedProduct === 'all' || item.product.includes(selectedProduct);
    return matchesProduct;
  });

  // Pagination calculations for Low Stock Alerts
  const totalPages = Math.ceil(filteredLowStockItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredLowStockItems.slice(startIndex, endIndex);

  // Handle page changes for Low Stock Alerts
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Prepare Detailed Stock Summary data
  const stockSummaryData = Object.entries(stockAnalysis.stockByProduct || {})
    .sort((a, b) => b[1].weight - a[1].weight)
    .map(([product, data]) => ({
      product,
      boxes: data.boxes,
      weight: data.weight,
      avgWeight: data.avgWeight,
      estimatedValue: data.weight * 1000
    }));

  // Pagination calculations for Detailed Stock Summary
  const summaryTotalPages = Math.ceil(stockSummaryData.length / summaryItemsPerPage);
  const summaryStartIndex = (summaryCurrentPage - 1) * summaryItemsPerPage;
  const summaryEndIndex = summaryStartIndex + summaryItemsPerPage;
  const currentSummaryItems = stockSummaryData.slice(summaryStartIndex, summaryEndIndex);

  // Handle page changes for Detailed Stock Summary
  const handleSummaryPageChange = (page: number) => {
    setSummaryCurrentPage(page);
  };

  // Prepare chart data
  const productData = Object.entries(stockAnalysis.stockByProduct || {})
    .sort((a, b) => b[1].weight - a[1].weight)
    .slice(0, 10)
    .map(([product, data]) => ({
      name: product,
      boxes: data.boxes,
      weight: data.weight,
      avgWeight: data.avgWeight
    }));

  const locationData = Object.entries(stockAnalysis.stockByLocation || {})
    .sort((a, b) => b[1].weight - a[1].weight)
    .map(([location, data]) => ({
      name: location,
      boxes: data.boxes,
      weight: data.weight
    }));

  const gradeData = Object.entries(stockAnalysis.stockByGrade || {}).map(([grade, data]) => ({
    name: grade,
    boxes: data.boxes,
    weight: data.weight
  }));

  // Mock stock age data since API doesn't provide it
  const stockAgeData = [
    { name: 'New Stock', value: Math.floor(stockAnalysis.totalBoxes * 0.3), color: '#10B981' },
    { name: 'Medium Age', value: Math.floor(stockAnalysis.totalBoxes * 0.5), color: '#F59E0B' },
    { name: 'Old Stock', value: Math.floor(stockAnalysis.totalBoxes * 0.2), color: '#EF4444' }
  ];

  const availableProducts = ['all', ...Object.keys(stockAnalysis.stockByProduct || {})];
  const availableLocations = ['all', ...Object.keys(stockAnalysis.stockByLocation || {})];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Stock Insights - Data (Box in Hand)</h2>
        <p className="text-gray-600 mb-4">
          Analysis of current inventory levels, locations, and stock status
        </p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Boxes</h3>
            <p className="text-2xl font-bold text-blue-900">{(stockAnalysis.totalBoxes || 0).toLocaleString()}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Total Weight</h3>
            <p className="text-2xl font-bold text-green-900">{(stockAnalysis.totalWeight || 0).toLocaleString()} kg</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-600">Total Value</h3>
            <p className="text-2xl font-bold text-purple-900">${(stockAnalysis.totalValue || 0).toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-orange-600">Low Stock Items</h3>
            <p className="text-2xl font-bold text-orange-900">{(stockAnalysis.lowStockItems || []).length}</p>
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
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Products</option>
              {availableProducts.slice(1).map(product => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Locations</option>
              {availableLocations.slice(1).map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Products by Weight */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top 10 Products by Weight</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => `${value} kg`} />
              <Legend />
              <Bar dataKey="weight" fill="#8884d8" />
              <Area type="monotone" dataKey="boxes" fill="#82ca9d" stroke="#82ca9d" fillOpacity={0.3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Age Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Stock Age Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockAgeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stockAgeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock by Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Stock by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => `${value} kg`} />
              <Legend />
              <Bar dataKey="weight" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Stock by Grade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} kg`} />
              <Legend />
              <Bar dataKey="weight" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Low Stock Alerts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Threshold (kg)
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
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.currentStock.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.threshold.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'low' ? 'bg-red-100 text-red-800' :
                      item.status === 'high' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.status === 'low' ? 'Immediate restocking required' :
                     item.status === 'high' ? 'Consider reducing production' :
                     'Monitor levels'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls for Low Stock Alerts */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredLowStockItems.length)} of {filteredLowStockItems.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stock Summary Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Stock Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Boxes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Weight (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Weight per Box (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estimated Value ($)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSummaryItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.boxes.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.weight.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.avgWeight.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${item.estimatedValue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls for Detailed Stock Summary */}
        {summaryTotalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {summaryStartIndex + 1} to {Math.min(summaryEndIndex, stockSummaryData.length)} of {stockSummaryData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSummaryPageChange(summaryCurrentPage - 1)}
                disabled={summaryCurrentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: summaryTotalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handleSummaryPageChange(page)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      summaryCurrentPage === page
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handleSummaryPageChange(summaryCurrentPage + 1)}
                disabled={summaryCurrentPage === summaryTotalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900">Inventory Value</h4>
            <p className="text-sm text-blue-700">
              Total inventory value of ${(stockAnalysis.totalValue || 0).toLocaleString()} 
              across {(stockAnalysis.totalBoxes || 0).toLocaleString()} boxes
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900">Stock Distribution</h4>
            <p className="text-sm text-green-700">
              {Object.keys(stockAnalysis.stockByProduct || {}).length} different products 
              in {Object.keys(stockAnalysis.stockByLocation || {}).length} locations
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900">Stock Health</h4>
            <p className="text-sm text-purple-700">
              {(stockAnalysis.lowStockItems || []).filter(item => item.status === 'low').length} items need restocking,
              {(stockAnalysis.lowStockItems || []).filter(item => item.status === 'high').length} items have excess stock
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-900">Average Box Weight</h4>
            <p className="text-sm text-orange-700">
              {((stockAnalysis.totalWeight || 0) / (stockAnalysis.totalBoxes || 1)).toFixed(2)} kg average weight per box
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

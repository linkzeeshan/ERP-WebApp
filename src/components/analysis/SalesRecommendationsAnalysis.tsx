"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ComposedChart, Area
} from 'recharts';
import { fetchServerAnalytics, SalesRecommendationsAnalytics } from '../../services/serverAnalyticsService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const URGENCY_COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981'
};

const PRICE_COLORS = {
  increase: '#EF4444',
  maintain: '#F59E0B',
  decrease: '#10B981'
};

export default function SalesRecommendationsAnalysis() {
  const [salesRecommendations, setSalesRecommendations] = useState<SalesRecommendationsAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  
  // Pagination state for Detailed Sales Recommendations
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchServerAnalytics();
      setSalesRecommendations(data.salesRecommendations);
    } catch (error) {
      console.error('Error loading sales recommendations analysis:', error);
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

  if (!salesRecommendations) {
    return (
      <div className="text-center text-red-600">
        Failed to load sales recommendations data
      </div>
    );
  }

  // Convert API data to match the expected format
  const recommendationsData = (salesRecommendations.recommendations || []).map((rec, index) => ({
    productId: rec.product,
    productName: rec.product,
    currentStock: rec.currentStock,
    recommendedSales: rec.excessStock,
    liquidationNeeded: rec.liquidationNeeded,
    urgency: rec.urgency,
    priceRecommendation: rec.priceRecommendation
  }));

  const filteredRecommendations = recommendationsData.filter(item => {
    const matchesProduct = selectedProduct === 'all' || item.productId === selectedProduct;
    const matchesUrgency = urgencyFilter === 'all' || item.urgency === urgencyFilter;
    return matchesProduct && matchesUrgency;
  });

  // Pagination calculations for Detailed Sales Recommendations
  const totalPages = Math.ceil(filteredRecommendations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredRecommendations.slice(startIndex, endIndex);

  // Handle page changes for Detailed Sales Recommendations
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalLiquidationNeeded = recommendationsData.reduce((sum, s) => sum + s.liquidationNeeded, 0);
  const totalRecommendedSales = recommendationsData.reduce((sum, s) => sum + s.recommendedSales, 0);
  const highUrgencyItems = recommendationsData.filter(s => s.urgency === 'high').length;
  const priceIncreaseItems = recommendationsData.filter(s => s.priceRecommendation === 'increase').length;
  const priceDecreaseItems = recommendationsData.filter(s => s.priceRecommendation === 'decrease').length;

  const salesData = filteredRecommendations.map(item => ({
    name: item.productName,
    'Current Stock': item.currentStock,
    'Recommended Sales': item.recommendedSales,
    'Liquidation Needed': item.liquidationNeeded
  }));

  const urgencyData = [
    { name: 'High Urgency', value: highUrgencyItems, color: URGENCY_COLORS.high },
    { name: 'Medium Urgency', value: recommendationsData.filter(s => s.urgency === 'medium').length, color: URGENCY_COLORS.medium },
    { name: 'Low Urgency', value: recommendationsData.filter(s => s.urgency === 'low').length, color: URGENCY_COLORS.low }
  ];

  const priceRecommendationData = [
    { name: 'Increase Price', value: priceIncreaseItems, color: PRICE_COLORS.increase },
    { name: 'Maintain Price', value: recommendationsData.filter(s => s.priceRecommendation === 'maintain').length, color: PRICE_COLORS.maintain },
    { name: 'Decrease Price', value: priceDecreaseItems, color: PRICE_COLORS.decrease }
  ];

  const liquidationAnalysisData = filteredRecommendations.map(item => ({
    name: item.productName,
    'Liquidation Needed': item.liquidationNeeded,
    'Urgency': item.urgency
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Sales Recommendations Analysis - Data</h2>
        <p className="text-gray-600 mb-4">
          Data-driven recommendations for optimal sales strategies and inventory management
        </p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Liquidation Needed</h3>
            <p className="text-2xl font-bold text-blue-900">{totalLiquidationNeeded.toFixed(1)} MT</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Recommended Sales</h3>
            <p className="text-2xl font-bold text-green-900">{totalRecommendedSales.toFixed(1)} MT</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-600">High Urgency Items</h3>
            <p className="text-2xl font-bold text-red-900">{highUrgencyItems}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-600">Price Increases</h3>
            <p className="text-2xl font-bold text-purple-900">{priceIncreaseItems}</p>
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
              {Object.keys(salesRecommendations.recommendations || {}).map(product => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Urgency
            </label>
            <select
              value={urgencyFilter}
              onChange={(e) => {
                setUrgencyFilter(e.target.value);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Urgency Levels</option>
              <option value="high">High Urgency</option>
              <option value="medium">Medium Urgency</option>
              <option value="low">Low Urgency</option>
            </select>
          </div>

        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Recommendations Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Recommendations Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => `${value} MT`} />
              <Legend />
              <Bar dataKey="Current Stock" fill="#8884d8" />
              <Bar dataKey="Recommended Sales" fill="#82ca9d" />
              <Bar dataKey="Liquidation Needed" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Urgency Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Urgency Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={urgencyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {urgencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Price Recommendations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priceRecommendationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priceRecommendationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Liquidation Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={liquidationAnalysisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => `${value} MT`} />
              <Legend />
              <Bar dataKey="Liquidation Needed">
                {liquidationAnalysisData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.Urgency === 'high' ? URGENCY_COLORS.high :
                      entry.Urgency === 'medium' ? URGENCY_COLORS.medium :
                      URGENCY_COLORS.low
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Sales Recommendations</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock (MT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recommended Sales (MT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liquidation Needed (MT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price Recommendation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action Plan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item.productId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.currentStock.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-medium text-blue-600">
                      {item.recommendedSales.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`font-medium ${
                      item.liquidationNeeded > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {item.liquidationNeeded.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.priceRecommendation === 'increase' ? 'bg-red-100 text-red-800' :
                      item.priceRecommendation === 'decrease' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.priceRecommendation.charAt(0).toUpperCase() + item.priceRecommendation.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.urgency === 'high' ? 'bg-red-100 text-red-800' :
                      item.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.urgency === 'high' ? 'Immediate action required' :
                     item.urgency === 'medium' ? 'Plan within this month' :
                     'Monitor and adjust as needed'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls for Detailed Sales Recommendations */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredRecommendations.length)} of {filteredRecommendations.length} results
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

      {/* Sales Action Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Sales Action Items</h3>
        <div className="space-y-4">
                     {recommendationsData.filter(item => item.urgency === 'high').map(item => (
            <div key={item.productId} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">
                    High Priority: {item.productName}
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    Liquidation needed: {item.liquidationNeeded.toFixed(1)} MT | 
                    Price recommendation: {item.priceRecommendation.charAt(0).toUpperCase() + item.priceRecommendation.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

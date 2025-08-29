"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area
} from 'recharts';
import { fetchSalesRecommendationsAnalytics, SalesRecommendationsAnalytics } from '../../services/serverAnalyticsService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
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

export default function RealSalesRecommendationsAnalysis() {
  const [salesAnalysis, setSalesAnalysis] = useState<SalesRecommendationsAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchSalesRecommendationsAnalytics();
      setSalesAnalysis(data);
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

  if (!salesAnalysis) {
    return (
      <div className="text-center text-red-600">
        Failed to load sales recommendations analysis data
      </div>
    );
  }

  // Filter data based on selections
  const filteredRecommendations = salesAnalysis.recommendations.filter(rec => {
    const matchesProduct = selectedProduct === 'all' || rec.product === selectedProduct;
    const matchesUrgency = urgencyFilter === 'all' || rec.urgency === urgencyFilter;
    return matchesProduct && matchesUrgency;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecommendations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredRecommendations.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Prepare chart data
  const salesData = filteredRecommendations.map(rec => ({
    name: rec.product,
    'Current Stock': rec.currentStock,
    'Excess Stock': rec.excessStock,
    'Liquidation Needed': rec.liquidationNeeded
  }));

  const urgencyData = [
    { name: 'High Urgency', value: salesAnalysis.recommendations.filter(rec => rec.urgency === 'high').length, color: URGENCY_COLORS.high },
    { name: 'Medium Urgency', value: salesAnalysis.recommendations.filter(rec => rec.urgency === 'medium').length, color: URGENCY_COLORS.medium },
    { name: 'Low Urgency', value: salesAnalysis.recommendations.filter(rec => rec.urgency === 'low').length, color: URGENCY_COLORS.low }
  ];

  const priceRecommendationData = [
    { name: 'Increase Price', value: salesAnalysis.recommendations.filter(rec => rec.priceRecommendation === 'increase').length, color: PRICE_COLORS.increase },
    { name: 'Maintain Price', value: salesAnalysis.recommendations.filter(rec => rec.priceRecommendation === 'maintain').length, color: PRICE_COLORS.maintain },
    { name: 'Decrease Price', value: salesAnalysis.recommendations.filter(rec => rec.priceRecommendation === 'decrease').length, color: PRICE_COLORS.decrease }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Sales Recommendations Analysis</h2>
        <p className="text-gray-600 mb-4">
          AI-powered recommendations for inventory optimization and sales strategies
        </p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Excess Stock</h3>
            <p className="text-2xl font-bold text-blue-900">{salesAnalysis.totalExcessStock.toFixed(1)} kg</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-600">Liquidation Needed</h3>
            <p className="text-2xl font-bold text-red-900">{salesAnalysis.totalLiquidationNeeded.toFixed(1)} kg</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600">High Urgency Items</h3>
            <p className="text-2xl font-bold text-yellow-900">{salesAnalysis.recommendations.filter(rec => rec.urgency === 'high').length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Price Actions</h3>
            <p className="text-2xl font-bold text-green-900">
              {salesAnalysis.recommendations.filter(rec => rec.priceRecommendation === 'increase').length}↑ 
              {salesAnalysis.recommendations.filter(rec => rec.priceRecommendation === 'decrease').length}↓
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Filter</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Products</option>
              {Array.from(new Set(salesAnalysis.recommendations.map(rec => rec.product))).map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Filter</label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Urgency Levels</option>
              <option value="high">High Urgency</option>
              <option value="medium">Medium Urgency</option>
              <option value="low">Low Urgency</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Analysis Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Stock Analysis by Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Current Stock" fill="#3B82F6" />
              <Bar dataKey="Excess Stock" fill="#EF4444" />
              <Bar dataKey="Liquidation Needed" fill="#F59E0B" />
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

      {/* Price Recommendations Chart */}
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

      {/* Detailed Recommendations Table */}
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
                  Current Stock (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Excess Stock (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liquidation Needed (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recommended Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((rec, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rec.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rec.currentStock.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rec.excessStock.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rec.liquidationNeeded.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    {rec.recommendedAction}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      rec.urgency === 'high' ? 'bg-red-100 text-red-800' :
                      rec.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.urgency.charAt(0).toUpperCase() + rec.urgency.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      rec.priceRecommendation === 'increase' ? 'bg-green-100 text-green-800' :
                      rec.priceRecommendation === 'decrease' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rec.priceRecommendation.charAt(0).toUpperCase() + rec.priceRecommendation.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <nav className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area
} from 'recharts';
import { fetchProductionNeedsAnalytics, ProductionNeedsAnalytics } from '../../services/serverAnalyticsService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
const PRIORITY_COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981'
};

export default function RealProductionAnalysis() {
  const [productionAnalysis, setProductionAnalysis] = useState<ProductionNeedsAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchProductionNeedsAnalytics();
      setProductionAnalysis(data);
    } catch (error) {
      console.error('Error loading production analysis:', error);
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

  if (!productionAnalysis) {
    return (
      <div className="text-center text-red-600">
        Failed to load production analysis data
      </div>
    );
  }

  // Filter data based on selections
  const filteredGaps = productionAnalysis.productionGaps.filter(gap => {
    const matchesProduct = selectedProduct === 'all' || gap.product === selectedProduct;
    const matchesPriority = priorityFilter === 'all' || gap.priority === priorityFilter;
    return matchesProduct && matchesPriority;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredGaps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredGaps.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Prepare chart data
  const productionData = filteredGaps.map(gap => ({
    name: gap.product,
    'Production Needed': gap.productionNeeded,
    'Demand': gap.demand,
    'Current Stock': gap.currentStock
  }));

  const priorityData = [
    { name: 'High Priority', value: productionAnalysis.highPriorityItems, color: PRIORITY_COLORS.high },
    { name: 'Medium Priority', value: productionAnalysis.mediumPriorityItems, color: PRIORITY_COLORS.medium },
    { name: 'Low Priority', value: productionAnalysis.lowPriorityItems, color: PRIORITY_COLORS.low }
  ];

  const gapAnalysisData = filteredGaps.map(gap => ({
    name: gap.product,
    'Gap Percentage': gap.gapPercentage,
    'Priority': gap.priority
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Production Needs Analysis</h2>
        <p className="text-gray-600 mb-4">
          Analysis of production requirements based on demand and current stock levels
        </p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Production Needed</h3>
            <p className="text-2xl font-bold text-blue-900">{productionAnalysis.totalProductionNeeded.toFixed(1)} kg</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-600">High Priority Items</h3>
            <p className="text-2xl font-bold text-red-900">{productionAnalysis.highPriorityItems}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600">Medium Priority Items</h3>
            <p className="text-2xl font-bold text-yellow-900">{productionAnalysis.mediumPriorityItems}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Low Priority Items</h3>
            <p className="text-2xl font-bold text-green-900">{productionAnalysis.lowPriorityItems}</p>
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
              {Array.from(new Set(productionAnalysis.productionGaps.map(gap => gap.product))).map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Filter</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <BarChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Production Needed" fill="#EF4444" />
              <Bar dataKey="Demand" fill="#3B82F6" />
              <Bar dataKey="Current Stock" fill="#10B981" />
            </BarChart>
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

      {/* Gap Analysis Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Production Gap Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={gapAnalysisData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Gap Percentage" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Production Gaps Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Production Gaps</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demand (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Production Needed (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gap %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((gap, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {gap.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gap.demand.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gap.currentStock.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gap.productionNeeded.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gap.gapPercentage.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      gap.priority === 'high' ? 'bg-red-100 text-red-800' :
                      gap.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {gap.priority.charAt(0).toUpperCase() + gap.priority.slice(1)}
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

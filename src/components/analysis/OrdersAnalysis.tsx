"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { fetchServerAnalytics, OrderAnalytics } from '../../services/serverAnalyticsService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function OrdersAnalysis() {
  const [orderAnalysis, setOrderAnalysis] = useState<OrderAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchServerAnalytics();
      setOrderAnalysis(data.orders);
    } catch (error) {
      console.error('Error loading orders analysis:', error);
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

  if (!orderAnalysis) {
    return (
      <div className="text-center text-red-600">
        Failed to load orders analysis data
      </div>
    );
  }

  // Convert API data to match the expected format
  const orderData = Object.entries(orderAnalysis.ordersByProduct || {}).map(([product, data]) => ({
    productId: product,
    productName: product,
    revenue: data.value,
    totalDemand: data.quantity * 1.2, // Simulated demand
    totalSales: data.quantity,
    pendingOrders: Math.floor(data.quantity * 0.1), // Simulated pending orders
    averagePrice: data.value / data.quantity
  }));

  const filteredAnalysis = selectedProduct === 'all' 
    ? orderData 
    : orderData.filter(o => o.productId === selectedProduct);

  const totalRevenue = orderData.reduce((sum, o) => sum + o.revenue, 0);
  const totalDemand = orderData.reduce((sum, o) => sum + o.totalDemand, 0);
  const totalSales = orderData.reduce((sum, o) => sum + o.totalSales, 0);
  const totalPending = orderData.reduce((sum, o) => sum + o.pendingOrders, 0);

  const demandVsSalesData = filteredAnalysis.map(item => ({
    name: item.productName,
    Demand: item.totalDemand,
    Sales: item.totalSales,
    Pending: item.pendingOrders
  }));

  const revenueData = filteredAnalysis.map(item => ({
    name: item.productName,
    Revenue: item.revenue,
    'Avg Price': item.averagePrice
  }));

  const pieData = filteredAnalysis.map(item => ({
    name: item.productName,
    value: item.revenue
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Orders Analysis - Data</h2>
        <p className="text-gray-600 mb-4">
          Analysis of orders, demand patterns, and sales performance across all products
        </p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Revenue</h3>
            <p className="text-2xl font-bold text-blue-900">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Total Demand</h3>
            <p className="text-2xl font-bold text-green-900">{totalDemand.toFixed(1)} MT</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600">Total Sales</h3>
            <p className="text-2xl font-bold text-yellow-900">{totalSales.toFixed(1)} MT</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-600">Pending Orders</h3>
            <p className="text-2xl font-bold text-red-900">{totalPending.toFixed(1)} MT</p>
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
            {Object.keys(orderAnalysis.ordersByProduct || {}).map(product => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand vs Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Demand vs Sales vs Pending Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demandVsSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => `${value} MT`} />
              <Legend />
              <Bar dataKey="Demand" fill="#3B82F6" />
              <Bar dataKey="Sales" fill="#10B981" />
              <Bar dataKey="Pending" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue by Product</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="Revenue" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Orders Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demand (MT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales (MT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending (MT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Price ($/MT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue ($)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fulfillment %
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
                    {item.totalDemand.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.totalSales.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.pendingOrders > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.pendingOrders.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${item.averagePrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${item.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (item.totalSales / item.totalDemand) * 100 >= 90 ? 'bg-green-100 text-green-800' :
                      (item.totalSales / item.totalDemand) * 100 >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {((item.totalSales / item.totalDemand) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

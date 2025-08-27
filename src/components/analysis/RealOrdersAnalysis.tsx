"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area
} from 'recharts';
import { loadExcelData } from '../../services/excelDataLoader';
import { analyzeOrders, OrderAnalysis } from '../../services/excelAnalysisService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
const ORDER_TYPE_COLORS = {
  export: '#FF6B6B',
  local: '#4ECDC4'
};

export default function RealOrdersAnalysis() {
  const [orderAnalysis, setOrderAnalysis] = useState<OrderAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await loadExcelData();
      const analysis = analyzeOrders(data);
      setOrderAnalysis(analysis);
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

  // Filter data based on selections
  const filteredRecentOrders = orderAnalysis.recentOrders.filter(order => {
    const matchesProduct = selectedProduct === 'all' || order.product === selectedProduct;
    const matchesCustomer = selectedCustomer === 'all' || order.customer === selectedCustomer;
    return matchesProduct && matchesCustomer;
  });

  // Prepare chart data
  const productData = Object.entries(orderAnalysis.ordersByProduct).map(([product, data]) => ({
    name: product,
    quantity: data.quantity,
    value: data.value,
    count: data.count
  }));

  const customerData = Object.entries(orderAnalysis.ordersByCustomer)
    .sort((a, b) => b[1].value - a[1].value)
    .slice(0, 10)
    .map(([customer, data]) => ({
      name: customer.length > 20 ? customer.substring(0, 20) + '...' : customer,
      quantity: data.quantity,
      value: data.value,
      count: data.count
    }));

  const countryData = Object.entries(orderAnalysis.ordersByCountry).map(([country, data]) => ({
    name: country,
    quantity: data.quantity,
    value: data.value,
    count: data.count
  }));

  const orderTypeData = [
    { name: 'Export Orders', value: orderAnalysis.exportOrders, color: ORDER_TYPE_COLORS.export },
    { name: 'Local Orders', value: orderAnalysis.localOrders, color: ORDER_TYPE_COLORS.local }
  ];

  const availableProducts = ['all', ...Object.keys(orderAnalysis.ordersByProduct)];
  const availableCustomers = ['all', ...Object.keys(orderAnalysis.ordersByCustomer)];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Orders Analysis - Data</h2>
        <p className="text-gray-600 mb-4">
          Analysis of export and local orders with customer and product breakdown
        </p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Orders</h3>
            <p className="text-2xl font-bold text-blue-900">{orderAnalysis.totalOrders}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Total Quantity</h3>
            <p className="text-2xl font-bold text-green-900">{orderAnalysis.totalQuantity.toLocaleString()} kg</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-600">Total Value</h3>
            <p className="text-2xl font-bold text-purple-900">${orderAnalysis.totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-orange-600">Export vs Local</h3>
            <p className="text-2xl font-bold text-orange-900">{orderAnalysis.exportOrders} / {orderAnalysis.localOrders}</p>
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
              {availableProducts.map(product => (
                <option key={product} value={product}>
                  {product === 'all' ? 'All Products' : product}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Customer
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {availableCustomers.map(customer => (
                <option key={customer} value={customer}>
                  {customer === 'all' ? 'All Customers' : customer}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Product */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Orders by Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="quantity" fill="#8884d8" name="Quantity (kg)" />
              <Bar dataKey="value" fill="#82ca9d" name="Value ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Type Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Order Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* More Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top 10 Customers by Value</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="value" fill="#ff7300" name="Order Value ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Country */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Orders by Country</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={countryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="quantity" fill="#8884d8" name="Quantity (kg)" />
              <Area type="monotone" dataKey="value" fill="#82ca9d" stroke="#82ca9d" fillOpacity={0.3} name="Value ($)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value ($)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecentOrders.map((order, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer.length > 30 ? order.customer.substring(0, 30) + '...' : order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.type === 'export' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900">Export Orders</h4>
            <p className="text-sm text-blue-700">
              {orderAnalysis.exportOrders} export orders with total value of ${orderAnalysis.exportOrders > 0 ? 
                (orderAnalysis.totalValue * 0.7).toLocaleString() : '0'} 
              (estimated 70% of total value)
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900">Local Orders</h4>
            <p className="text-sm text-green-700">
              {orderAnalysis.localOrders} local orders with total value of ${orderAnalysis.localOrders > 0 ? 
                (orderAnalysis.totalValue * 0.3).toLocaleString() : '0'} 
              (estimated 30% of total value)
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900">Top Product</h4>
            <p className="text-sm text-purple-700">
              {productData.length > 0 ? productData[0].name : 'N/A'} with {productData.length > 0 ? 
                productData[0].quantity.toLocaleString() : '0'} kg ordered
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-900">Average Order Value</h4>
            <p className="text-sm text-orange-700">
              ${orderAnalysis.totalOrders > 0 ? (orderAnalysis.totalValue / orderAnalysis.totalOrders).toLocaleString() : '0'} 
              per order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

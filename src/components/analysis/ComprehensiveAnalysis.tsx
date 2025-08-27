"use client";

import React, { useState } from 'react';
import OrdersAnalysis from './OrdersAnalysis';
import StockAnalysis from './StockAnalysis';
import ProductionNeedsAnalysis from './ProductionNeedsAnalysis';
import SalesRecommendationsAnalysis from './SalesRecommendationsAnalysis';

export default function ComprehensiveAnalysis({ initialTab = 'orders' }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'orders', name: 'Order Analytics', icon: '📊' },
    { id: 'stock', name: 'Stock Insights', icon: '📦' },
    { id: 'production', name: 'Production Analytics', icon: '🏭' },
    { id: 'sales', name: 'Sales Analytics', icon: '💰' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-2">Business Intelligence Dashboard</h1>
        <p className="text-gray-600">
          Comprehensive analytics for orders, inventory, production, and sales performance
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'orders' && (
            <div>
              <OrdersAnalysis />
            </div>
          )}
          
          {activeTab === 'stock' && (
            <div>
              <StockAnalysis />
            </div>
          )}
          
          {activeTab === 'production' && (
            <div>
              <ProductionNeedsAnalysis />
            </div>
          )}
          
          {activeTab === 'sales' && (
            <div>
              <SalesRecommendationsAnalysis />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

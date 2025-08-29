"use client";

import React, { useState, useEffect } from 'react';
import Tabs from '../../app/components/ui/Tabs';
import RealOrdersAnalysis from './RealOrdersAnalysis';
import RealStockAnalysis from './RealStockAnalysis';
import EnhancedChart from '../ui/EnhancedChart';
import HeatmapChart from '../ui/HeatmapChart';
import ScatterPlotChart from '../ui/ScatterPlotChart';
import KPIDashboard from '../ui/KPIDashboard';
import AdvancedFilters from '../ui/AdvancedFilters';
import GoalTracker from '../ui/GoalTracker';
import AlertSystem from '../ui/AlertSystem';
import ComparisonView from '../ui/ComparisonView';
import PredictiveAnalytics from '../ui/PredictiveAnalytics';
import BreadcrumbNav from '../ui/BreadcrumbNav';
import QuickActions, { commonActions } from '../ui/QuickActions';
import SummaryCard from '../ui/SummaryCard';
import StatusBadge, { StatusBadges } from '../ui/StatusBadge';
import ActionButtons, { CommonActions } from '../ui/ActionButtons';
import AnomalyDetection from '../ui/AnomalyDetection';
import RecommendationEngine from '../ui/RecommendationEngine';
import CustomerSegmentation from '../ui/CustomerSegmentation';
import PriceOptimization from '../ui/PriceOptimization';
import { fetchServerAnalytics, ServerAnalyticsResponse } from '../../services/serverAnalyticsService';

interface RealComprehensiveAnalysisProps {
  initialTab?: string;
}

export default function RealComprehensiveAnalysis({ initialTab = 'orders' }: RealComprehensiveAnalysisProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<ServerAnalyticsResponse | null>(null);
  
  // Pagination state for Sales Recommendations
  const [salesCurrentPage, setSalesCurrentPage] = useState(1);
  const [salesItemsPerPage] = useState(5);

  // Chart data preparation
  const productionData = analysisData?.productionNeeds?.productionGaps?.map((gap: any) => ({
    name: gap.product,
    'Production Needed': gap.productionNeeded,
    'Demand': gap.demand,
    'Current Stock': gap.currentStock
  })) || [];

  const priorityData = analysisData?.productionNeeds ? [
    { name: 'High Priority', value: analysisData.productionNeeds.highPriorityItems, color: '#EF4444' },
    { name: 'Medium Priority', value: analysisData.productionNeeds.mediumPriorityItems, color: '#F59E0B' },
    { name: 'Low Priority', value: analysisData.productionNeeds.lowPriorityItems, color: '#10B981' }
  ] : [];

  const gapAnalysisData = analysisData?.productionNeeds?.productionGaps?.map((gap: any) => ({
    name: gap.product,
    'Gap Percentage': gap.gapPercentage,
    'Priority': gap.priority
  })) || [];

  const salesData = analysisData?.salesRecommendations?.recommendations?.map((rec: any) => ({
    name: rec.product,
    'Current Stock': rec.currentStock,
    'Excess Stock': rec.excessStock,
    'Recommended Action': rec.recommendedAction
  })) || [];

  const urgencyData = analysisData?.salesRecommendations ? [
    { name: 'High Urgency', value: analysisData.salesRecommendations.recommendations?.filter((r: any) => r.urgency === 'high').length || 0, color: '#EF4444' },
    { name: 'Medium Urgency', value: analysisData.salesRecommendations.recommendations?.filter((r: any) => r.urgency === 'medium').length || 0, color: '#F59E0B' },
    { name: 'Low Urgency', value: analysisData.salesRecommendations.recommendations?.filter((r: any) => r.urgency === 'low').length || 0, color: '#10B981' }
  ] : [];

  const priceRecommendationData = analysisData?.salesRecommendations ? [
    { name: 'Increase Price', value: analysisData.salesRecommendations.recommendations?.filter((r: any) => r.priceRecommendation === 'increase').length || 0, color: '#EF4444' },
    { name: 'Maintain Price', value: analysisData.salesRecommendations.recommendations?.filter((r: any) => r.priceRecommendation === 'maintain').length || 0, color: '#F59E0B' },
    { name: 'Decrease Price', value: analysisData.salesRecommendations.recommendations?.filter((r: any) => r.priceRecommendation === 'decrease').length || 0, color: '#10B981' }
  ] : [];

  // Enhanced chart data preparation
  const heatmapData = analysisData?.stock?.stockByLocation ? 
    Object.entries(analysisData.stock.stockByLocation).flatMap(([location, locationData]: [string, any]) => 
      Object.entries(analysisData.stock.stockByProduct).map(([product, productData]: [string, any]) => ({
        location,
        product,
        value: Math.random() * 1000, // Simulated value for demo
        weight: productData.weight,
        boxes: productData.boxes
      }))
    ) : [];

  const scatterData = analysisData?.productionNeeds?.productionGaps?.map((gap: any) => ({
    name: gap.product,
    demand: gap.demand,
    supply: gap.currentStock,
    stock: gap.currentStock,
    priority: gap.priority,
    category: gap.product.split(' ')[0] // Use first word as category
  })) || [];

  // Drill-down data for enhanced charts
  const drillDownData = analysisData?.productionNeeds?.productionGaps?.reduce((acc: any, gap: any) => {
    acc[gap.product] = [
      { name: 'Demand', value: gap.demand },
      { name: 'Current Stock', value: gap.currentStock },
      { name: 'Production Needed', value: gap.productionNeeded },
      { name: 'Gap %', value: gap.gapPercentage }
    ];
    return acc;
  }, {}) || {};

  // KPI Dashboard data
  const kpiData = analysisData ? [
    {
      id: 'total-orders',
      title: 'Total Orders',
      value: analysisData.orders.totalOrders,
      previousValue: Math.floor(analysisData.orders.totalOrders * 0.9), // Simulated previous value
      unit: 'orders',
      trend: 'up' as const,
      trendPercentage: 12.5,
      color: '#3B82F6',
      icon: '📦',
      chartData: [
        { date: '2024-01-01', value: 1200 },
        { date: '2024-01-02', value: 1350 },
        { date: '2024-01-03', value: 1100 },
        { date: '2024-01-04', value: 1400 },
        { date: '2024-01-05', value: 1600 },
        { date: '2024-01-06', value: 1450 },
        { date: '2024-01-07', value: 1800 }
      ],
      description: 'Total orders received'
    },
    {
      id: 'total-stock',
      title: 'Total Stock',
      value: analysisData.stock.totalBoxes,
      previousValue: Math.floor(analysisData.stock.totalBoxes * 0.95),
      unit: 'boxes',
      trend: 'stable' as const,
      trendPercentage: 2.1,
      color: '#10B981',
      icon: '📊',
      chartData: [
        { date: '2024-01-01', value: 45000 },
        { date: '2024-01-02', value: 46000 },
        { date: '2024-01-03', value: 45500 },
        { date: '2024-01-04', value: 47000 },
        { date: '2024-01-05', value: 46500 },
        { date: '2024-01-06', value: 48000 },
        { date: '2024-01-07', value: 47500 }
      ],
      description: 'Total inventory boxes'
    },
    {
      id: 'production-needed',
      title: 'Production Needed',
      value: analysisData.productionNeeds.totalProductionNeeded,
      previousValue: Math.floor(analysisData.productionNeeds.totalProductionNeeded * 1.1),
      unit: 'kg',
      trend: 'down' as const,
      trendPercentage: -8.3,
      color: '#EF4444',
      icon: '🏭',
      chartData: [
        { date: '2024-01-01', value: 25000 },
        { date: '2024-01-02', value: 24000 },
        { date: '2024-01-03', value: 23000 },
        { date: '2024-01-04', value: 22000 },
        { date: '2024-01-05', value: 21000 },
        { date: '2024-01-06', value: 20000 },
        { date: '2024-01-07', value: 19000 }
      ],
      description: 'Production requirements'
    },
    {
      id: 'excess-stock',
      title: 'Excess Stock',
      value: analysisData.salesRecommendations.totalExcessStock,
      previousValue: Math.floor(analysisData.salesRecommendations.totalExcessStock * 0.85),
      unit: 'kg',
      trend: 'up' as const,
      trendPercentage: 15.2,
      color: '#F59E0B',
      icon: '⚠️',
      chartData: [
        { date: '2024-01-01', value: 8000 },
        { date: '2024-01-02', value: 8500 },
        { date: '2024-01-03', value: 9000 },
        { date: '2024-01-04', value: 9500 },
        { date: '2024-01-05', value: 10000 },
        { date: '2024-01-06', value: 10500 },
        { date: '2024-01-07', value: 11000 }
      ],
      description: 'Excess inventory to liquidate'
    }
  ] : [];

  // Advanced Filters configuration
  const filterConfig = [
    {
      id: 'product-search',
      label: 'Product Search',
      type: 'search' as const,
      placeholder: 'Search products...'
    },
    {
      id: 'priority-filter',
      label: 'Priority Level',
      type: 'select' as const,
      options: [
        { value: 'high', label: 'High Priority', count: analysisData?.productionNeeds?.highPriorityItems || 0 },
        { value: 'medium', label: 'Medium Priority', count: analysisData?.productionNeeds?.mediumPriorityItems || 0 },
        { value: 'low', label: 'Low Priority', count: analysisData?.productionNeeds?.lowPriorityItems || 0 }
      ]
    },
    {
      id: 'urgency-filter',
      label: 'Urgency Level',
      type: 'multiselect' as const,
      options: [
        { value: 'high', label: 'High Urgency' },
        { value: 'medium', label: 'Medium Urgency' },
        { value: 'low', label: 'Low Urgency' }
      ]
    },
    {
      id: 'stock-range',
      label: 'Stock Range (kg)',
      type: 'range' as const,
      min: 0,
      max: 10000,
      step: 100
    },
    {
      id: 'show-excess-only',
      label: 'Show Excess Stock Only',
      type: 'toggle' as const
    }
  ];

  // Goal Tracking data
  const goalData = analysisData ? [
    {
      id: 'sales-goal-1',
      title: 'Monthly Sales Target',
      target: 500000,
      current: 420000,
      unit: 'kg',
      period: 'January 2024',
      category: 'sales' as const,
      priority: 'high' as const,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      description: 'Achieve monthly sales target for all products'
    },
    {
      id: 'production-goal-1',
      title: 'Production Efficiency',
      target: 95,
      current: 87,
      unit: '%',
      period: 'Q1 2024',
      category: 'production' as const,
      priority: 'medium' as const,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      description: 'Improve production efficiency to 95%'
    },
    {
      id: 'inventory-goal-1',
      title: 'Stock Turnover',
      target: 12,
      current: 8,
      unit: 'times/year',
      period: '2024',
      category: 'inventory' as const,
      priority: 'high' as const,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      description: 'Increase inventory turnover rate'
    },
    {
      id: 'quality-goal-1',
      title: 'Quality Standards',
      target: 99.5,
      current: 98.2,
      unit: '%',
      period: '2024',
      category: 'quality' as const,
      priority: 'high' as const,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      description: 'Maintain quality standards above 99.5%'
    }
  ] : [];

  // Advanced Analytics data preparation
  // Anomaly Detection data
  const anomalyData = analysisData ? [
    {
      date: '2024-01-15',
      value: 1250,
      isAnomaly: true,
      confidence: 85,
      type: 'sales' as const,
      severity: 'high' as const,
      description: 'Unusual spike in sales volume'
    },
    {
      date: '2024-01-20',
      value: 850,
      isAnomaly: false,
      confidence: 0,
      type: 'sales' as const,
      severity: 'low' as const,
      description: 'Normal sales pattern'
    },
    {
      date: '2024-01-25',
      value: 2100,
      isAnomaly: true,
      confidence: 92,
      type: 'stock' as const,
      severity: 'medium' as const,
      description: 'Abnormal inventory depletion'
    },
    {
      date: '2024-01-30',
      value: 950,
      isAnomaly: false,
      confidence: 0,
      type: 'demand' as const,
      severity: 'low' as const,
      description: 'Expected demand pattern'
    },
    {
      date: '2024-02-05',
      value: 1800,
      isAnomaly: true,
      confidence: 78,
      type: 'sales' as const,
      severity: 'high' as const,
      description: 'Unexpected sales surge'
    }
  ] : [];

  // Recommendation Engine data
  const recommendationData = analysisData ? [
    {
      id: 'rec-1',
      type: 'restock' as const,
      product: 'POY 150D/48F',
      category: 'Yarn',
      currentStock: 1500,
      recommendedAction: 2500,
      confidence: 92,
      impact: 'high' as const,
      savings: 15000,
      description: 'Increase stock to meet growing demand',
      priority: 9,
      timeframe: '2 weeks'
    },
    {
      id: 'rec-2',
      type: 'reduce' as const,
      product: 'FDY 75D/36F',
      category: 'Yarn',
      currentStock: 3000,
      recommendedAction: 2000,
      confidence: 85,
      impact: 'medium' as const,
      savings: 8000,
      description: 'Reduce excess inventory to optimize costs',
      priority: 7,
      timeframe: '1 month'
    },
    {
      id: 'rec-3',
      type: 'optimize' as const,
      product: 'DTY 150D/48F',
      category: 'Yarn',
      currentStock: 2200,
      recommendedAction: 1800,
      confidence: 88,
      impact: 'high' as const,
      savings: 12000,
      description: 'Optimize stock levels for better turnover',
      priority: 8,
      timeframe: '3 weeks'
    },
    {
      id: 'rec-4',
      type: 'discontinue' as const,
      product: 'PSF 1.4D x 38mm',
      category: 'Fiber',
      currentStock: 500,
      recommendedAction: 0,
      confidence: 95,
      impact: 'low' as const,
      savings: 3000,
      description: 'Discontinue slow-moving product',
      priority: 6,
      timeframe: 'Immediate'
    }
  ] : [];

  // Customer Segmentation data
  const customerSegments = analysisData ? [
    {
      id: 'seg-1',
      segment: 'Premium Buyers',
      size: 2500,
      avgOrderValue: 2500,
      frequency: 3.2,
      lifetimeValue: 45000,
      churnRisk: 15,
      satisfaction: 92,
      demographics: {
        ageGroup: '35-50',
        location: 'Urban',
        incomeLevel: 'High'
      },
      preferences: ['Organic', 'Premium Quality', 'Fast Delivery'],
      behavior: {
        onlineShopping: 85,
        storeVisits: 15,
        seasonalBuying: 30
      },
      recommendations: [
        'Offer premium packaging options',
        'Implement loyalty rewards program',
        'Provide personalized recommendations'
      ]
    },
    {
      id: 'seg-2',
      segment: 'Bulk Purchasers',
      size: 1800,
      avgOrderValue: 5000,
      frequency: 1.8,
      lifetimeValue: 35000,
      churnRisk: 25,
      satisfaction: 88,
      demographics: {
        ageGroup: '40-60',
        location: 'Suburban',
        incomeLevel: 'Medium-High'
      },
      preferences: ['Bulk Discounts', 'Reliable Supply', 'Quality Assurance'],
      behavior: {
        onlineShopping: 60,
        storeVisits: 40,
        seasonalBuying: 45
      },
      recommendations: [
        'Offer volume-based pricing tiers',
        'Provide bulk storage solutions',
        'Implement automated reordering'
      ]
    },
    {
      id: 'seg-3',
      segment: 'Regular Consumers',
      size: 4500,
      avgOrderValue: 1200,
      frequency: 4.5,
      lifetimeValue: 28000,
      churnRisk: 35,
      satisfaction: 85,
      demographics: {
        ageGroup: '25-45',
        location: 'Mixed',
        incomeLevel: 'Medium'
      },
      preferences: ['Convenience', 'Good Value', 'Fresh Products'],
      behavior: {
        onlineShopping: 75,
        storeVisits: 25,
        seasonalBuying: 20
      },
      recommendations: [
        'Enhance mobile app experience',
        'Offer subscription services',
        'Provide flexible delivery options'
      ]
    },
    {
      id: 'seg-4',
      segment: 'Price Sensitive',
      size: 3200,
      avgOrderValue: 800,
      frequency: 2.1,
      lifetimeValue: 15000,
      churnRisk: 45,
      satisfaction: 78,
      demographics: {
        ageGroup: '20-40',
        location: 'Rural',
        incomeLevel: 'Low-Medium'
      },
      preferences: ['Low Prices', 'Basic Quality', 'Reliable Supply'],
      behavior: {
        onlineShopping: 40,
        storeVisits: 60,
        seasonalBuying: 60
      },
      recommendations: [
        'Offer budget-friendly product lines',
        'Implement price matching guarantees',
        'Provide payment installment options'
      ]
    }
  ] : [];

  // Price Optimization data
  const priceOptimizationData = analysisData ? [
    {
      id: 'price-1',
      product: 'POY 150D/48F',
      category: 'Yarn',
      currentPrice: 45,
      suggestedPrice: 48,
      priceChange: 3,
      priceChangePercent: 6.7,
      expectedRevenue: 125000,
      revenueIncrease: 8500,
      demandElasticity: -0.8,
      competitorPrice: 50,
      marketPosition: 'premium' as const,
      confidence: 88,
      risk: 'low' as const,
      factors: {
        demand: 85,
        competition: 70,
        seasonality: 60,
        inventory: 75,
        profitMargin: 90
      },
      recommendations: [
        'Gradual price increase over 3 months',
        'Enhance product packaging to justify premium pricing',
        'Offer bulk discounts to maintain customer loyalty'
      ]
    },
    {
      id: 'price-2',
      product: 'FDY 75D/36F',
      category: 'Yarn',
      currentPrice: 25,
      suggestedPrice: 22,
      priceChange: -3,
      priceChangePercent: -12.0,
      expectedRevenue: 98000,
      revenueIncrease: 12000,
      demandElasticity: -1.2,
      competitorPrice: 24,
      marketPosition: 'standard' as const,
      confidence: 82,
      risk: 'medium' as const,
      factors: {
        demand: 90,
        competition: 85,
        seasonality: 40,
        inventory: 60,
        profitMargin: 70
      },
      recommendations: [
        'Implement competitive pricing strategy',
        'Focus on volume sales to offset price reduction',
        'Improve operational efficiency to maintain margins'
      ]
    },
    {
      id: 'price-3',
      product: 'DTY 150D/48F',
      category: 'Yarn',
      currentPrice: 35,
      suggestedPrice: 38,
      priceChange: 3,
      priceChangePercent: 8.6,
      expectedRevenue: 75000,
      revenueIncrease: 6000,
      demandElasticity: -0.6,
      competitorPrice: 40,
      marketPosition: 'premium' as const,
      confidence: 85,
      risk: 'low' as const,
      factors: {
        demand: 80,
        competition: 65,
        seasonality: 70,
        inventory: 85,
        profitMargin: 85
      },
      recommendations: [
        'Position as premium quality product',
        'Offer organic certification to justify higher price',
        'Implement targeted marketing campaigns'
      ]
    },
    {
      id: 'price-4',
      product: 'PSF 1.4D x 38mm',
      category: 'Fiber',
      currentPrice: 30,
      suggestedPrice: 28,
      priceChange: -2,
      priceChangePercent: -6.7,
      expectedRevenue: 65000,
      revenueIncrease: 8000,
      demandElasticity: -1.0,
      competitorPrice: 29,
      marketPosition: 'budget' as const,
      confidence: 78,
      risk: 'medium' as const,
      factors: {
        demand: 95,
        competition: 90,
        seasonality: 30,
        inventory: 70,
        profitMargin: 60
      },
      recommendations: [
        'Focus on cost leadership strategy',
        'Optimize supply chain to reduce costs',
        'Target price-sensitive customer segments'
      ]
    }
  ] : [];

  // Alert System data
  const alertData = analysisData ? [
    {
      id: 'alert-1',
      type: 'stock' as const,
      severity: 'critical' as const,
      title: 'Critical Stock Level',
      message: 'Product "POY 150D/48F" has reached critical stock level',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      acknowledged: false,
      resolved: false,
      threshold: {
        metric: 'Stock Level',
        current: 500,
        limit: 1000,
        unit: 'kg'
      },
      actions: ['Order More', 'Check Production'],
      assignee: 'Inventory Manager',
      category: 'Stock Management'
    },
    {
      id: 'alert-2',
      type: 'production' as const,
      severity: 'high' as const,
      title: 'Production Delay',
      message: 'FDY 75D/36F production line is running behind schedule',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      acknowledged: true,
      resolved: false,
      threshold: {
        metric: 'Production Time',
        current: 120,
        limit: 90,
        unit: 'minutes'
      },
      actions: ['Investigate', 'Adjust Schedule'],
      assignee: 'Production Manager',
      category: 'Production'
    },
    {
      id: 'alert-3',
      type: 'quality' as const,
      severity: 'medium' as const,
      title: 'Quality Check Required',
      message: 'DTY 150D/48F batch #1234 requires quality inspection',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      acknowledged: false,
      resolved: false,
      threshold: {
        metric: 'Quality Score',
        current: 95,
        limit: 98,
        unit: '%'
      },
      actions: ['Inspect', 'Review Process'],
      assignee: 'Quality Control',
      category: 'Quality Assurance'
    },
    {
      id: 'alert-4',
      type: 'stock' as const,
      severity: 'medium' as const,
      title: 'Low Stock Warning',
      message: 'PSF 1.4D x 38mm stock levels are below recommended threshold',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      acknowledged: false,
      resolved: false,
      threshold: {
        metric: 'Stock Level',
        current: 800,
        limit: 1200,
        unit: 'kg'
      },
      actions: ['Monitor', 'Plan Reorder'],
      assignee: 'Inventory Manager',
      category: 'Stock Management'
    }
  ] : [];

  // Comparison View data
  const comparisonData = analysisData ? [
    {
      period: 'Jan 2024',
      current: 45000,
      previous: 42000,
      change: 3000,
      changePercentage: 7.1,
      trend: 'up' as const
    },
    {
      period: 'Feb 2024',
      current: 48000,
      previous: 45000,
      change: 3000,
      changePercentage: 6.7,
      trend: 'up' as const
    },
    {
      period: 'Mar 2024',
      current: 52000,
      previous: 48000,
      change: 4000,
      changePercentage: 8.3,
      trend: 'up' as const
    },
    {
      period: 'Apr 2024',
      current: 49000,
      previous: 52000,
      change: -3000,
      changePercentage: -5.8,
      trend: 'down' as const
    },
    {
      period: 'May 2024',
      current: 51000,
      previous: 49000,
      change: 2000,
      changePercentage: 4.1,
      trend: 'up' as const
    },
    {
      period: 'Jun 2024',
      current: 54000,
      previous: 51000,
      change: 3000,
      changePercentage: 5.9,
      trend: 'up' as const
    }
  ] : [];

  // Predictive Analytics data
  const forecastData = analysisData ? [
    { period: 'Jan', actual: 45000, forecast: 44000, lowerBound: 42000, upperBound: 46000, confidence: 85 },
    { period: 'Feb', actual: 48000, forecast: 47000, lowerBound: 45000, upperBound: 49000, confidence: 88 },
    { period: 'Mar', actual: 52000, forecast: 51000, lowerBound: 49000, upperBound: 53000, confidence: 92 },
    { period: 'Apr', actual: 49000, forecast: 50000, lowerBound: 48000, upperBound: 52000, confidence: 87 },
    { period: 'May', actual: 51000, forecast: 52000, lowerBound: 50000, upperBound: 54000, confidence: 90 },
    { period: 'Jun', actual: 54000, forecast: 53000, lowerBound: 51000, upperBound: 55000, confidence: 89 },
    { period: 'Jul', actual: 0, forecast: 55000, lowerBound: 53000, upperBound: 57000, confidence: 85 },
    { period: 'Aug', actual: 0, forecast: 57000, lowerBound: 55000, upperBound: 59000, confidence: 82 },
    { period: 'Sep', actual: 0, forecast: 59000, lowerBound: 57000, upperBound: 61000, confidence: 80 }
  ] : [];

  const stockOutRisks = analysisData ? [
    {
      product: 'POY 150D/48F',
      currentStock: 500,
      dailyDemand: 100,
      daysUntilStockOut: 5,
      riskLevel: 'critical' as const,
      recommendedAction: 'Immediate reorder required',
      confidence: 95
    },
    {
      product: 'FDY 75D/36F',
      currentStock: 1200,
      dailyDemand: 80,
      daysUntilStockOut: 15,
      riskLevel: 'high' as const,
      recommendedAction: 'Schedule production increase',
      confidence: 88
    },
    {
      product: 'DTY 150D/48F',
      currentStock: 2500,
      dailyDemand: 60,
      daysUntilStockOut: 42,
      riskLevel: 'medium' as const,
      recommendedAction: 'Monitor closely',
      confidence: 75
    },
    {
      product: 'PSF 1.4D x 38mm',
      currentStock: 4000,
      dailyDemand: 40,
      daysUntilStockOut: 100,
      riskLevel: 'low' as const,
      recommendedAction: 'Normal operations',
      confidence: 90
    }
  ] : [];

  const seasonalTrends = analysisData ? [
    { month: 'Jan', demand: 45000, seasonality: 0.9, trend: 'increasing' as const, peakSeason: false },
    { month: 'Feb', demand: 48000, seasonality: 0.95, trend: 'increasing' as const, peakSeason: false },
    { month: 'Mar', demand: 52000, seasonality: 1.0, trend: 'increasing' as const, peakSeason: false },
    { month: 'Apr', demand: 49000, seasonality: 0.95, trend: 'stable' as const, peakSeason: false },
    { month: 'May', demand: 51000, seasonality: 1.0, trend: 'increasing' as const, peakSeason: false },
    { month: 'Jun', demand: 54000, seasonality: 1.05, trend: 'increasing' as const, peakSeason: true },
    { month: 'Jul', demand: 56000, seasonality: 1.1, trend: 'increasing' as const, peakSeason: true },
    { month: 'Aug', demand: 58000, seasonality: 1.15, trend: 'increasing' as const, peakSeason: true },
    { month: 'Sep', demand: 55000, seasonality: 1.05, trend: 'stable' as const, peakSeason: false },
    { month: 'Oct', demand: 52000, seasonality: 1.0, trend: 'decreasing' as const, peakSeason: false },
    { month: 'Nov', demand: 48000, seasonality: 0.9, trend: 'decreasing' as const, peakSeason: false },
    { month: 'Dec', demand: 45000, seasonality: 0.85, trend: 'decreasing' as const, peakSeason: false }
  ] : [];

  const customerBehaviors = analysisData ? [
    {
      segment: 'Premium Customers',
      customers: 2500,
      avgOrderValue: 2500,
      frequency: 3.5,
      churnRisk: 5,
      lifetimeValue: 87500,
      growthRate: 15
    },
    {
      segment: 'Regular Customers',
      customers: 8500,
      avgOrderValue: 1200,
      frequency: 2.0,
      churnRisk: 12,
      lifetimeValue: 24000,
      growthRate: 8
    },
    {
      segment: 'Occasional Buyers',
      customers: 15000,
      avgOrderValue: 600,
      frequency: 0.8,
      churnRisk: 25,
      lifetimeValue: 4800,
      growthRate: 3
    },
    {
      segment: 'New Customers',
      customers: 3000,
      avgOrderValue: 800,
      frequency: 1.2,
      churnRisk: 35,
      lifetimeValue: 9600,
      growthRate: 20
    }
  ] : [];

  // Pagination calculations for Sales Recommendations
  const salesRecommendations = analysisData?.salesRecommendations?.recommendations || [];
  const salesTotalPages = Math.ceil(salesRecommendations.length / salesItemsPerPage);
  const salesStartIndex = (salesCurrentPage - 1) * salesItemsPerPage;
  const salesEndIndex = salesStartIndex + salesItemsPerPage;
  const currentSalesItems = salesRecommendations.slice(salesStartIndex, salesEndIndex);

  // Handle page changes for Sales Recommendations
  const handleSalesPageChange = (page: number) => {
    setSalesCurrentPage(page);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchServerAnalytics();
      setAnalysisData(data);
    } catch (error) {
      console.error('Error loading comprehensive analysis:', error);
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

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav
        items={[
          { id: 'dashboard', label: 'Dashboard', icon: '📊' },
          { id: 'analysis', label: 'Data Analysis', icon: '📈' },
          { id: 'comprehensive', label: 'Comprehensive Analysis', icon: '🔍' }
        ]}
        onNavigate={(item) => {
          console.log('Navigating to:', item.label);
          // Here you would implement actual navigation
        }}
        compact={false}
      />

      {/* Header with Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Data Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
            Real-time analytics and insights from live ERP data
            </p>
          </div>
          
          {/* Quick Actions */}
          <QuickActions
            actions={[
              commonActions.export(() => {
                console.log('Exporting data...');
                // Implement export functionality
              }),
              commonActions.print(() => {
                console.log('Printing report...');
                window.print();
              }),
              commonActions.share(() => {
                console.log('Sharing report...');
                // Implement share functionality
              }),
              commonActions.refresh(() => {
                console.log('Refreshing data...');
                loadData();
              })
            ]}
            compact={false}
            showLabels={true}
          />
        </div>
        
                 {/* Interactive KPI Dashboard */}
         {analysisData && (
           <div className="mb-6">
             <KPIDashboard 
               data={kpiData} 
               title="Key Performance Indicators" 
               showCharts={true}
               compact={false}
             />
           </div>
         )}

         {/* Advanced Filters */}
         <div className="mb-6">
           <AdvancedFilters
             filters={filterConfig}
             onFiltersChange={(filters) => {
               console.log('Filters changed:', filters);
               // Here you would implement the actual filtering logic
             }}
             showSearch={true}
             showClearAll={true}
             compact={false}
           />
         </div>
      </div>

      {/* Analysis Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                 <Tabs 
           tabs={[
             {
               id: 'orders',
               label: 'Orders Analysis',
               content: <RealOrdersAnalysis />
             },
             {
               id: 'stock',
               label: 'Stock Insights',
               content: <RealStockAnalysis />
             },
             {
               id: 'production',
               label: 'Production Needs',
               content: (
                 <div className="space-y-6">
                   <div className="bg-white rounded-lg shadow p-6">
                     <h2 className="text-2xl font-bold mb-4">Production Needs Analysis - Data</h2>
                     <p className="text-gray-600 mb-4">
                       Analysis of production requirements based on real order data and current inventory levels
                     </p>
                     
                     {analysisData && (
                       <>
                                                   {/* Enhanced Summary Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <SummaryCard
                              title="Total Production Needed"
                              value={`${analysisData.productionNeeds.totalProductionNeeded.toLocaleString()} kg`}
                              icon="🏭"
                              color="blue"
                              trend={{
                                direction: 'up',
                                percentage: 12.5,
                                period: 'vs last month'
                              }}
                              status={{
                                type: 'warning',
                                label: 'High Demand'
                              }}
                              actions={[
                                {
                                  label: 'View Details',
                                  icon: '👁️',
                                  action: () => console.log('View production details'),
                                  variant: 'primary'
                                }
                              ]}
                              clickable={true}
                              onClick={() => console.log('Clicked on production needed card')}
                            />
                            
                            <SummaryCard
                              title="High Priority Items"
                              value={analysisData.productionNeeds.highPriorityItems.toString()}
                              icon="🔴"
                              color="red"
                              progress={{
                                current: analysisData.productionNeeds.highPriorityItems,
                                target: analysisData.productionNeeds.productionGaps.length,
                                unit: 'items'
                              }}
                              status={{
                                type: 'error',
                                label: 'Critical'
                              }}
                              actions={[
                                {
                                  label: 'Prioritize',
                                  icon: '⚡',
                                  action: () => console.log('Prioritize items'),
                                  variant: 'danger'
                                }
                              ]}
                            />
                            
                            <SummaryCard
                              title="Medium Priority Items"
                              value={analysisData.productionNeeds.mediumPriorityItems.toString()}
                              icon="🟡"
                              color="yellow"
                              progress={{
                                current: analysisData.productionNeeds.mediumPriorityItems,
                                target: analysisData.productionNeeds.productionGaps.length,
                                unit: 'items'
                              }}
                              status={{
                                type: 'warning',
                                label: 'Monitor'
                              }}
                              actions={[
                                {
                                  label: 'Review',
                                  icon: '📋',
                                  action: () => console.log('Review medium priority items'),
                                  variant: 'secondary'
                                }
                              ]}
                            />
                            
                            <SummaryCard
                              title="Low Priority Items"
                              value={analysisData.productionNeeds.lowPriorityItems.toString()}
                              icon="🟢"
                              color="green"
                              progress={{
                                current: analysisData.productionNeeds.lowPriorityItems,
                                target: analysisData.productionNeeds.productionGaps.length,
                                unit: 'items'
                              }}
                              status={{
                                type: 'success',
                                label: 'On Track'
                              }}
                              actions={[
                                {
                                  label: 'Schedule',
                                  icon: '📅',
                                  action: () => console.log('Schedule low priority items'),
                                  variant: 'success'
                                }
                              ]}
                            />
                          </div>

                                                  {/* Enhanced Charts */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Enhanced Production Needs Chart */}
                            <EnhancedChart
                              type="composed"
                              data={productionData}
                              title="Production Needs by Product"
                              height={300}
                              dataKeys={['Production Needed', 'Demand', 'Current Stock']}
                              drillDownData={drillDownData}
                              onDrillDown={(product) => console.log(`Drilled down to ${product}`)}
                              showLegend={true}
                              showZoom={true}
                              formatTooltip={(value, name) => [`${value} kg`, name]}
                              formatAxis={(value) => `${value} kg`}
                            />

                            {/* Enhanced Priority Distribution */}
                            <EnhancedChart
                              type="pie"
                              data={priorityData}
                              title="Priority Distribution"
                              height={300}
                              dataKeys={['value']}
                              showLegend={true}
                              formatTooltip={(value, name) => [value.toString(), name]}
                            />
                          </div>

                          {/* New Chart Types */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Enhanced Gap Analysis */}
                            <EnhancedChart
                              type="bar"
                              data={gapAnalysisData}
                              title="Demand-Supply Gap Analysis"
                              height={300}
                              dataKeys={['Gap Percentage']}
                              showLegend={true}
                              showZoom={true}
                              formatTooltip={(value, name) => [`${value}%`, name]}
                              formatAxis={(value) => `${value}%`}
                            />

                            {/* Scatter Plot for Demand vs Supply */}
                            <ScatterPlotChart
                              data={scatterData}
                              title="Demand vs Supply Correlation"
                              height={300}
                              xAxisLabel="Demand (kg)"
                              yAxisLabel="Supply (kg)"
                              showTrendLine={true}
                              showCategories={true}
                              formatValue={(value) => `${value.toLocaleString()} kg`}
                            />
                          </div>

                          {/* Heatmap for Inventory Distribution */}
                          <div className="mb-8">
                            <HeatmapChart
                              data={heatmapData}
                              title="Inventory Distribution Across Locations"
                              height={400}
                              formatValue={(value) => value.toLocaleString()}
                            />
                          </div>

                          {/* Action Buttons for Production Management */}
                          <div className="mb-8">
                             <ActionButtons
                               actions={[
                                 CommonActions.create(() => console.log('Create new production plan'), 'New Plan'),
                                 CommonActions.export(() => console.log('Export production data'), 'Export Data'),
                                 CommonActions.print(() => console.log('Print production report'), 'Print Report'),
                                 CommonActions.approve(() => console.log('Approve production schedule'), 'Approve Schedule'),
                                 CommonActions.pause(() => console.log('Pause production'), 'Pause Production')
                               ]}
                               title="Production Management Actions"
                               layout="horizontal"
                               compact={false}
                             />
                           </div>

                           {/* Production Gaps Table */}
                           <div className="overflow-x-auto">
                             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                     Urgency
                                   </th>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                     Actions
                                   </th>
                                 </tr>
                               </thead>
                               <tbody className="bg-white divide-y divide-gray-200">
                                 {analysisData.productionNeeds.productionGaps.map((gap: any, index: number) => (
                                   <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                       {gap.product}
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                       {gap.demand.toLocaleString()}
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                       {gap.currentStock.toLocaleString()}
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                       <span className={`font-medium ${
                                         gap.productionNeeded > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                                       }`}>
                                         {gap.productionNeeded.toLocaleString()}
                                       </span>
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                       <StatusBadge
                                         status={gap.gapPercentage > 50 ? 'error' : gap.gapPercentage > 20 ? 'warning' : 'success'}
                                         label={`${gap.gapPercentage.toFixed(1)}%`}
                                         size="sm"
                                         showIcon={false}
                                       />
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                               <StatusBadge
                                          status={gap.priority === 'high' ? 'error' : gap.priority === 'medium' ? 'warning' : 'success'}
                                          label={gap.priority ? gap.priority.charAt(0).toUpperCase() + gap.priority.slice(1) : 'Unknown'}
                                          size="sm"
                                          showIcon={false}
                                        />
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                               <StatusBadge
                                          status={gap.urgency === 'high' ? 'error' : gap.urgency === 'medium' ? 'warning' : 'info'}
                                          label={gap.urgency ? gap.urgency.charAt(0).toUpperCase() + gap.urgency.slice(1) : 'Unknown'}
                                          size="sm"
                                          showIcon={false}
                                        />
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                       <div className="flex space-x-1">
                                         <button
                                           onClick={() => console.log(`View details for ${gap.product}`)}
                                           className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                           title="View Details"
                                         >
                                           👁️
                                         </button>
                                         <button
                                           onClick={() => console.log(`Edit ${gap.product}`)}
                                           className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                           title="Edit"
                                         >
                                           ✏️
                                         </button>
                                         <button
                                           onClick={() => console.log(`Schedule production for ${gap.product}`)}
                                           className="p-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                                           title="Schedule Production"
                                         >
                                           📅
                                         </button>
                                       </div>
                                     </td>
                                   </tr>
                                 ))}
                               </tbody>
                            </table>
                          </div>
                       </>
                     )}
                   </div>
                 </div>
               )
             },
             {
               id: 'sales',
               label: 'Sales Recommendations',
               content: (
                 <div className="space-y-6">
                   <div className="bg-white rounded-lg shadow p-6">
                     <h2 className="text-2xl font-bold mb-4">Sales Recommendations - Data</h2>
                     <p className="text-gray-600 mb-4">
                       Analysis of excess stock and sales recommendations based on real inventory and order data
                     </p>
                     
                     {analysisData && (
                       <>
                         {/* Summary Cards */}
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                           <div className="bg-blue-50 p-4 rounded-lg">
                             <h3 className="text-sm font-medium text-blue-600">Total Excess Stock</h3>
                             <p className="text-2xl font-bold text-blue-900">{analysisData.salesRecommendations.totalExcessStock.toLocaleString()} kg</p>
                           </div>
                           <div className="bg-red-50 p-4 rounded-lg">
                             <h3 className="text-sm font-medium text-red-600">Liquidation Needed</h3>
                                                           <p className="text-2xl font-bold text-red-900">{analysisData.salesRecommendations.totalLiquidationNeeded}</p>
                           </div>
                           <div className="bg-green-50 p-4 rounded-lg">
                             <h3 className="text-sm font-medium text-green-600">Sales Opportunities</h3>
                                                           <p className="text-2xl font-bold text-green-900">{analysisData.salesRecommendations.recommendations.length}</p>
                           </div>
                           <div className="bg-purple-50 p-4 rounded-lg">
                             <h3 className="text-sm font-medium text-purple-600">Recommendations</h3>
                             <p className="text-2xl font-bold text-purple-900">{analysisData.salesRecommendations.recommendations.length}</p>
                           </div>
                         </div>

                                                  {/* Enhanced Charts */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Enhanced Sales Recommendations Chart */}
                            <EnhancedChart
                              type="composed"
                              data={salesData}
                              title="Sales Recommendations by Product"
                              height={300}
                              dataKeys={['Excess Stock', 'Current Stock']}
                              showLegend={true}
                              showZoom={true}
                              formatTooltip={(value, name) => [`${value} kg`, name]}
                              formatAxis={(value) => `${value} kg`}
                            />

                            {/* Enhanced Urgency Distribution */}
                            <EnhancedChart
                              type="pie"
                              data={urgencyData}
                              title="Urgency Distribution"
                              height={300}
                              dataKeys={['value']}
                              showLegend={true}
                              formatTooltip={(value, name) => [value.toString(), name]}
                            />
                          </div>

                          {/* Enhanced Price Recommendations */}
                          <div className="mb-6">
                            <EnhancedChart
                              type="pie"
                              data={priceRecommendationData}
                              title="Price Recommendations"
                              height={300}
                              dataKeys={['value']}
                              showLegend={true}
                              formatTooltip={(value, name) => [value.toString(), name]}
                            />
                          </div>

                          {/* Sales Recommendations Table */}
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
                                    Recommended Action
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Urgency
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price Recommendation
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {currentSalesItems.map((rec: any, index: number) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {rec.product}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {rec.currentStock.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <span className="font-medium text-red-600">
                                        {rec.excessStock.toLocaleString()}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {rec.recommendedAction}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                         rec.urgency === 'high' ? 'bg-red-100 text-red-800' :
                                         rec.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                         'bg-green-100 text-green-800'
                                       }`}>
                                         {rec.urgency ? rec.urgency.charAt(0).toUpperCase() + rec.urgency.slice(1) : 'Unknown'}
                                       </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                         rec.priceRecommendation === 'increase' ? 'bg-green-100 text-green-800' :
                                         rec.priceRecommendation === 'decrease' ? 'bg-red-100 text-red-800' :
                                         'bg-yellow-100 text-yellow-800'
                                       }`}>
                                         {rec.priceRecommendation ? rec.priceRecommendation.charAt(0).toUpperCase() + rec.priceRecommendation.slice(1) : 'Unknown'}
                                       </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                                                    {/* Pagination Controls for Sales Recommendations */}
                           {salesTotalPages > 1 && (
                             <div className="mt-6 flex items-center justify-between">
                               <div className="text-sm text-gray-700">
                                 Showing {salesStartIndex + 1} to {Math.min(salesEndIndex, salesRecommendations.length)} of {salesRecommendations.length} results
                               </div>
                               <div className="flex items-center space-x-2">
                                 <button
                                   onClick={() => handleSalesPageChange(salesCurrentPage - 1)}
                                   disabled={salesCurrentPage === 1}
                                   className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                   Previous
                                 </button>
                                 
                                 {/* Page Numbers */}
                                 <div className="flex items-center space-x-1">
                                   {Array.from({ length: salesTotalPages }, (_, i) => i + 1).map(page => (
                                     <button
                                       key={page}
                                       onClick={() => handleSalesPageChange(page)}
                                       className={`px-3 py-1 text-sm border rounded-md ${
                                         salesCurrentPage === page
                                           ? 'bg-indigo-600 text-white border-indigo-600'
                                           : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                       }`}
                                     >
                                       {page}
                                     </button>
                                   ))}
                                 </div>
                                 
                                 <button
                                   onClick={() => handleSalesPageChange(salesCurrentPage + 1)}
                                   disabled={salesCurrentPage === salesTotalPages}
                                   className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                   Next
                                 </button>
                               </div>
                             </div>
                           )}
                       </>
                     )}
                   </div>
                 </div>
               )
             },
             {
               id: 'goals',
               label: 'Goal Tracking',
               content: (
                 <div className="space-y-6">
                   <div className="bg-white rounded-lg shadow p-6">
                     <GoalTracker 
                       goals={goalData}
                       title="Business Goals & KPIs"
                       showDetails={true}
                       compact={false}
                     />
                   </div>
                 </div>
               )
             },
             {
               id: 'alerts',
               label: 'Alert System',
               content: (
                 <div className="space-y-6">
                   <div className="bg-white rounded-lg shadow p-6">
                     <AlertSystem 
                       alerts={alertData}
                       title="System Alerts & Notifications"
                       showFilters={true}
                       maxAlerts={10}
                     />
                   </div>
                 </div>
               )
             },
             {
               id: 'comparison',
               label: 'Comparison Views',
               content: (
                 <div className="space-y-6">
                   <div className="bg-white rounded-lg shadow p-6">
                     <ComparisonView 
                       data={comparisonData}
                       title="Sales Performance Comparison"
                       metric="Sales"
                       unit="kg"
                       comparisonType="month-over-month"
                       showChart={true}
                       showTable={true}
                     />
                   </div>
                 </div>
               )
             },
                           {
                id: 'predictive',
                label: 'Predictive Analytics',
                content: (
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                      <PredictiveAnalytics 
                        forecastData={forecastData}
                        stockOutRisks={stockOutRisks}
                        seasonalTrends={seasonalTrends}
                        customerBehaviors={customerBehaviors}
                        title="AI-Powered Business Intelligence"
                      />
                    </div>
                  </div>
                )
              },
              {
                id: 'anomaly-detection',
                label: 'Anomaly Detection',
                content: (
                  <div className="space-y-6">
                    <AnomalyDetection
                      data={anomalyData}
                      title="Sales & Stock Anomaly Detection"
                      type="sales"
                      showChart={true}
                      showTable={true}
                    />
                  </div>
                )
              },
              {
                id: 'recommendation-engine',
                label: 'Recommendation Engine',
                content: (
                  <div className="space-y-6">
                    <RecommendationEngine
                      recommendations={recommendationData}
                      title="Inventory Optimization Recommendations"
                      showChart={true}
                      showTable={true}
                    />
                  </div>
                )
              },
              {
                id: 'customer-segmentation',
                label: 'Customer Segmentation',
                content: (
                  <div className="space-y-6">
                    <CustomerSegmentation
                      segments={customerSegments}
                      title="Customer Segmentation Analysis"
                      showCharts={true}
                      showTable={true}
                    />
                  </div>
                )
              },
              {
                id: 'price-optimization',
                label: 'Price Optimization',
                content: (
                  <div className="space-y-6">
                    <PriceOptimization
                      optimizations={priceOptimizationData}
                      title="Price Optimization Suggestions"
                      showCharts={true}
                      showTable={true}
                    />
                  </div>
                )
              },

           ]}
          defaultTabId={activeTab}
          onChange={setActiveTab}
        />
      </div>
    </div>
  );
}

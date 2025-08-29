import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';
import path from 'path';

// Types for the API response
interface AnalyticsResponse {
  orders: OrderAnalytics;
  stock: StockAnalytics;
  productionNeeds: ProductionNeedsAnalytics;
  salesRecommendations: SalesRecommendationsAnalytics;
  timestamp: string;
}

interface OrderAnalytics {
  totalOrders: number;
  totalQuantity: number;
  totalValue: number;
  exportOrders: number;
  localOrders: number;
  ordersByProduct: { [key: string]: { quantity: number; value: number; count: number } };
  ordersByCustomer: { [key: string]: { quantity: number; value: number; count: number } };
  ordersByCountry: { [key: string]: { quantity: number; value: number; count: number } };
  recentOrders: Array<{
    orderNumber: string;
    customer: string;
    product: string;
    quantity: number;
    value: number;
    date: string;
    type: 'export' | 'local';
  }>;
}

interface StockAnalytics {
  totalBoxes: number;
  totalWeight: number;
  totalValue: number;
  stockByProduct: { [key: string]: { boxes: number; weight: number; avgWeight: number } };
  stockByLocation: { [key: string]: { boxes: number; weight: number } };
  stockByGrade: { [key: string]: { boxes: number; weight: number } };
  lowStockItems: Array<{
    product: string;
    currentStock: number;
    threshold: number;
    status: 'low' | 'normal' | 'high';
  }>;
}

interface ProductionNeedsAnalytics {
  totalProductionNeeded: number;
  highPriorityItems: number;
  mediumPriorityItems: number;
  lowPriorityItems: number;
  productionGaps: Array<{
    product: string;
    demand: number;
    currentStock: number;
    productionNeeded: number;
    gapPercentage: number;
    priority: 'high' | 'medium' | 'low';
  }>;
}

interface SalesRecommendationsAnalytics {
  totalExcessStock: number;
  totalLiquidationNeeded: number;
  recommendations: Array<{
    product: string;
    currentStock: number;
    excessStock: number;
    liquidationNeeded: number;
    recommendedAction: string;
    urgency: 'high' | 'medium' | 'low';
    priceRecommendation: 'increase' | 'maintain' | 'decrease';
  }>;
}

// Helper functions
function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  
  const match = dateStr.match(/(\d{1,2})-([A-Z]{3})-(\d{2})/);
  if (match) {
    const [, day, month, year] = match;
    const monthMap: { [key: string]: number } = {
      'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
      'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
    };
    const fullYear = parseInt(year) + 2000;
    return new Date(fullYear, monthMap[month], parseInt(day));
  }
  
  return new Date(dateStr);
}

function extractProductType(description: string): string {
  if (!description) return 'Unknown';
  
  const upperDesc = description.toUpperCase();
  if (upperDesc.includes('PSF') || upperDesc.includes('STAPLE FIBER')) return 'PSF';
  if (upperDesc.includes('DTY') || upperDesc.includes('TEXTURED YARN')) return 'DTY';
  if (upperDesc.includes('FDY') || upperDesc.includes('FULLY DRAWN')) return 'FDY';
  if (upperDesc.includes('POY') || upperDesc.includes('PARTIALLY ORIENTED')) return 'POY';
  
  return 'Other';
}

// Load Excel data from server
async function loadExcelData() {
      const demodataPath = path.join(process.cwd(), 'data');
  
  // Load Box in Hand data
  const boxInHandPath = path.join(demodataPath, 'TBL_BOXINHAND.xls');
  const boxInHandBuffer = await fs.readFile(boxInHandPath);
  const boxInHandWorkbook = XLSX.read(boxInHandBuffer, { type: 'buffer' });
  const boxInHandSheet = boxInHandWorkbook.Sheets['Export Worksheet'];
  const boxInHandData = XLSX.utils.sheet_to_json(boxInHandSheet);

  // Load Export Orders data
  const exportOrdersPath = path.join(demodataPath, 'TBL_SALESORDER_EXPORT.xls');
  const exportOrdersBuffer = await fs.readFile(exportOrdersPath);
  const exportOrdersWorkbook = XLSX.read(exportOrdersBuffer, { type: 'buffer' });
  const exportOrdersSheet = exportOrdersWorkbook.Sheets['Export Worksheet'];
  const exportOrdersData = XLSX.utils.sheet_to_json(exportOrdersSheet);

  // Load Local Orders data
  const localOrdersPath = path.join(demodataPath, 'TBL_SALESORDER_LOCAL.xls');
  const localOrdersBuffer = await fs.readFile(localOrdersPath);
  const localOrdersWorkbook = XLSX.read(localOrdersBuffer, { type: 'buffer' });
  const localOrdersSheet = localOrdersWorkbook.Sheets['Export Worksheet'];
  const localOrdersData = XLSX.utils.sheet_to_json(localOrdersSheet);

  return {
    boxInHand: boxInHandData,
    exportOrders: exportOrdersData,
    localOrders: localOrdersData
  };
}

// Analytics functions
function analyzeOrders(data: any): OrderAnalytics {
  const { exportOrders, localOrders } = data;
  
  // Combine all orders
  const allOrders = [
    ...exportOrders.map((order: any) => ({
      orderNumber: order.SOE_PINUMBER,
      customer: order.SOE_CONSIGNEE,
      product: extractProductType(order.SOE_PRODUCTDESC),
      quantity: order.SOE_QTY || 0,
      value: order.SOE_TOTALAMOUNT || 0,
      date: order.SOE_PIDATE,
      type: 'export' as const,
      country: order.SOE_COUNTRY
    })),
    ...localOrders.map((order: any) => ({
      orderNumber: order.SOL_NUMBER,
      customer: order.SOL_CUSTOMERNAME,
      product: extractProductType(order.SOL_PRODUCTDESCRIPTION),
      quantity: order.SOL_QTY || 0,
      value: order.SOL_TOTALAMOUNT || 0,
      date: order.SOL_DATE,
      type: 'local' as const,
      country: order.SOL_CUSTOMERCOUNTRY
    }))
  ];

  // Calculate summaries
  const totalOrders = allOrders.length;
  const totalQuantity = allOrders.reduce((sum, order) => sum + order.quantity, 0);
  const totalValue = allOrders.reduce((sum, order) => sum + order.value, 0);
  const exportOrdersCount = exportOrders.length;
  const localOrdersCount = localOrders.length;

  // Group by product
  const ordersByProduct = allOrders.reduce((acc, order) => {
    if (!acc[order.product]) {
      acc[order.product] = { quantity: 0, value: 0, count: 0 };
    }
    acc[order.product].quantity += order.quantity;
    acc[order.product].value += order.value;
    acc[order.product].count++;
    return acc;
  }, {} as { [key: string]: { quantity: number; value: number; count: number } });

  // Group by customer
  const ordersByCustomer = allOrders.reduce((acc, order) => {
    if (!acc[order.customer]) {
      acc[order.customer] = { quantity: 0, value: 0, count: 0 };
    }
    acc[order.customer].quantity += order.quantity;
    acc[order.customer].value += order.value;
    acc[order.customer].count++;
    return acc;
  }, {} as { [key: string]: { quantity: number; value: number; count: number } });

  // Group by country
  const ordersByCountry = allOrders.reduce((acc, order) => {
    if (!acc[order.country]) {
      acc[order.country] = { quantity: 0, value: 0, count: 0 };
    }
    acc[order.country].quantity += order.quantity;
    acc[order.country].value += order.value;
    acc[order.country].count++;
    return acc;
  }, {} as { [key: string]: { quantity: number; value: number; count: number } });

  // Recent orders (last 10)
  const recentOrders = allOrders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return {
    totalOrders,
    totalQuantity,
    totalValue,
    exportOrders: exportOrdersCount,
    localOrders: localOrdersCount,
    ordersByProduct,
    ordersByCustomer,
    ordersByCountry,
    recentOrders
  };
}

function analyzeStock(data: any): StockAnalytics {
  const { boxInHand } = data;
  
  const totalBoxes = boxInHand.length;
  const totalWeight = boxInHand.reduce((sum: number, box: any) => sum + (box.NETWT || 0), 0);
  const totalValue = totalWeight * 1000; // Estimated value per kg

  // Group by product
  const stockByProduct = boxInHand.reduce((acc: any, box: any) => {
    const productKey = `${box.PRODUCTCODE}-${box.DENIER}`;
    if (!acc[productKey]) {
      acc[productKey] = { boxes: 0, weight: 0, avgWeight: 0 };
    }
    acc[productKey].boxes++;
    acc[productKey].weight += box.NETWT || 0;
    return acc;
  }, {});

  // Calculate average weights
  Object.keys(stockByProduct).forEach(key => {
    stockByProduct[key].avgWeight = stockByProduct[key].weight / stockByProduct[key].boxes;
  });

  // Group by location
  const stockByLocation = boxInHand.reduce((acc: any, box: any) => {
    const location = box.FGWLOCATION || 'Unknown';
    if (!acc[location]) {
      acc[location] = { boxes: 0, weight: 0 };
    }
    acc[location].boxes++;
    acc[location].weight += box.NETWT || 0;
    return acc;
  }, {});

  // Group by grade
  const stockByGrade = boxInHand.reduce((acc: any, box: any) => {
    const grade = box.GRADECODE || 'Unknown';
    if (!acc[grade]) {
      acc[grade] = { boxes: 0, weight: 0 };
    }
    acc[grade].boxes++;
    acc[grade].weight += box.NETWT || 0;
    return acc;
  }, {});

  // Low stock analysis
  const lowStockItems = Object.entries(stockByProduct).map(([product, data]: [string, any]) => {
    const threshold = data.avgWeight * 10; // 10 boxes worth
    let status: 'low' | 'normal' | 'high';
    
    if (data.weight < threshold * 0.5) status = 'low';
    else if (data.weight > threshold * 2) status = 'high';
    else status = 'normal';

    return {
      product,
      currentStock: data.weight,
      threshold,
      status
    };
  });

  return {
    totalBoxes,
    totalWeight,
    totalValue,
    stockByProduct,
    stockByLocation,
    stockByGrade,
    lowStockItems
  };
}

function analyzeProductionNeeds(data: any): ProductionNeedsAnalytics {
  const { boxInHand, exportOrders, localOrders } = data;
  
  // Calculate demand from orders
  const allOrders = [...exportOrders, ...localOrders];
  const demandByProduct = allOrders.reduce((acc: any, order: any) => {
    const product = extractProductType(order.SOE_PRODUCTDESC || order.SOL_PRODUCTDESCRIPTION);
    if (!acc[product]) acc[product] = 0;
    acc[product] += order.SOE_QTY || order.SOL_QTY || 0;
    return acc;
  }, {});

  // Calculate current stock by product
  const stockByProduct = boxInHand.reduce((acc: any, box: any) => {
    const product = extractProductType(box.PRODUCTCODE);
    if (!acc[product]) acc[product] = 0;
    acc[product] += box.NETWT || 0;
    return acc;
  }, {});

  // Calculate production gaps
  const productionGaps = Object.keys(demandByProduct).map(product => {
    const demand = demandByProduct[product];
    const currentStock = stockByProduct[product] || 0;
    const productionNeeded = Math.max(0, demand - currentStock);
    const gapPercentage = demand > 0 ? (productionNeeded / demand) * 100 : 0;
    
    let priority: 'high' | 'medium' | 'low';
    if (gapPercentage > 50) priority = 'high';
    else if (gapPercentage > 20) priority = 'medium';
    else priority = 'low';

    return {
      product,
      demand,
      currentStock,
      productionNeeded,
      gapPercentage,
      priority
    };
  });

  const totalProductionNeeded = productionGaps.reduce((sum, gap) => sum + gap.productionNeeded, 0);
  const highPriorityItems = productionGaps.filter(gap => gap.priority === 'high').length;
  const mediumPriorityItems = productionGaps.filter(gap => gap.priority === 'medium').length;
  const lowPriorityItems = productionGaps.filter(gap => gap.priority === 'low').length;

  return {
    totalProductionNeeded,
    highPriorityItems,
    mediumPriorityItems,
    lowPriorityItems,
    productionGaps
  };
}

function analyzeSalesRecommendations(data: any): SalesRecommendationsAnalytics {
  const { boxInHand, exportOrders, localOrders } = data;
  
  // Calculate average monthly demand
  const allOrders = [...exportOrders, ...localOrders];
  const demandByProduct = allOrders.reduce((acc: any, order: any) => {
    const product = extractProductType(order.SOE_PRODUCTDESC || order.SOL_PRODUCTDESCRIPTION);
    if (!acc[product]) acc[product] = 0;
    acc[product] += order.SOE_QTY || order.SOL_QTY || 0;
    return acc;
  }, {});

  // Calculate current stock by product
  const stockByProduct = boxInHand.reduce((acc: any, box: any) => {
    const product = extractProductType(box.PRODUCTCODE);
    if (!acc[product]) acc[product] = 0;
    acc[product] += box.NETWT || 0;
    return acc;
  }, {});

  // Generate recommendations
  const recommendations = Object.keys(stockByProduct).map(product => {
    const currentStock = stockByProduct[product];
    const monthlyDemand = demandByProduct[product] || 0;
    const excessStock = Math.max(0, currentStock - monthlyDemand * 2); // 2 months worth
    const liquidationNeeded = excessStock > 0 ? excessStock * 0.3 : 0; // 30% of excess

    let urgency: 'high' | 'medium' | 'low';
    if (excessStock > monthlyDemand * 3) urgency = 'high';
    else if (excessStock > monthlyDemand * 1.5) urgency = 'medium';
    else urgency = 'low';

    let priceRecommendation: 'increase' | 'maintain' | 'decrease';
    if (excessStock > monthlyDemand * 2) priceRecommendation = 'decrease';
    else if (excessStock < monthlyDemand * 0.5) priceRecommendation = 'increase';
    else priceRecommendation = 'maintain';

    const recommendedAction = excessStock > 0 
      ? `Liquidate ${liquidationNeeded.toFixed(1)} kg of excess stock`
      : 'Maintain current stock levels';

    return {
      product,
      currentStock,
      excessStock,
      liquidationNeeded,
      recommendedAction,
      urgency,
      priceRecommendation
    };
  });

  const totalExcessStock = recommendations.reduce((sum, rec) => sum + rec.excessStock, 0);
  const totalLiquidationNeeded = recommendations.reduce((sum, rec) => sum + rec.liquidationNeeded, 0);

  return {
    totalExcessStock,
    totalLiquidationNeeded,
    recommendations
  };
}

// Cache for analytics results
let analyticsCache: AnalyticsResponse | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const now = Date.now();
    if (analyticsCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json(analyticsCache);
    }

    // Load and process data
    const data = await loadExcelData();
    
    // Perform analytics
    const orders = analyzeOrders(data);
    const stock = analyzeStock(data);
    const productionNeeds = analyzeProductionNeeds(data);
    const salesRecommendations = analyzeSalesRecommendations(data);

    // Create response
    const response: AnalyticsResponse = {
      orders,
      stock,
      productionNeeds,
      salesRecommendations,
      timestamp: new Date().toISOString()
    };

    // Update cache
    analyticsCache = response;
    cacheTimestamp = now;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing analytics:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics data' },
      { status: 500 }
    );
  }
}

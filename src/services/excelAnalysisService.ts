import { BoxInHand, ExportOrder, LocalOrder, ExcelData } from './excelDataLoader';

// Analysis result interfaces
export interface OrderAnalysis {
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

export interface StockAnalysis {
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
  stockAge: {
    new: number;
    medium: number;
    old: number;
  };
}

export interface ProductionNeedsAnalysis {
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
    urgency: string;
  }>;
  productionByProduct: { [key: string]: { needed: number; priority: string } };
}

export interface SalesRecommendationsAnalysis {
  totalExcessStock: number;
  liquidationNeeded: number;
  recommendations: Array<{
    product: string;
    currentStock: number;
    excessStock: number;
    recommendedAction: string;
    urgency: 'high' | 'medium' | 'low';
    priceRecommendation: 'increase' | 'maintain' | 'decrease';
  }>;
  salesOpportunities: Array<{
    product: string;
    stock: number;
    potentialCustomers: string[];
    estimatedValue: number;
  }>;
}

// Helper function to extract product type
function extractProductType(description: string): string {
  if (!description) return 'Unknown';
  
  const upperDesc = description.toUpperCase();
  if (upperDesc.includes('PSF') || upperDesc.includes('STAPLE FIBER')) return 'PSF';
  if (upperDesc.includes('DTY') || upperDesc.includes('TEXTURED YARN')) return 'DTY';
  if (upperDesc.includes('FDY') || upperDesc.includes('FULLY DRAWN')) return 'FDY';
  if (upperDesc.includes('POY') || upperDesc.includes('PARTIALLY ORIENTED')) return 'POY';
  
  return 'Other';
}

// Helper function to parse date
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

// 1. Orders Analysis
export function analyzeOrders(data: ExcelData): OrderAnalysis {
  const { exportOrders, localOrders } = data;
  
  // Combine all orders
  const allOrders = [
    ...exportOrders.map(order => ({
      orderNumber: order.SOE_PINUMBER,
      customer: order.SOE_CONSIGNEE,
      product: extractProductType(order.SOE_PRODUCTDESC),
      quantity: order.SOE_QTY || 0,
      value: order.SOE_TOTALAMOUNT || 0,
      date: order.SOE_PIDATE,
      type: 'export' as const,
      country: order.SOE_COUNTRY
    })),
    ...localOrders.map(order => ({
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
    .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())
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

// 2. Stock Analysis
export function analyzeStock(data: ExcelData): StockAnalysis {
  const { boxInHand } = data;
  
  const totalBoxes = boxInHand.length;
  const totalWeight = boxInHand.reduce((sum, box) => sum + (box.NETWT || 0), 0);
  const totalValue = totalWeight * 1000; // Estimated value per kg

  // Group by product
  const stockByProduct = boxInHand.reduce((acc, box) => {
    const productKey = `${box.PRODUCTCODE}-${box.DENIER}`;
    if (!acc[productKey]) {
      acc[productKey] = { boxes: 0, weight: 0, avgWeight: 0 };
    }
    acc[productKey].boxes++;
    acc[productKey].weight += box.NETWT || 0;
    return acc;
  }, {} as { [key: string]: { boxes: number; weight: number; avgWeight: number } });

  // Calculate average weights
  Object.keys(stockByProduct).forEach(key => {
    stockByProduct[key].avgWeight = stockByProduct[key].weight / stockByProduct[key].boxes;
  });

  // Group by location
  const stockByLocation = boxInHand.reduce((acc, box) => {
    const location = box.FGWLOCATION || 'Unknown';
    if (!acc[location]) {
      acc[location] = { boxes: 0, weight: 0 };
    }
    acc[location].boxes++;
    acc[location].weight += box.NETWT || 0;
    return acc;
  }, {} as { [key: string]: { boxes: number; weight: number } });

  // Group by grade
  const stockByGrade = boxInHand.reduce((acc, box) => {
    const grade = box.GRADECODE || 'Unknown';
    if (!acc[grade]) {
      acc[grade] = { boxes: 0, weight: 0 };
    }
    acc[grade].boxes++;
    acc[grade].weight += box.NETWT || 0;
    return acc;
  }, {} as { [key: string]: { boxes: number; weight: number } });

  // Low stock analysis
  const lowStockItems = Object.entries(stockByProduct).map(([product, data]) => {
    const threshold = 1000; // 1000 kg threshold
    const status: 'low' | 'normal' | 'high' = data.weight < threshold ? 'low' : data.weight > threshold * 2 ? 'high' : 'normal';
    return {
      product,
      currentStock: data.weight,
      threshold,
      status
    };
  });

  // Stock age analysis (simplified)
  const stockAge = {
    new: Math.floor(totalBoxes * 0.3),
    medium: Math.floor(totalBoxes * 0.5),
    old: Math.floor(totalBoxes * 0.2)
  };

  return {
    totalBoxes,
    totalWeight,
    totalValue,
    stockByProduct,
    stockByLocation,
    stockByGrade,
    lowStockItems,
    stockAge
  };
}

// 3. Production Needs Analysis
export function analyzeProductionNeeds(data: ExcelData): ProductionNeedsAnalysis {
  const { boxInHand, exportOrders, localOrders } = data;
  
  // Calculate demand from orders
  const demandByProduct = new Map<string, number>();
  
  // Export orders demand
  exportOrders.forEach(order => {
    const product = extractProductType(order.SOE_PRODUCTDESC);
    const currentDemand = demandByProduct.get(product) || 0;
    demandByProduct.set(product, currentDemand + (order.SOE_QTY || 0));
  });
  
  // Local orders demand
  localOrders.forEach(order => {
    const product = extractProductType(order.SOL_PRODUCTDESCRIPTION);
    const currentDemand = demandByProduct.get(product) || 0;
    demandByProduct.set(product, currentDemand + (order.SOL_QTY || 0));
  });

  // Calculate current stock by product
  const stockByProduct = new Map<string, number>();
  boxInHand.forEach(box => {
    const product = `${box.PRODUCTCODE}-${box.DENIER}`;
    const currentStock = stockByProduct.get(product) || 0;
    stockByProduct.set(product, currentStock + (box.NETWT || 0));
  });

  // Calculate production gaps
  const productionGaps: Array<{
    product: string;
    demand: number;
    currentStock: number;
    productionNeeded: number;
    gapPercentage: number;
    priority: 'high' | 'medium' | 'low';
    urgency: string;
  }> = [];

  demandByProduct.forEach((demand, product) => {
    const currentStock = stockByProduct.get(product) || 0;
    const productionNeeded = Math.max(0, demand - currentStock);
    const gapPercentage = demand > 0 ? ((demand - currentStock) / demand) * 100 : 0;
    
    let priority: 'high' | 'medium' | 'low';
    let urgency: string;
    
    if (gapPercentage > 50) {
      priority = 'high';
      urgency = 'Immediate production required';
    } else if (gapPercentage > 20) {
      priority = 'medium';
      urgency = 'Moderate production increase needed';
    } else {
      priority = 'low';
      urgency = 'Monitor and adjust as needed';
    }

    productionGaps.push({
      product,
      demand,
      currentStock,
      productionNeeded,
      gapPercentage,
      priority,
      urgency
    });
  });

  const totalProductionNeeded = productionGaps.reduce((sum, gap) => sum + gap.productionNeeded, 0);
  const highPriorityItems = productionGaps.filter(gap => gap.priority === 'high').length;
  const mediumPriorityItems = productionGaps.filter(gap => gap.priority === 'medium').length;
  const lowPriorityItems = productionGaps.filter(gap => gap.priority === 'low').length;

  const productionByProduct = productionGaps.reduce((acc, gap) => {
    acc[gap.product] = { needed: gap.productionNeeded, priority: gap.priority };
    return acc;
  }, {} as { [key: string]: { needed: number; priority: string } });

  return {
    totalProductionNeeded,
    highPriorityItems,
    mediumPriorityItems,
    lowPriorityItems,
    productionGaps,
    productionByProduct
  };
}

// 4. Sales Recommendations Analysis
export function analyzeSalesRecommendations(data: ExcelData): SalesRecommendationsAnalysis {
  const { boxInHand, exportOrders, localOrders } = data;
  
  // Calculate excess stock
  const stockByProduct = new Map<string, number>();
  boxInHand.forEach(box => {
    const product = `${box.PRODUCTCODE}-${box.DENIER}`;
    const currentStock = stockByProduct.get(product) || 0;
    stockByProduct.set(product, currentStock + (box.NETWT || 0));
  });

  // Calculate demand by product
  const demandByProduct = new Map<string, number>();
  
  // Process export orders
  exportOrders.forEach(order => {
    const product = extractProductType(order.SOE_PRODUCTDESC);
    const currentDemand = demandByProduct.get(product) || 0;
    demandByProduct.set(product, currentDemand + (order.SOE_QTY || 0));
  });
  
  // Process local orders
  localOrders.forEach(order => {
    const product = extractProductType(order.SOL_PRODUCTDESCRIPTION);
    const currentDemand = demandByProduct.get(product) || 0;
    demandByProduct.set(product, currentDemand + (order.SOL_QTY || 0));
  });

  const recommendations: Array<{
    product: string;
    currentStock: number;
    excessStock: number;
    recommendedAction: string;
    urgency: 'high' | 'medium' | 'low';
    priceRecommendation: 'increase' | 'maintain' | 'decrease';
  }> = [];

  const salesOpportunities: Array<{
    product: string;
    stock: number;
    potentialCustomers: string[];
    estimatedValue: number;
  }> = [];

  stockByProduct.forEach((stock, product) => {
    const demand = demandByProduct.get(product) || 0;
    const excessStock = Math.max(0, stock - demand * 1.2); // 20% buffer

    if (excessStock > 0) {
      let urgency: 'high' | 'medium' | 'low';
      let recommendedAction: string;
      let priceRecommendation: 'increase' | 'maintain' | 'decrease';

      if (excessStock > stock * 0.5) {
        urgency = 'high';
        recommendedAction = 'Immediate liquidation required';
        priceRecommendation = 'decrease';
      } else if (excessStock > stock * 0.2) {
        urgency = 'medium';
        recommendedAction = 'Promote sales with incentives';
        priceRecommendation = 'maintain';
      } else {
        urgency = 'low';
        recommendedAction = 'Monitor and adjust pricing';
        priceRecommendation = 'increase';
      }

      recommendations.push({
        product,
        currentStock: stock,
        excessStock,
        recommendedAction,
        urgency,
        priceRecommendation
      });

      // Sales opportunities
      const potentialCustomers = [...new Set([
        ...exportOrders.map(o => o.SOE_CONSIGNEE),
        ...localOrders.map(o => o.SOL_CUSTOMERNAME)
      ])].slice(0, 5);

      salesOpportunities.push({
        product,
        stock: excessStock,
        potentialCustomers,
        estimatedValue: excessStock * 1000 // Estimated value
      });
    }
  });

  const totalExcessStock = recommendations.reduce((sum, rec) => sum + rec.excessStock, 0);
  const liquidationNeeded = recommendations.filter(rec => rec.urgency === 'high').length;

  return {
    totalExcessStock,
    liquidationNeeded,
    recommendations,
    salesOpportunities
  };
}

// Main analysis function
export function performCompleteAnalysis(data: ExcelData) {
  return {
    orders: analyzeOrders(data),
    stock: analyzeStock(data),
    productionNeeds: analyzeProductionNeeds(data),
    salesRecommendations: analyzeSalesRecommendations(data)
  };
}

/**
 * Analysis service for ERP data insights
 */

export interface ProductInfo {
  id: string;
  name: string;
  type: string;
}

export interface OrderAnalysis {
  productId: string;
  productName: string;
  totalDemand: number;
  totalSales: number;
  pendingOrders: number;
  averagePrice: number;
  revenue: number;
}

export interface StockAnalysis {
  productId: string;
  productName: string;
  currentStock: number;
  openingStock: number;
  closingStock: number;
  stockTurnover: number;
  daysOfInventory: number;
  stockStatus: 'low' | 'normal' | 'high';
}

export interface ProductionNeed {
  productId: string;
  productName: string;
  demandForecast: number;
  currentStock: number;
  productionNeeded: number;
  priority: 'high' | 'medium' | 'low';
  gapPercentage: number;
}

export interface SalesRecommendation {
  productId: string;
  productName: string;
  currentStock: number;
  recommendedSales: number;
  liquidationNeeded: number;
  priceRecommendation: 'increase' | 'maintain' | 'decrease';
  urgency: 'high' | 'medium' | 'low';
}

export interface EnergyAnalysis {
  month: string;
  totalProduction: number;
  energyEfficiency: number;
  costPerTon: number;
  optimizationOpportunity: number;
}

// Product mapping based on the data
export const PRODUCTS: ProductInfo[] = [
  { id: 'P001', name: 'POY 150D/48F', type: 'Yarn' },
  { id: 'P002', name: 'FDY 75D/36F', type: 'Yarn' },
  { id: 'P003', name: 'DTY 150D/48F', type: 'Yarn' },
  { id: 'P004', name: 'PSF 1.4D x 38mm', type: 'Fiber' },
  { id: 'P005', name: 'Polyester Chips (Bottle Grade)', type: 'Chips' }
];

/**
 * Analyze orders and demand patterns
 */
export function analyzeOrders(
  marketDemand: any[],
  salesData: any[],
  currentMonth: string = '2024-03'
): OrderAnalysis[] {
  const analysis: OrderAnalysis[] = [];
  
  PRODUCTS.forEach(product => {
    const demand = marketDemand
      .filter(d => d.Product_ID === product.id && d.Month === currentMonth)
      .reduce((sum, d) => sum + parseFloat(d.Market_Demand_MT), 0);
    
    const sales = salesData
      .filter(s => s.Product_ID === product.id && s.Month === currentMonth)
      .reduce((sum, s) => sum + parseFloat(s.Sales_MT), 0);
    
    const avgPrice = salesData
      .filter(s => s.Product_ID === product.id && s.Month === currentMonth)
      .reduce((sum, s) => sum + parseFloat(s.Avg_Selling_Price_USD_per_MT), 0) / 
      Math.max(salesData.filter(s => s.Product_ID === product.id && s.Month === currentMonth).length, 1);
    
    const revenue = sales * avgPrice;
    const pendingOrders = Math.max(0, demand - sales);
    
    analysis.push({
      productId: product.id,
      productName: product.name,
      totalDemand: demand,
      totalSales: sales,
      pendingOrders,
      averagePrice: avgPrice,
      revenue
    });
  });
  
  return analysis;
}

/**
 * Analyze current stock levels and trends
 */
export function analyzeStock(
  inventoryData: any[],
  currentMonth: string = '2024-03'
): StockAnalysis[] {
  const analysis: StockAnalysis[] = [];
  
  PRODUCTS.forEach(product => {
    const currentData = inventoryData
      .filter(i => i.Product_ID === product.id && i.Month === currentMonth)[0];
    
    if (currentData) {
      const openingStock = parseFloat(currentData.Opening_Stock_MT);
      const closingStock = parseFloat(currentData.Closing_Stock_MT);
      const sales = parseFloat(currentData.Sales_MT);
      
      // Calculate stock turnover (annualized)
      const stockTurnover = sales > 0 ? (sales / ((openingStock + closingStock) / 2)) * 12 : 0;
      const daysOfInventory = stockTurnover > 0 ? 365 / stockTurnover : 999;
      
      // Determine stock status
      let stockStatus: 'low' | 'normal' | 'high';
      if (daysOfInventory < 30) stockStatus = 'low';
      else if (daysOfInventory > 90) stockStatus = 'high';
      else stockStatus = 'normal';
      
      analysis.push({
        productId: product.id,
        productName: product.name,
        currentStock: closingStock,
        openingStock,
        closingStock,
        stockTurnover,
        daysOfInventory,
        stockStatus
      });
    }
  });
  
  return analysis;
}

/**
 * Calculate production needs based on demand and current stock
 */
export function calculateProductionNeeds(
  marketDemand: any[],
  inventoryData: any[],
  currentMonth: string = '2024-03'
): ProductionNeed[] {
  const needs: ProductionNeed[] = [];
  
  PRODUCTS.forEach(product => {
    const demand = marketDemand
      .filter(d => d.Product_ID === product.id && d.Month === currentMonth)
      .reduce((sum, d) => sum + parseFloat(d.Market_Demand_MT), 0);
    
    const currentStock = inventoryData
      .filter(i => i.Product_ID === product.id && i.Month === currentMonth)
      .reduce((sum, i) => sum + parseFloat(i.Closing_Stock_MT), 0);
    
    const productionNeeded = Math.max(0, demand - currentStock);
    const gapPercentage = demand > 0 ? (productionNeeded / demand) * 100 : 0;
    
    let priority: 'high' | 'medium' | 'low';
    if (gapPercentage > 50) priority = 'high';
    else if (gapPercentage > 20) priority = 'medium';
    else priority = 'low';
    
    needs.push({
      productId: product.id,
      productName: product.name,
      demandForecast: demand,
      currentStock,
      productionNeeded,
      priority,
      gapPercentage
    });
  });
  
  return needs;
}

/**
 * Generate sales recommendations for inventory optimization
 */
export function generateSalesRecommendations(
  inventoryData: any[],
  marketDemand: any[],
  currentMonth: string = '2024-03'
): SalesRecommendation[] {
  const recommendations: SalesRecommendation[] = [];
  
  PRODUCTS.forEach(product => {
    const currentStock = inventoryData
      .filter(i => i.Product_ID === product.id && i.Month === currentMonth)
      .reduce((sum, i) => sum + parseFloat(i.Closing_Stock_MT), 0);
    
    const demand = marketDemand
      .filter(d => d.Product_ID === product.id && d.Month === currentMonth)
      .reduce((sum, d) => sum + parseFloat(d.Market_Demand_MT), 0);
    
    // Calculate recommended sales (demand + safety stock)
    const safetyStock = demand * 0.2; // 20% safety stock
    const recommendedSales = Math.min(currentStock, demand + safetyStock);
    const liquidationNeeded = Math.max(0, currentStock - (demand + safetyStock));
    
    // Determine price recommendation based on stock levels
    let priceRecommendation: 'increase' | 'maintain' | 'decrease';
    if (currentStock > demand * 1.5) priceRecommendation = 'decrease';
    else if (currentStock < demand * 0.8) priceRecommendation = 'increase';
    else priceRecommendation = 'maintain';
    
    // Determine urgency
    let urgency: 'high' | 'medium' | 'low';
    if (liquidationNeeded > demand * 0.5) urgency = 'high';
    else if (liquidationNeeded > demand * 0.2) urgency = 'medium';
    else urgency = 'low';
    
    recommendations.push({
      productId: product.id,
      productName: product.name,
      currentStock,
      recommendedSales,
      liquidationNeeded,
      priceRecommendation,
      urgency
    });
  });
  
  return recommendations;
}

/**
 * Calculate energy efficiency metrics
 */
export function analyzeEnergyEfficiency(
  productionData: any[],
  currentMonth: string = '2024-03'
): EnergyAnalysis {
  const totalProduction = productionData
    .filter(p => p.Month === currentMonth)
    .reduce((sum, p) => sum + parseFloat(p.Actual_Production_MT), 0);
  
  // Simulated energy metrics (in real scenario, this would come from energy data)
  const baseEnergyConsumption = 1000; // kWh per ton
  const actualEnergyConsumption = baseEnergyConsumption * (0.8 + Math.random() * 0.4); // ±20% variation
  const energyEfficiency = (baseEnergyConsumption / actualEnergyConsumption) * 100;
  const costPerTon = actualEnergyConsumption * 0.12; // Assuming $0.12/kWh
  const optimizationOpportunity = Math.max(0, 100 - energyEfficiency);
  
  return {
    month: currentMonth,
    totalProduction,
    energyEfficiency,
    costPerTon,
    optimizationOpportunity
  };
}

/**
 * Get summary statistics for dashboard
 */
export function getDashboardSummary(
  orderAnalysis: OrderAnalysis[],
  stockAnalysis: StockAnalysis[],
  productionNeeds: ProductionNeed[],
  salesRecommendations: SalesRecommendation[]
) {
  const totalRevenue = orderAnalysis.reduce((sum, o) => sum + o.revenue, 0);
  const totalPendingOrders = orderAnalysis.reduce((sum, o) => sum + o.pendingOrders, 0);
  const lowStockItems = stockAnalysis.filter(s => s.stockStatus === 'low').length;
  const highPriorityProduction = productionNeeds.filter(p => p.priority === 'high').length;
  const urgentSales = salesRecommendations.filter(s => s.urgency === 'high').length;
  
  return {
    totalRevenue,
    totalPendingOrders,
    lowStockItems,
    highPriorityProduction,
    urgentSales,
    overallStatus: getOverallStatus(lowStockItems, highPriorityProduction, urgentSales)
  };
}

function getOverallStatus(
  lowStock: number,
  highPriorityProduction: number,
  urgentSales: number
): 'green' | 'orange' | 'red' {
  const totalIssues = lowStock + highPriorityProduction + urgentSales;
  if (totalIssues === 0) return 'green';
  if (totalIssues <= 3) return 'orange';
  return 'red';
}

/**
 * Server-side analytics service
 * Fetches pre-calculated analytics from the server API
 */

export interface ServerAnalyticsResponse {
  orders: OrderAnalytics;
  stock: StockAnalytics;
  productionNeeds: ProductionNeedsAnalytics;
  salesRecommendations: SalesRecommendationsAnalytics;
  timestamp: string;
}

export interface OrderAnalytics {
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

export interface StockAnalytics {
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

export interface ProductionNeedsAnalytics {
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

export interface SalesRecommendationsAnalytics {
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

/**
 * Fetch analytics data from server-side API
 */
export async function fetchServerAnalytics(): Promise<ServerAnalyticsResponse> {
  try {
    const response = await fetch('/api/analytics/excel', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching server analytics:', error);
    throw error;
  }
}

/**
 * Fetch specific analytics section
 */
export async function fetchOrdersAnalytics(): Promise<OrderAnalytics> {
  const data = await fetchServerAnalytics();
  return data.orders;
}

export async function fetchStockAnalytics(): Promise<StockAnalytics> {
  const data = await fetchServerAnalytics();
  return data.stock;
}

export async function fetchProductionNeedsAnalytics(): Promise<ProductionNeedsAnalytics> {
  const data = await fetchServerAnalytics();
  return data.productionNeeds;
}

export async function fetchSalesRecommendationsAnalytics(): Promise<SalesRecommendationsAnalytics> {
  const data = await fetchServerAnalytics();
  return data.salesRecommendations;
}

/**
 * Check if analytics data is fresh (within cache duration)
 */
export function isAnalyticsFresh(timestamp: string): boolean {
  const dataTime = new Date(timestamp).getTime();
  const now = Date.now();
  const cacheDuration = 5 * 60 * 1000; // 5 minutes
  return (now - dataTime) < cacheDuration;
}

/**
 * Data loader service for CSV demo data
 */

export interface CSVData {
  [key: string]: any[];
}

/**
 * Load and parse CSV data from the demo data files
 */
export async function loadDemoData(): Promise<{
  marketDemand: any[];
  salesRealized: any[];
  inventoryFlows: any[];
  productionActual: any[];
  productPrices: any[];
  demandForecast: any[];
}> {
  try {
    // Load all CSV files
    const [marketDemand, salesRealized, inventoryFlows, productionActual, productPrices, demandForecast] = await Promise.all([
      fetch('/demodata/market_demand.csv').then(res => res.text()).then(parseCSV),
      fetch('/demodata/sales_realized.csv').then(res => res.text()).then(parseCSV),
      fetch('/demodata/fg_inventory_flows.csv').then(res => res.text()).then(parseCSV),
      fetch('/demodata/production_actual.csv').then(res => res.text()).then(parseCSV),
      fetch('/demodata/product_prices.csv').then(res => res.text()).then(parseCSV),
      fetch('/demodata/demand_forecast.csv').then(res => res.text()).then(parseCSV)
    ]);

    return {
      marketDemand,
      salesRealized,
      inventoryFlows,
      productionActual,
      productPrices,
      demandForecast
    };
  } catch (error) {
    console.error('Error loading demo data:', error);
    // Return empty arrays as fallback
    return {
      marketDemand: [],
      salesRealized: [],
      inventoryFlows: [],
      productionActual: [],
      productPrices: [],
      demandForecast: []
    };
  }
}

/**
 * Parse CSV string to array of objects
 */
function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim() || '';
    });
    return obj;
  });
}

/**
 * Get available months from the data
 */
export function getAvailableMonths(data: any[]): string[] {
  const months = [...new Set(data.map(row => row.Month))];
  return months.sort();
}

/**
 * Get current month (latest available)
 */
export function getCurrentMonth(data: any[]): string {
  const months = getAvailableMonths(data);
  return months[months.length - 1] || '2024-03';
}

/**
 * Get historical data for trend analysis
 */
export function getHistoricalData(data: any[], months: number = 12): any[] {
  const allMonths = getAvailableMonths(data);
  const recentMonths = allMonths.slice(-months);
  return data.filter(row => recentMonths.includes(row.Month));
}

/**
 * Filter data by product and date range
 */
export function filterDataByProductAndDate(
  data: any[],
  productId: string,
  startMonth?: string,
  endMonth?: string
): any[] {
  return data.filter(row => {
    const matchesProduct = row.Product_ID === productId;
    const matchesDate = !startMonth || !endMonth || 
      (row.Month >= startMonth && row.Month <= endMonth);
    return matchesProduct && matchesDate;
  });
}

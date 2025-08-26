/**
 * Data service for handling ERP module data
 */

export type ModuleType = 'inventory' | 'production' | 'energy' | 'forecast' | 'decision' | 'reports' | 'all';

/**
 * Saves data for a specific module
 * @param moduleType - Type of module
 * @param data - Data to save
 */
export function saveModuleData(moduleType: ModuleType, data: Record<string, any[]>): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`erp-data-${moduleType}`, JSON.stringify(data));
    localStorage.setItem(`erp-data-${moduleType}-updated`, new Date().toISOString());
  }
}

/**
 * Gets data for a specific module
 * @param moduleType - Type of module
 * @returns Module data or null if not found
 */
export function getModuleData(moduleType: ModuleType): Record<string, any[]> | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const data = localStorage.getItem(`erp-data-${moduleType}`);
  return data ? JSON.parse(data) : null;
}

/**
 * Gets the last updated timestamp for a module
 * @param moduleType - Type of module
 * @returns ISO timestamp string or null
 */
export function getLastUpdated(moduleType: ModuleType): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem(`erp-data-${moduleType}-updated`);
}

/**
 * Formats the last updated timestamp for display
 * @param timestamp - ISO timestamp string
 * @returns Formatted date string or 'Never' if not available
 */
export function formatLastUpdated(timestamp: string | null): string {
  if (!timestamp) {
    return 'Never';
  }
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleString();
  } catch (e) {
    return 'Unknown';
  }
}

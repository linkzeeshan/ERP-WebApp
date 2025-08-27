"use client";

import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface HeatmapData {
  location: string;
  product: string;
  value: number;
  weight?: number;
  boxes?: number;
}

interface HeatmapRow {
  location: string;
  [key: string]: number | string;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  title: string;
  height?: number;
  colorScale?: string[];
  showTooltip?: boolean;
  formatValue?: (value: number) => string;
}

export default function HeatmapChart({
  data,
  title,
  height = 400,
  colorScale = ['#f7fafc', '#e2e8f0', '#cbd5e0', '#a0aec0', '#718096', '#4a5568', '#2d3748'],
  showTooltip = true,
  formatValue = (value: number) => value.toLocaleString()
}: HeatmapChartProps) {
  // Get unique locations and products
  const locations = [...new Set(data.map(item => item.location))];
  const products = [...new Set(data.map(item => item.product))];

  // Create a matrix for the heatmap
  const matrix = locations.map(location => {
    const row: HeatmapRow = { location };
    products.forEach(product => {
      const item = data.find(d => d.location === location && d.product === product);
      row[product] = item ? item.value : 0;
    });
    return row;
  });

  // Calculate min and max values for color scaling
  const values = data.map(item => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  const getColor = (value: number) => {
    if (range === 0) return colorScale[0];
    const normalizedValue = (value - minValue) / range;
    const index = Math.floor(normalizedValue * (colorScale.length - 1));
    return colorScale[Math.min(index, colorScale.length - 1)];
  };

  const getTooltipContent = (location: string, product: string, value: number) => {
    const item = data.find(d => d.location === location && d.product === product);
    if (!item) return null;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{location}</p>
        <p className="text-sm text-gray-600">{product}</p>
        <p className="text-sm font-medium">Value: {formatValue(value)}</p>
        {item.weight && <p className="text-sm">Weight: {item.weight.toLocaleString()} kg</p>}
        {item.boxes && <p className="text-sm">Boxes: {item.boxes.toLocaleString()}</p>}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
      
      <div className="w-full" style={{ height: `${height}px` }}>
        {/* Scrollable container for the heatmap grid - both horizontal and vertical */}
        <div className="overflow-auto max-h-80">
          {/* Fixed width container to ensure proper column sizing */}
          <div className="min-w-max">
            {/* Header row with product names - sticky top */}
            <div className="flex mb-2 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="w-32 flex-shrink-0"></div> {/* Empty space for location names */}
              {products.map(product => (
                <div 
                  key={product} 
                  className="w-24 flex-shrink-0 text-xs font-medium text-gray-600 dark:text-gray-400 text-center px-1 truncate"
                  title={product}
                >
                  {product.length > 8 ? product.substring(0, 8) + '...' : product}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="space-y-1">
              {matrix.map((row, rowIndex) => (
                <div key={row.location} className="flex">
                  {/* Location name - sticky left column */}
                  <div className="w-32 flex-shrink-0 text-xs font-medium text-gray-600 dark:text-gray-400 pr-2 truncate bg-white dark:bg-gray-800 sticky left-0 z-10" title={row.location}>
                    {row.location.length > 12 ? row.location.substring(0, 12) + '...' : row.location}
                  </div>
                  
                  {/* Heatmap cells */}
                  {products.map(product => {
                    const value = row[product] as number;
                    const color = getColor(value);
                    
                    return (
                      <div
                        key={`${row.location}-${product}`}
                        className="w-24 h-8 border border-gray-200 dark:border-gray-600 relative group flex-shrink-0"
                        style={{ backgroundColor: color }}
                        title={`${row.location} - ${product}: ${formatValue(value)}`}
                      >
                        {showTooltip && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {getTooltipContent(row.location, product, value)}
                          </div>
                        )}
                        
                        {/* Value label */}
                        <div className="w-full h-full flex items-center justify-center text-xs font-medium">
                          {value > 0 ? (
                            <span className={value > maxValue * 0.7 ? 'text-white' : 'text-gray-800'}>
                              {formatValue(value)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center space-x-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
          <div className="flex space-x-1">
            {colorScale.map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 border border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
        </div>

        {/* Summary stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="text-center">
            <div className="font-medium">Total Locations</div>
            <div>{locations.length}</div>
          </div>
          <div className="text-center">
            <div className="font-medium">Total Products</div>
            <div>{products.length}</div>
          </div>
          <div className="text-center">
            <div className="font-medium">Total Value</div>
            <div>{formatValue(values.reduce((sum, val) => sum + val, 0))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

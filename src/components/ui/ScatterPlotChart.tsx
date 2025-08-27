"use client";

import React, { useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ZAxis, Cell
} from 'recharts';

interface ScatterData {
  name: string;
  demand: number;
  supply: number;
  stock?: number;
  priority?: string;
  category?: string;
  [key: string]: any;
}

interface ScatterPlotChartProps {
  data: ScatterData[];
  title: string;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showTrendLine?: boolean;
  showCategories?: boolean;
  formatValue?: (value: number) => string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
const PRIORITY_COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981'
};

export default function ScatterPlotChart({
  data,
  title,
  height = 400,
  xAxisLabel = 'Demand',
  yAxisLabel = 'Supply',
  showTrendLine = true,
  showCategories = false,
  formatValue = (value: number) => value.toLocaleString()
}: ScatterPlotChartProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Calculate trend line
  const calculateTrendLine = () => {
    const n = data.length;
    if (n < 2) return null;

    const sumX = data.reduce((sum, item) => sum + item.demand, 0);
    const sumY = data.reduce((sum, item) => sum + item.supply, 0);
    const sumXY = data.reduce((sum, item) => sum + item.demand * item.supply, 0);
    const sumXX = data.reduce((sum, item) => sum + item.demand * item.demand, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const minX = Math.min(...data.map(item => item.demand));
    const maxX = Math.max(...data.map(item => item.demand));

    return [
      { demand: minX, supply: slope * minX + intercept },
      { demand: maxX, supply: slope * maxX + intercept }
    ];
  };

  const trendLineData = showTrendLine ? calculateTrendLine() : null;

  // Filter data by category
  const filteredData = selectedCategory === 'all' 
    ? data 
    : data.filter(item => item.category === selectedCategory);

  // Get unique categories
  const categories = [...new Set(data.map(item => item.category).filter(Boolean))];

  // Calculate correlation coefficient
  const calculateCorrelation = () => {
    const n = filteredData.length;
    if (n < 2) return 0;

    const meanDemand = filteredData.reduce((sum, item) => sum + item.demand, 0) / n;
    const meanSupply = filteredData.reduce((sum, item) => sum + item.supply, 0) / n;

    const numerator = filteredData.reduce((sum, item) => 
      sum + (item.demand - meanDemand) * (item.supply - meanSupply), 0
    );

    const demandVariance = filteredData.reduce((sum, item) => 
      sum + Math.pow(item.demand - meanDemand, 2), 0
    );
    const supplyVariance = filteredData.reduce((sum, item) => 
      sum + Math.pow(item.supply - meanSupply, 2), 0
    );

    const denominator = Math.sqrt(demandVariance * supplyVariance);
    return denominator === 0 ? 0 : numerator / denominator;
  };

  const correlation = calculateCorrelation();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {xAxisLabel}: {formatValue(data.demand)}
          </p>
          <p className="text-sm text-gray-600">
            {yAxisLabel}: {formatValue(data.supply)}
          </p>
          {data.stock && (
            <p className="text-sm text-gray-600">
              Stock: {formatValue(data.stock)}
            </p>
          )}
          {data.priority && (
            <p className="text-sm text-gray-600">
              Priority: <span className="capitalize">{data.priority}</span>
            </p>
          )}
          {data.category && (
            <p className="text-sm text-gray-600">
              Category: {data.category}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getPointColor = (item: ScatterData) => {
    if (item.priority && PRIORITY_COLORS[item.priority as keyof typeof PRIORITY_COLORS]) {
      return PRIORITY_COLORS[item.priority as keyof typeof PRIORITY_COLORS];
    }
    if (item.category && showCategories) {
      const categoryIndex = categories.indexOf(item.category);
      return COLORS[categoryIndex % COLORS.length];
    }
    return COLORS[0];
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center space-x-4">
          {showCategories && categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          )}
          <div className="text-sm text-gray-600">
            Correlation: {correlation.toFixed(3)}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="demand" 
            name={xAxisLabel}
            tickFormatter={formatValue}
            label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            type="number" 
            dataKey="supply" 
            name={yAxisLabel}
            tickFormatter={formatValue}
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
          />
          <ZAxis type="number" range={[60, 400]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Main scatter plot */}
          <Scatter name="Data Points" data={filteredData} fill="#8884d8">
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getPointColor(entry)} />
            ))}
          </Scatter>

          {/* Trend line */}
          {trendLineData && (
            <Scatter 
              name="Trend Line" 
              data={trendLineData} 
              fill="none" 
              stroke="#FF6B6B" 
              strokeWidth={2}
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>

      {/* Correlation interpretation */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Correlation Analysis</h4>
        <p className="text-xs text-gray-600">
          {Math.abs(correlation) < 0.1 && "Very weak correlation"}
          {Math.abs(correlation) >= 0.1 && Math.abs(correlation) < 0.3 && "Weak correlation"}
          {Math.abs(correlation) >= 0.3 && Math.abs(correlation) < 0.5 && "Moderate correlation"}
          {Math.abs(correlation) >= 0.5 && Math.abs(correlation) < 0.7 && "Strong correlation"}
          {Math.abs(correlation) >= 0.7 && Math.abs(correlation) < 0.9 && "Very strong correlation"}
          {Math.abs(correlation) >= 0.9 && "Nearly perfect correlation"}
          {correlation > 0 ? " (positive)" : " (negative)"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {correlation > 0.7 ? "High correlation suggests strong relationship between demand and supply" :
           correlation > 0.3 ? "Moderate correlation indicates some relationship" :
           "Low correlation suggests weak relationship between demand and supply"}
        </p>
      </div>

      {/* Summary stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-gray-600">
        <div className="text-center">
          <div className="font-medium">Total Points</div>
          <div>{filteredData.length}</div>
        </div>
        <div className="text-center">
          <div className="font-medium">Avg Demand</div>
          <div>{formatValue(filteredData.reduce((sum, item) => sum + item.demand, 0) / filteredData.length)}</div>
        </div>
        <div className="text-center">
          <div className="font-medium">Avg Supply</div>
          <div>{formatValue(filteredData.reduce((sum, item) => sum + item.supply, 0) / filteredData.length)}</div>
        </div>
      </div>
    </div>
  );
}

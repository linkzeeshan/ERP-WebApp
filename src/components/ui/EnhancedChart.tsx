"use client";

import React, { useState, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ComposedChart, Area, Brush, AreaChart
} from 'recharts';
import { useToast } from '../../app/contexts/ToastContext';

interface ChartData {
  name: string;
  [key: string]: any;
}

interface EnhancedChartProps {
  type: 'bar' | 'line' | 'pie' | 'composed' | 'area';
  data: ChartData[];
  title: string;
  height?: number;
  drillDownData?: { [key: string]: ChartData[] };
  onDrillDown?: (item: string) => void;
  showLegend?: boolean;
  showZoom?: boolean;
  colors?: string[];
  xAxisDataKey?: string;
  yAxisDataKey?: string;
  dataKeys?: string[];
  formatTooltip?: (value: any, name: string) => [string, string];
  formatAxis?: (value: any) => string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function EnhancedChart({
  type,
  data,
  title,
  height = 300,
  drillDownData,
  onDrillDown,
  showLegend = true,
  showZoom = false,
  colors = COLORS,
  xAxisDataKey = 'name',
  yAxisDataKey,
  dataKeys = [],
  formatTooltip,
  formatAxis
}: EnhancedChartProps) {
  const [legendVisibility, setLegendVisibility] = useState<{ [key: string]: boolean }>({});
  const [drillDownLevel, setDrillDownLevel] = useState<string | null>(null);
  const { showToast } = useToast();

  // Initialize legend visibility
  React.useEffect(() => {
    const initialVisibility: { [key: string]: boolean } = {};
    dataKeys.forEach(key => {
      initialVisibility[key] = true;
    });
    setLegendVisibility(initialVisibility);
  }, [dataKeys]);

  const handleLegendClick = useCallback((entry: any) => {
    setLegendVisibility(prev => ({
      ...prev,
      [entry.dataKey]: !prev[entry.dataKey]
    }));
  }, []);

  const handleBarClick = useCallback((data: any, event: any) => {
    if (drillDownData && onDrillDown) {
      const itemName = data[xAxisDataKey];
      if (drillDownData[itemName]) {
        setDrillDownLevel(itemName);
        onDrillDown(itemName);
        showToast(`Drilled down to ${itemName}`, 'info');
      }
    }
  }, [drillDownData, onDrillDown, xAxisDataKey, showToast]);

  const handleBackClick = useCallback(() => {
    setDrillDownLevel(null);
    showToast('Returned to main view', 'info');
  }, [showToast]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => {
            if (!legendVisibility[entry.dataKey]) return null;
            
            const [formattedValue, formattedName] = formatTooltip 
              ? formatTooltip(entry.value, entry.dataKey)
              : [entry.value, entry.dataKey];
            
            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {formattedName}: {formattedValue}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      onClick: handleBarClick,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={xAxisDataKey} 
              angle={-45} 
              textAnchor="end" 
              height={80}
              tickFormatter={formatAxis}
            />
            <YAxis tickFormatter={formatAxis} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend 
                onClick={handleLegendClick}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            )}
            {dataKeys.map((key, index) => (
              legendVisibility[key] && (
                <Bar 
                  key={key}
                  dataKey={key} 
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              )
            ))}
            {showZoom && <Brush dataKey={xAxisDataKey} height={30} stroke="#8884d8" />}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={xAxisDataKey} 
              angle={-45} 
              textAnchor="end" 
              height={80}
              tickFormatter={formatAxis}
            />
            <YAxis tickFormatter={formatAxis} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend 
                onClick={handleLegendClick}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            )}
            {dataKeys.map((key, index) => (
              legendVisibility[key] && (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )
            ))}
            {showZoom && <Brush dataKey={xAxisDataKey} height={30} stroke="#8884d8" />}
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKeys[0] || 'value'}
              onClick={handleBarClick}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  opacity={legendVisibility[entry.name] !== false ? 1 : 0.3}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend 
                onClick={handleLegendClick}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            )}
          </PieChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={xAxisDataKey} 
              angle={-45} 
              textAnchor="end" 
              height={80}
              tickFormatter={formatAxis}
            />
            <YAxis tickFormatter={formatAxis} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend 
                onClick={handleLegendClick}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            )}
            {dataKeys.map((key, index) => {
              if (!legendVisibility[key]) return null;
              
              // Determine chart type based on key name or position
              const isArea = key.toLowerCase().includes('stock') || key.toLowerCase().includes('demand');
              const isBar = key.toLowerCase().includes('needed') || key.toLowerCase().includes('excess');
              
              if (isArea) {
                return (
                  <Area 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    fill={colors[index % colors.length]} 
                    stroke={colors[index % colors.length]} 
                    fillOpacity={0.3}
                  />
                );
              } else if (isBar) {
                return (
                  <Bar 
                    key={key}
                    dataKey={key} 
                    fill={colors[index % colors.length]}
                    radius={[4, 4, 0, 0]}
                  />
                );
              } else {
                return (
                  <Line 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                );
              }
            })}
            {showZoom && <Brush dataKey={xAxisDataKey} height={30} stroke="#8884d8" />}
          </ComposedChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={xAxisDataKey} 
              angle={-45} 
              textAnchor="end" 
              height={80}
              tickFormatter={formatAxis}
            />
            <YAxis tickFormatter={formatAxis} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend 
                onClick={handleLegendClick}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            )}
            {dataKeys.map((key, index) => (
              legendVisibility[key] && (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  fill={colors[index % colors.length]} 
                  stroke={colors[index % colors.length]} 
                  fillOpacity={0.6}
                />
              )
            ))}
            {showZoom && <Brush dataKey={xAxisDataKey} height={30} stroke="#8884d8" />}
          </AreaChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {drillDownLevel ? `${title} - ${drillDownLevel}` : title}
        </h3>
        <div className="flex items-center space-x-2">
          {drillDownLevel && (
            <button
              onClick={handleBackClick}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              ← Back
            </button>
          )}
          {showLegend && (
            <button
              onClick={() => {
                const allVisible = Object.values(legendVisibility).every(v => v);
                const newVisibility: { [key: string]: boolean } = {};
                dataKeys.forEach(key => {
                  newVisibility[key] = !allVisible;
                });
                setLegendVisibility(newVisibility);
              }}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              {Object.values(legendVisibility).every(v => v) ? 'Hide All' : 'Show All'}
            </button>
          )}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
      
      {drillDownData && !drillDownLevel && (
        <p className="text-xs text-gray-500 mt-2">
          💡 Click on any bar to drill down for more details
        </p>
      )}
    </div>
  );
}

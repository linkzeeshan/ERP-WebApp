"use client";

import React from 'react';

// Energy Meter Component
export const EnergyMeter = ({ 
  title, 
  value, 
  maxValue, 
  unit, 
  color = "blue", 
  size = "medium",
  showTrend = false,
  trendValue = 0,
  additionalInfo = null
}: {
  title: string;
  value: number;
  maxValue: number;
  unit: string;
  color?: string;
  size?: "small" | "medium" | "large";
  showTrend?: boolean;
  trendValue?: number;
  additionalInfo?: {
    subtitle?: string;
    details?: Array<{ label: string; value: string; color?: string }>;
    status?: { type: 'good' | 'warning' | 'critical'; message: string };
  } | null;
}) => {
  const percentage = (value / maxValue) * 100;
  const sizeClasses = {
    small: "w-32 h-32",
    medium: "w-40 h-40", 
    large: "w-48 h-48"
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "red": return "text-red-500";
      case "green": return "text-green-500";
      case "yellow": return "text-yellow-500";
      case "blue": return "text-blue-500";
      default: return "text-blue-500";
    }
  };

  const getStrokeColor = (color: string) => {
    switch (color) {
      case "red": return "#ef4444";
      case "green": return "#22c55e";
      case "yellow": return "#eab308";
      case "blue": return "#3b82f6";
      default: return "#3b82f6";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center group perspective-1000">
      <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">{title}</h3>
          <div className={`relative ${sizeClasses[size]}`}>
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={getStrokeColor(color)}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-2xl font-bold ${getColorClass(color)}`}>
                {value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">{unit}</div>
              {showTrend && (
                <div className={`text-xs ${trendValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trendValue >= 0 ? '↗' : '↘'} {Math.abs(trendValue)}%
                </div>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {percentage.toFixed(1)}% of capacity
          </div>
          
          {/* Additional Information Section - Compact */}
          {additionalInfo && (
            <div className="mt-2 pt-2 border-t border-gray-100 w-full">
              {additionalInfo.subtitle && (
                <p className="text-xs font-medium text-gray-600 mb-1 text-center">{additionalInfo.subtitle}</p>
              )}
              
              {additionalInfo.details && (
                <div className="space-y-0.5">
                  {additionalInfo.details.map((detail, index) => (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 truncate">{detail.label}</span>
                      <span className={`font-medium ${detail.color || 'text-gray-700'} ml-1`}>
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {additionalInfo.status && (
                <div className={`mt-1 px-1 py-0.5 rounded text-xs font-medium ${getStatusColor(additionalInfo.status.type)} text-center`}>
                  {additionalInfo.status.message}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="h-full flex flex-col justify-center items-center p-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">{title} - Details</h3>
            
            {/* Enhanced Back Information */}
            <div className="space-y-2 text-center">
              <div className="text-xs text-gray-600">
                <div className="font-medium">Current Status</div>
                <div className={`text-sm font-bold ${getColorClass(color)}`}>
                  {percentage > 80 ? 'High Load' : percentage > 50 ? 'Normal Load' : 'Low Load'}
                </div>
              </div>
              
              <div className="text-xs text-gray-600">
                <div className="font-medium">Efficiency</div>
                <div className="text-sm font-bold text-green-600">
                  {percentage > 90 ? 'Excellent' : percentage > 75 ? 'Good' : percentage > 50 ? 'Fair' : 'Poor'}
                </div>
              </div>
              
              <div className="text-xs text-gray-600">
                <div className="font-medium">Recommendation</div>
                <div className="text-xs text-blue-600">
                  {percentage > 90 ? 'Monitor closely' : percentage > 75 ? 'Optimal range' : 'Consider optimization'}
                </div>
              </div>
              
              {additionalInfo?.status && (
                <div className={`mt-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(additionalInfo.status.type)}`}>
                  {additionalInfo.status.message}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Digital Meter Component
export const DigitalMeter = ({ 
  title, 
  value, 
  unit, 
  trend, 
  color = "blue",
  precision = 0,
  additionalInfo = null
}: {
  title: string;
  value: number;
  unit: string;
  trend: number;
  color?: string;
  precision?: number;
  additionalInfo?: {
    subtitle?: string;
    details?: Array<{ label: string; value: string; color?: string }>;
    status?: { type: 'good' | 'warning' | 'critical'; message: string };
  } | null;
}) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case "red": return "text-red-500";
      case "green": return "text-green-500";
      case "yellow": return "text-yellow-500";
      case "blue": return "text-blue-500";
      default: return "text-blue-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className={`text-3xl font-mono font-bold ${getColorClass(color)}`}>
        {value.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </div>
      <div className="text-sm text-gray-500">{unit}</div>
      <div className={`text-xs mt-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend >= 0 ? '↗' : '↘'} {Math.abs(trend).toFixed(1)}% from last hour
      </div>
      
      {/* Additional Information Section */}
      {additionalInfo && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          {additionalInfo.subtitle && (
            <p className="text-xs font-medium text-gray-600 mb-2">{additionalInfo.subtitle}</p>
          )}
          
          {additionalInfo.details && (
            <div className="space-y-1">
              {additionalInfo.details.map((detail, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{detail.label}</span>
                  <span className={`text-xs font-medium ${detail.color || 'text-gray-700'}`}>
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {additionalInfo.status && (
            <div className={`mt-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(additionalInfo.status.type)}`}>
              {additionalInfo.status.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Equipment Status Component
export const EquipmentStatus = ({ 
  name, 
  status, 
  efficiency, 
  power, 
  temperature 
}: {
  name: string;
  status: 'online' | 'offline' | 'maintenance' | 'warning';
  efficiency: number;
  power: number;
  temperature: number;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'maintenance': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'maintenance': return 'Maintenance';
      case 'warning': return 'Warning';
      default: return 'Unknown';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTemperatureColor = (temperature: number) => {
    if (temperature > 80) return 'text-red-600';
    if (temperature > 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getEfficiencyStatus = (efficiency: number) => {
    if (efficiency >= 90) return 'Excellent';
    if (efficiency >= 80) return 'Good';
    if (efficiency >= 70) return 'Fair';
    if (efficiency >= 60) return 'Poor';
    return 'Critical';
  };

  const getTemperatureStatus = (temperature: number) => {
    if (temperature > 85) return 'Critical';
    if (temperature > 70) return 'High';
    if (temperature > 50) return 'Normal';
    return 'Low';
  };

  const getMaintenanceStatus = (status: string, efficiency: number) => {
    if (status === 'maintenance') return 'Scheduled';
    if (efficiency < 70) return 'Recommended';
    if (efficiency < 80) return 'Monitor';
    return 'Not Required';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 group perspective-1000 h-32">
      <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-x-180">
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">{name}</h3>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(status)} mr-2`}></div>
              <span className="text-xs text-gray-600">{getStatusText(status)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-xs text-gray-500">Efficiency</div>
              <div className={`text-lg font-semibold ${getEfficiencyColor(efficiency)}`}>
                {efficiency}%
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Power</div>
              <div className="text-lg font-semibold text-blue-600">{power} kW</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Temp</div>
              <div className={`text-lg font-semibold ${getTemperatureColor(temperature)}`}>
                {temperature}°C
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden rotate-x-180">
          <div className="h-full flex flex-col justify-center p-1">
            <h3 className="text-sm font-medium text-gray-900 mb-2 text-center">{name} - Details</h3>
            
            <div className="space-y-1 text-xs">
              
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Temperature Status:</span>
                <span className={`font-medium ${getTemperatureColor(temperature)}`}>
                  {getTemperatureStatus(temperature)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Maintenance:</span>
                <span className="font-medium text-blue-600">
                  {getMaintenanceStatus(status, efficiency)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-medium text-green-600">
                  {status === 'online' ? '99.2%' : status === 'maintenance' ? '95.8%' : '0%'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Service:</span>
                <span className="font-medium text-gray-700">
                  {status === 'maintenance' ? 'Today' : '2 weeks ago'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Next Service:</span>
                <span className="font-medium text-orange-600">
                  {efficiency < 75 ? 'ASAP' : '3 weeks'}
                </span>
              </div>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
};

// Energy Dashboard Component
export const EnergyDashboard = ({ 
  meters, 
  equipment, 
  timeRange = 'hour',
  onTimeRangeChange 
}: {
  meters: Array<{
    type: 'gauge' | 'digital';
    title: string;
    value: number;
    maxValue?: number;
    unit: string;
    color?: string;
    size?: "small" | "medium" | "large";
    showTrend?: boolean;
    trendValue?: number;
    precision?: number;
    additionalInfo?: {
      subtitle?: string;
      details?: Array<{ label: string; value: string; color?: string }>;
      status?: { type: 'good' | 'warning' | 'critical'; message: string };
    } | null;
  }>;
  equipment: Array<{
    name: string;
    status: 'online' | 'offline' | 'maintenance' | 'warning';
    efficiency: number;
    power: number;
    temperature: number;
  }>;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}) => {
  return (
    <div className="space-y-6">
      {/* Meters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {meters.map((meter, index) => (
          meter.type === 'gauge' ? (
            <EnergyMeter
              key={index}
              title={meter.title}
              value={meter.value}
              maxValue={meter.maxValue || 100}
              unit={meter.unit}
              color={meter.color}
              size={meter.size}
              showTrend={meter.showTrend}
              trendValue={meter.trendValue}
              additionalInfo={meter.additionalInfo}
            />
          ) : (
            <DigitalMeter
              key={index}
              title={meter.title}
              value={meter.value}
              unit={meter.unit}
              trend={meter.trendValue || 0}
              color={meter.color}
              precision={meter.precision}
              additionalInfo={meter.additionalInfo}
            />
          )
        ))}
      </div>

      {/* Equipment Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Equipment Status & Efficiency</h2>
          {onTimeRangeChange && (
            <select 
              value={timeRange} 
              onChange={(e) => onTimeRangeChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <option value="hour">Last Hour</option>
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((item, index) => (
            <EquipmentStatus
              key={index}
              name={item.name}
              status={item.status}
              efficiency={item.efficiency}
              power={item.power}
              temperature={item.temperature}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

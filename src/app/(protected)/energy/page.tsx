"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import { EnergyMeter, DigitalMeter, EquipmentStatus } from '../../../components/ui/EnergyMeters';
import QuickActions, { commonActions } from '../../../components/ui/QuickActions';

export default function EnergyMonitoringPage() {
  const [timeRange, setTimeRange] = useState('hour');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [isLiveData, setIsLiveData] = useState(false);

  // Mock real-time data with different time ranges
  const [currentData, setCurrentData] = useState({
    totalPower: 1245.67,
    peakPower: 1560.0,
    averagePower: 1180.0,
    powerFactor: 0.92,
    carbonFootprint: 456.78,
    costPerHour: 89.45
  });

  // Mock equipment data
  const equipmentData: Array<{
    name: string;
    status: 'online' | 'offline' | 'maintenance' | 'warning';
    efficiency: number;
    power: number;
    temperature: number;
  }> = [
    { name: 'Compressor A', status: 'online', efficiency: 78, power: 245, temperature: 65 },
    { name: 'Boiler System', status: 'online', efficiency: 92, power: 180, temperature: 85 },
    { name: 'Production Line A', status: 'online', efficiency: 85, power: 320, temperature: 45 },
    { name: 'Production Line B', status: 'warning', efficiency: 72, power: 310, temperature: 52 },
    { name: 'Chiller System', status: 'maintenance', efficiency: 65, power: 190, temperature: 75 },
    { name: 'HVAC System', status: 'online', efficiency: 88, power: 150, temperature: 35 }
  ];

  // Mock chart data for different time ranges
  const getConsumptionData = (range: string) => {
    switch (range) {
      case 'hour':
        return [
          { time: '00:00', power: 980, cost: 45.2 },
          { time: '10:00', power: 850, cost: 39.1 },
          { time: '20:00', power: 1450, cost: 66.8 },
          { time: '30:00', power: 1560, cost: 71.8 },
          { time: '40:00', power: 1380, cost: 63.5 },
          { time: '50:00', power: 1100, cost: 50.6 },
          { time: '60:00', power: 920, cost: 42.3 }
        ];
      case 'day':
        return [
          { time: '00:00', power: 850, cost: 39.1 },
          { time: '04:00', power: 720, cost: 33.1 },
          { time: '08:00', power: 1450, cost: 66.8 },
          { time: '12:00', power: 1560, cost: 71.8 },
          { time: '16:00', power: 1380, cost: 63.5 },
          { time: '20:00', power: 1100, cost: 50.6 },
          { time: '24:00', power: 920, cost: 42.3 }
        ];
      case 'week':
        return [
          { time: 'Mon', power: 1250, cost: 57.5 },
          { time: 'Tue', power: 1320, cost: 60.7 },
          { time: 'Wed', power: 1180, cost: 54.3 },
          { time: 'Thu', power: 1450, cost: 66.8 },
          { time: 'Fri', power: 1380, cost: 63.5 },
          { time: 'Sat', power: 980, cost: 45.2 },
          { time: 'Sun', power: 850, cost: 39.1 }
        ];
      case 'month':
        return [
          { time: 'Week 1', power: 1250, cost: 57.5 },
          { time: 'Week 2', power: 1320, cost: 60.7 },
          { time: 'Week 3', power: 1180, cost: 54.3 },
          { time: 'Week 4', power: 1450, cost: 66.8 }
        ];
      default:
        return [
          { time: '00:00', power: 980, cost: 45.2 },
          { time: '04:00', power: 850, cost: 39.1 },
          { time: '08:00', power: 1450, cost: 66.8 },
          { time: '12:00', power: 1560, cost: 71.8 },
          { time: '16:00', power: 1380, cost: 63.5 },
          { time: '20:00', power: 1100, cost: 50.6 },
          { time: '24:00', power: 920, cost: 42.3 }
        ];
    }
  };

  // Get data based on time range
  const consumptionData = getConsumptionData(timeRange);

  const distributionData = [
    { name: 'Production Lines', value: 45, color: '#3b82f6' },
    { name: 'HVAC Systems', value: 25, color: '#10b981' },
    { name: 'Compressors', value: 20, color: '#f59e0b' },
    { name: 'Lighting', value: 10, color: '#8b5cf6' }
  ];

  // Update data based on time range
  useEffect(() => {
    const getDataForRange = (range: string) => {
      const baseData = {
        totalPower: 1245.67,
        peakPower: 1560.0,
        averagePower: 1180.0,
        powerFactor: 0.92,
        carbonFootprint: 456.78,
        costPerHour: 89.45
      };

      switch (range) {
        case 'hour':
          return {
            ...baseData,
            totalPower: 1245.67,
            peakPower: 1560.0,
            costPerHour: 89.45
          };
        case 'day':
          return {
            ...baseData,
            totalPower: 1180.0,
            peakPower: 1450.0,
            costPerHour: 85.20
          };
        case 'week':
          return {
            ...baseData,
            totalPower: 1120.0,
            peakPower: 1380.0,
            costPerHour: 82.15
          };
        case 'month':
          return {
            ...baseData,
            totalPower: 1080.0,
            peakPower: 1320.0,
            costPerHour: 79.80
          };
        default:
          return baseData;
      }
    };

    setCurrentData(getDataForRange(timeRange));
  }, [timeRange]);

  // Update data every 5 seconds to simulate real-time (only when live data is enabled)
  useEffect(() => {
    if (!isLiveData) return;

    const interval = setInterval(() => {
      setCurrentData(prev => ({
        ...prev,
        totalPower: prev.totalPower + (Math.random() - 0.5) * 20,
        powerFactor: Math.max(0.85, Math.min(0.98, prev.powerFactor + (Math.random() - 0.5) * 0.02)),
        carbonFootprint: prev.carbonFootprint + (Math.random() - 0.5) * 5,
        costPerHour: prev.costPerHour + (Math.random() - 0.5) * 2
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveData]);

  const handleExport = () => {
    console.log('Exporting energy monitoring report...');
    // Implement export functionality
    alert('Energy monitoring report exported successfully!');
  };

  const handlePrint = () => {
    console.log('Printing energy monitoring report...');
    window.print();
  };

  const handleRefresh = () => {
    console.log('Refreshing energy monitoring data...');
    // Implement refresh functionality
    window.location.reload();
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ 
    isOn, 
    onToggle, 
    label 
  }: { 
    isOn: boolean; 
    onToggle: () => void; 
    label: string; 
  }) => (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        onClick={onToggle}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          ${isOn ? 'bg-indigo-600' : 'bg-gray-200'}
        `}
        role="switch"
        aria-checked={isOn}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${isOn ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
          </button>
      <span className={`text-xs font-medium ${isOn ? 'text-indigo-600' : 'text-gray-500'}`}>
        {isOn ? 'Live' : 'Static'}
      </span>
        </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Energy Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time energy consumption and efficiency tracking</p>
      </div>
        <div className="flex gap-4 items-center">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white"
          >
            <option value="hour">Last Hour</option>
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
          
          {/* Live Data Toggle */}
          <ToggleSwitch
            isOn={isLiveData}
            onToggle={() => setIsLiveData(!isLiveData)}
            label="Data Mode:"
          />
          
          {/* Quick Actions */}
          <QuickActions
            actions={[
              commonActions.export(handleExport),
              commonActions.print(handlePrint),
              commonActions.refresh(handleRefresh)
            ]}
            compact={false}
            showLabels={true}
          />
          </div>
        </div>

      {/* Live Data Indicator */}
      {isLiveData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Live Data Active
            </p>
            <p className="text-sm text-green-700">
              Data is updating every 5 seconds. Toggle off to view static data.
            </p>
          </div>
        </div>
      )}

      {/* Real-time Energy Meters */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <EnergyMeter 
          title="Total Power" 
          value={currentData.totalPower} 
          maxValue={2000} 
          unit="kW" 
          color="blue"
          size="medium"
          showTrend={true}
          trendValue={2.3}
          additionalInfo={{
            subtitle: "Power Details",
            details: [
              { label: "Avg", value: "1,180 kW", color: "text-blue-600" },
              { label: "Min", value: "850 kW", color: "text-green-600" },
              { label: "Max", value: "1,560 kW", color: "text-red-600" }
            ],
            status: {
              type: 'good',
              message: 'Normal operation'
            }
          }}
        />
        <EnergyMeter 
          title="Peak Power" 
          value={currentData.peakPower} 
          maxValue={2000} 
          unit="kW" 
          color="yellow"
          size="medium"
          additionalInfo={{
            subtitle: "Peak Analysis",
            details: [
              { label: "Peak Time", value: "14:30", color: "text-yellow-600" },
              { label: "Duration", value: "45 min", color: "text-blue-600" },
              { label: "Frequency", value: "2/day", color: "text-gray-600" }
            ],
            status: {
              type: 'warning',
              message: 'Peak approaching limit'
            }
          }}
        />
        <EnergyMeter 
          title="Power Factor" 
          value={currentData.powerFactor * 100} 
          maxValue={100} 
          unit="%" 
          color="green"
          size="medium"
          additionalInfo={{
            subtitle: "Efficiency Metrics",
            details: [
              { label: "Target", value: "95%", color: "text-gray-600" },
              { label: "Reactive", value: "8%", color: "text-orange-600" },
              { label: "Losses", value: "3.2%", color: "text-red-600" }
            ],
            status: {
              type: 'good',
              message: 'Excellent efficiency'
            }
          }}
        />
        <EnergyMeter 
          title="Carbon Footprint" 
          value={currentData.carbonFootprint} 
          maxValue={1000} 
          unit="kg CO2" 
          color="red"
          size="medium"
          additionalInfo={{
            subtitle: "Environmental Impact",
            details: [
              { label: "Daily", value: "10.9 MT", color: "text-red-600" },
              { label: "Monthly", value: "328 MT", color: "text-orange-600" },
              { label: "Target", value: "300 MT", color: "text-green-600" }
            ],
            status: {
              type: 'warning',
              message: 'Above monthly target'
            }
          }}
        />
        <DigitalMeter 
          title="Cost/Hour" 
          value={currentData.costPerHour} 
          unit="$" 
          trend={-1.2}
          precision={2}
          additionalInfo={{
            subtitle: "Cost Analysis",
            details: [
              { label: "Peak Rate", value: "$0.12/kWh", color: "text-red-600" },
              { label: "Off-Peak", value: "$0.08/kWh", color: "text-green-600" },
              { label: "Daily Total", value: "$2,145.60", color: "text-blue-600" },
              { label: "Monthly Proj.", value: "$64,368.00", color: "text-gray-700" },
              { label: "Budget vs Actual", value: "-$1,632", color: "text-green-600" },
              { label: "Savings Potential", value: "$2,400/mo", color: "text-blue-600" }
            ],
            status: {
              type: 'good',
              message: '15% below budget - excellent cost control'
            }
          }}
        />
        <DigitalMeter 
          title="Efficiency Score" 
          value={87.3} 
          unit="%" 
          trend={1.5}
          precision={1}
          additionalInfo={{
            subtitle: "Performance Analysis",
            details: [
              { label: "Power Factor", value: "0.92", color: "text-green-600" },
              { label: "Load Factor", value: "78.5%", color: "text-blue-600" },
              { label: "Target", value: "90.0%", color: "text-gray-600" },
              { label: "Gap", value: "2.7%", color: "text-yellow-600" },
              { label: "Improvement", value: "+1.5%", color: "text-green-600" },
              { label: "Next Milestone", value: "89.0%", color: "text-purple-600" }
            ],
            status: {
              type: 'warning',
              message: '2.7% below target - load shifting recommended'
            }
          }}
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Energy Consumption Trend */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Energy Consumption Trend - {timeRange === 'hour' ? 'Last Hour' : 
              timeRange === 'day' ? 'Last 24 Hours' : 
              timeRange === 'week' ? 'Last Week' : 'Last Month'}
            {isLiveData && <span className="ml-2 text-sm text-green-600 font-normal">(Live)</span>}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={consumptionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  name === 'power' ? `${value} kW` : `$${value}`,
                  name === 'power' ? 'Power' : 'Cost'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="power" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3} 
                name="Power"
              />
            </AreaChart>
          </ResponsiveContainer>
      </div>

        {/* Energy Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Energy Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {distributionData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
            </div>
          </div>
        </div>

      {/* Equipment Monitoring */}
        <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Equipment Status & Efficiency</h2>
          <select 
            value={selectedEquipment} 
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white"
          >
            <option value="all">All Equipment</option>
            <option value="production">Production Lines</option>
            <option value="hvac">HVAC Systems</option>
            <option value="compressors">Compressors</option>
          </select>
              </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipmentData.map((equipment, index) => (
            <EquipmentStatus
              key={index}
              name={equipment.name}
              status={equipment.status}
              efficiency={equipment.efficiency}
              power={equipment.power}
              temperature={equipment.temperature}
            />
          ))}
        </div>
      </div>

      {/* Alerts and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <div className="flex justify-between">
                <h3 className="font-medium">Production Line B Efficiency Drop</h3>
                <span className="text-yellow-600 text-sm">Warning</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Efficiency dropped to 72% (below 75% threshold). Temperature rising.
              </p>
              <div className="mt-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                  Schedule Maintenance
                </button>
              </div>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between">
                <h3 className="font-medium">Chiller System Maintenance</h3>
                <span className="text-blue-600 text-sm">Maintenance</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Scheduled maintenance in progress. System operating at reduced capacity.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Optimization Recommendations</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-medium">Peak Load Shifting</h3>
              <p className="text-sm text-gray-600 mt-1">
                Shift 15% of production load to off-peak hours to save $2,400/month.
              </p>
              <div className="mt-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                  View Schedule
                </button>
              </div>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-medium">Chiller System Upgrade</h3>
              <p className="text-sm text-gray-600 mt-1">
                Upgrade could improve efficiency by 20% and save $8,500 annually.
              </p>
              <div className="mt-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                  View Proposal
                </button>
              </div>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-medium">Smart Lighting Implementation</h3>
              <p className="text-sm text-gray-600 mt-1">
                Motion sensors and LED upgrades could reduce lighting costs by 30%.
              </p>
              <div className="mt-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Environmental Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{currentData.carbonFootprint.toFixed(1)}</div>
            <div className="text-sm text-gray-600">kg CO2/hr</div>
            <div className="text-xs text-gray-500 mt-1">Carbon Footprint</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">87.3%</div>
            <div className="text-sm text-gray-600">Efficiency</div>
            <div className="text-xs text-gray-500 mt-1">Overall System</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">$12,450</div>
            <div className="text-sm text-gray-600">Saved This Month</div>
            <div className="text-xs text-gray-500 mt-1">vs. Last Month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">15.2%</div>
            <div className="text-sm text-gray-600">Renewable Energy</div>
            <div className="text-xs text-gray-500 mt-1">Usage</div>
          </div>
        </div>
      </div>
    </div>
  );
}

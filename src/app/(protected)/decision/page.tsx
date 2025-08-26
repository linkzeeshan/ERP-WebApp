import Link from "next/link";

// Mock KPI data
const kpiData = [
  {
    id: 1,
    name: "Inventory Turnover",
    value: 4.2,
    target: 5.0,
    trend: "down",
    status: "warning", // green, warning, danger
    unit: "ratio",
    description: "Average number of times inventory is sold or used in a time period",
  },
  {
    id: 2,
    name: "Production Efficiency",
    value: 92,
    target: 90,
    trend: "up",
    status: "success",
    unit: "%",
    description: "Percentage of actual output vs theoretical maximum output",
  },
  {
    id: 3,
    name: "Energy Consumption",
    value: 245678,
    target: 250000,
    trend: "down",
    status: "success",
    unit: "kWh",
    description: "Total energy consumed across all operations",
  },
  {
    id: 4,
    name: "Forecast Accuracy",
    value: 88,
    target: 90,
    trend: "up",
    status: "warning",
    unit: "%",
    description: "How closely actual sales match forecasted sales",
  },
  {
    id: 5,
    name: "On-Time Delivery",
    value: 94,
    target: 95,
    trend: "down",
    status: "warning",
    unit: "%",
    description: "Percentage of orders delivered on schedule",
  },
  {
    id: 6,
    name: "Quality Defect Rate",
    value: 0.8,
    target: 1.0,
    trend: "down",
    status: "success",
    unit: "%",
    description: "Percentage of products with defects",
  },
  {
    id: 7,
    name: "Raw Material Stock",
    value: 18,
    target: 20,
    trend: "down",
    status: "warning",
    unit: "days",
    description: "Days of raw material available at current usage rate",
  },
  {
    id: 8,
    name: "Machine Downtime",
    value: 5.2,
    target: 3.0,
    trend: "up",
    status: "danger",
    unit: "%",
    description: "Percentage of scheduled time that equipment is unavailable",
  },
  {
    id: 9,
    name: "Order Backlog",
    value: 12,
    target: 10,
    trend: "up",
    status: "warning",
    unit: "days",
    description: "Average days of orders waiting to be fulfilled",
  },
];

// Mock scenario data
const scenarioData = [
  {
    id: 1,
    name: "Current Operations",
    description: "Baseline scenario with current parameters",
    kpis: {
      roi: 15.2,
      payback: 24,
      energy: -5,
      production: 0,
    },
    status: "active",
  },
  {
    id: 2,
    name: "Capacity Expansion",
    description: "Increase production capacity by 25%",
    kpis: {
      roi: 18.5,
      payback: 36,
      energy: 15,
      production: 25,
    },
    status: "saved",
  },
  {
    id: 3,
    name: "Energy Optimization",
    description: "Implement energy efficiency measures",
    kpis: {
      roi: 22.1,
      payback: 18,
      energy: -20,
      production: 5,
    },
    status: "saved",
  },
];

export default function DecisionDashboardPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Decision Support Dashboard</h1>
        <div className="flex gap-4">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Create Scenario
          </button>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
            Export Report
          </button>
        </div>
      </div>

      {/* Overall Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Overall Status</h2>
          <span className="text-sm text-gray-500">Last updated: August 21, 2025 - 17:30</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-6 border-l-4 border-amber-500">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-amber-800">Operational Status</h3>
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-amber-800 mt-2">CAUTION</p>
            <p className="text-sm text-amber-700 mt-1">
              3 KPIs require attention. Machine downtime exceeds threshold.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-green-800">Production Status</h3>
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-800 mt-2">OPTIMAL</p>
            <p className="text-sm text-green-700 mt-1">
              Production efficiency at 92%, exceeding target by 2%.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border-l-4 border-red-500">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-red-800">Maintenance Status</h3>
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-red-800 mt-2">CRITICAL</p>
            <p className="text-sm text-red-700 mt-1">
              Urgent maintenance required for Compressor A and Machine D.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpiData.map((kpi) => (
            <div 
              key={kpi.id} 
              className={`rounded-lg p-6 ${
                kpi.status === 'success' 
                  ? 'bg-green-50 border-l-4 border-green-500' 
                  : kpi.status === 'warning' 
                  ? 'bg-amber-50 border-l-4 border-amber-500' 
                  : 'bg-red-50 border-l-4 border-red-500'
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{kpi.name}</h3>
                <span 
                  className={`text-xs px-2 py-1 rounded-full ${
                    kpi.status === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : kpi.status === 'warning' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {kpi.status === 'success' ? 'Good' : kpi.status === 'warning' ? 'Warning' : 'Critical'}
                </span>
              </div>
              <div className="mt-2">
                <div className="flex items-end">
                  <span className="text-3xl font-bold">
                    {kpi.value.toLocaleString()}
                  </span>
                  <span className="text-sm ml-1 mb-1">{kpi.unit}</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-600 mr-2">Target: {kpi.target.toLocaleString()} {kpi.unit}</span>
                  <span 
                    className={`flex items-center text-xs ${
                      kpi.trend === 'up' 
                        ? kpi.status === 'success' ? 'text-green-600' : 'text-red-600' 
                        : kpi.status === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {kpi.trend === 'up' ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Up
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Down
                      </>
                    )}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{kpi.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Comparison */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Scenario Comparison</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scenario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROI (%)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payback (months)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Energy Impact (%)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Production Impact (%)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scenarioData.map((scenario) => (
                <tr key={scenario.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {scenario.name}
                          {scenario.status === 'active' && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{scenario.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{scenario.kpis.roi}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{scenario.kpis.payback} months</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${scenario.kpis.energy < 0 ? 'text-green-600' : 'text-amber-600'}`}>
                      {scenario.kpis.energy > 0 ? '+' : ''}{scenario.kpis.energy}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${scenario.kpis.production > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {scenario.kpis.production > 0 ? '+' : ''}{scenario.kpis.production}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {scenario.status === 'active' ? (
                      <span className="text-gray-400">Active</span>
                    ) : (
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                        Activate
                      </button>
                    )}
                    <button className="text-indigo-600 hover:text-indigo-900">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h3 className="font-medium">Schedule Urgent Maintenance</h3>
              <p className="text-sm text-gray-600 mt-1">
                Machine downtime is above threshold. Schedule maintenance for Compressor A and Machine D within 48 hours to prevent further issues.
              </p>
              <div className="mt-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                  Schedule Now
                </button>
              </div>
            </div>
            <div className="border-l-4 border-amber-500 pl-4 py-2">
              <h3 className="font-medium">Increase Raw Material Stock</h3>
              <p className="text-sm text-gray-600 mt-1">
                Raw material stock is below target. Consider increasing order quantities to maintain optimal inventory levels.
              </p>
              <div className="mt-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                  Generate Purchase Orders
                </button>
              </div>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-medium">Implement Energy Optimization Scenario</h3>
              <p className="text-sm text-gray-600 mt-1">
                The Energy Optimization scenario shows the highest ROI with a short payback period. Consider implementing this scenario.
              </p>
              <div className="mt-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                  View Implementation Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Risk Assessment</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Supply Chain Disruption</span>
                <span className="text-sm font-medium text-amber-600">Medium</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Potential delays from key suppliers due to regional logistics issues.
              </p>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Equipment Failure</span>
                <span className="text-sm font-medium text-red-600">High</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Critical equipment showing signs of potential failure. Urgent maintenance required.
              </p>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Demand Volatility</span>
                <span className="text-sm font-medium text-green-600">Low</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Demand forecast shows stable patterns with high confidence intervals.
              </p>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Energy Price Fluctuation</span>
                <span className="text-sm font-medium text-amber-600">Medium</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Energy prices expected to rise by 8-12% in the next quarter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

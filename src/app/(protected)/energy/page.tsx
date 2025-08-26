import Link from "next/link";

export default function EnergyMonitoringPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Energy Monitoring</h1>
        <div className="flex gap-4">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Download Report
          </button>
          <select className="border border-gray-300 rounded-md px-3 py-2">
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month" selected>This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Energy Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Energy Consumption</h2>
          <p className="text-3xl font-bold">245,678 kWh</p>
          <div className="flex items-center mt-2">
            <span className="text-green-600 text-sm font-medium">↓ 3.2% vs. last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Energy Performance Index</h2>
          <p className="text-3xl font-bold">92%</p>
          <div className="flex items-center mt-2">
            <span className="text-green-600 text-sm font-medium">↑ 1.5% vs. last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Active Alerts</h2>
          <p className="text-3xl font-bold">1</p>
          <div className="flex items-center mt-2">
            <span className="text-amber-600 text-sm font-medium">Compressor efficiency drift</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Cost Savings</h2>
          <p className="text-3xl font-bold">$12,450</p>
          <div className="flex items-center mt-2">
            <span className="text-green-600 text-sm font-medium">↑ 5.8% vs. last period</span>
          </div>
        </div>
      </div>

      {/* Energy Consumption Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Energy Consumption Trend</h2>
        <div className="h-80 w-full">
          {/* This would be a real chart in a production app */}
          <div className="h-full w-full bg-gray-50 flex items-center justify-center">
            <div className="w-full px-4">
              <div className="relative h-60">
                {/* Mock chart bars */}
                <div className="absolute bottom-0 left-[5%] w-[3%] h-[65%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[10%] w-[3%] h-[70%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[15%] w-[3%] h-[60%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[20%] w-[3%] h-[75%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[25%] w-[3%] h-[80%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[30%] w-[3%] h-[65%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[35%] w-[3%] h-[55%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[40%] w-[3%] h-[70%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[45%] w-[3%] h-[75%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[50%] w-[3%] h-[60%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[55%] w-[3%] h-[65%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[60%] w-[3%] h-[70%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[65%] w-[3%] h-[55%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[70%] w-[3%] h-[50%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[75%] w-[3%] h-[60%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[80%] w-[3%] h-[65%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[85%] w-[3%] h-[55%] bg-indigo-500 rounded-t"></div>
                <div className="absolute bottom-0 left-[90%] w-[3%] h-[60%] bg-indigo-500 rounded-t"></div>
                
                {/* Threshold line */}
                <div className="absolute bottom-[70%] left-0 w-full h-[1px] bg-red-500 border-dashed"></div>
                <div className="absolute bottom-[70%] left-[95%] bg-white px-1 text-xs text-red-500">Threshold</div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-[-20px] left-[5%] text-xs text-gray-500">1</div>
                <div className="absolute bottom-[-20px] left-[25%] text-xs text-gray-500">8</div>
                <div className="absolute bottom-[-20px] left-[45%] text-xs text-gray-500">15</div>
                <div className="absolute bottom-[-20px] left-[65%] text-xs text-gray-500">22</div>
                <div className="absolute bottom-[-20px] left-[85%] text-xs text-gray-500">29</div>
                
                {/* Y-axis labels */}
                <div className="absolute bottom-0 left-[-30px] text-xs text-gray-500">0 kWh</div>
                <div className="absolute bottom-[25%] left-[-30px] text-xs text-gray-500">5,000 kWh</div>
                <div className="absolute bottom-[50%] left-[-30px] text-xs text-gray-500">10,000 kWh</div>
                <div className="absolute bottom-[75%] left-[-30px] text-xs text-gray-500">15,000 kWh</div>
              </div>
              <div className="text-center mt-6 text-sm text-gray-500">Days of the Month</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Energy Distribution by Source</h2>
          <div className="h-64 w-full">
            {/* This would be a real pie chart in a production app */}
            <div className="h-full w-full bg-gray-50 flex items-center justify-center">
              <div className="relative h-48 w-48 rounded-full overflow-hidden">
                <div className="absolute inset-0 border-8 border-indigo-500" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)' }}></div>
                <div className="absolute inset-0 border-8 border-blue-400" style={{ clipPath: 'polygon(50% 50%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)' }}></div>
                <div className="absolute inset-0 border-8 border-green-400" style={{ clipPath: 'polygon(50% 50%, 0% 100%, 100% 100%)' }}></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-indigo-500 mr-2"></div>
              <span className="text-sm">Machines (45%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-400 mr-2"></div>
              <span className="text-sm">HVAC (35%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-400 mr-2"></div>
              <span className="text-sm">Lighting (20%)</span>
            </div>
          </div>
        </div>

        {/* Energy Efficiency */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Equipment Efficiency</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Compressor A</span>
                <span className="text-sm font-medium text-amber-600">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Boiler System</span>
                <span className="text-sm font-medium text-green-600">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Production Line A</span>
                <span className="text-sm font-medium text-green-600">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Production Line B</span>
                <span className="text-sm font-medium text-green-600">88%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Chiller System</span>
                <span className="text-sm font-medium text-red-600">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-amber-500 pl-4 py-2">
              <div className="flex justify-between">
                <h3 className="font-medium">Compressor Efficiency Drift</h3>
                <span className="text-amber-600 text-sm">Warning</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Compressor A efficiency has dropped by 7% in the last week. Maintenance check recommended.
              </p>
              <div className="mt-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                  Schedule Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Optimization Recommendations</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-medium">Chiller System Upgrade</h3>
              <p className="text-sm text-gray-600 mt-1">
                Upgrading the chiller system could improve efficiency by up to 20% and save approximately $8,500 annually.
              </p>
              <div className="mt-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                  View Details
                </button>
              </div>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-medium">Production Schedule Optimization</h3>
              <p className="text-sm text-gray-600 mt-1">
                Shifting high-energy operations to off-peak hours could reduce energy costs by 15%.
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
    </div>
  );
}

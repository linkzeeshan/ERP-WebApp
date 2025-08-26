"use client";

import { useState } from 'react';

// Mock historical data
const historicalData = [
  { month: 'Jan', sales: 120, forecast: 125 },
  { month: 'Feb', sales: 132, forecast: 130 },
  { month: 'Mar', sales: 145, forecast: 140 },
  { month: 'Apr', sales: 140, forecast: 150 },
  { month: 'May', sales: 155, forecast: 160 },
  { month: 'Jun', sales: 165, forecast: 170 },
  { month: 'Jul', sales: 180, forecast: 175 },
  { month: 'Aug', sales: 185, forecast: 190 },
];

// Mock forecast data
const forecastData = [
  { month: 'Sep', sales: null, forecast: 195 },
  { month: 'Oct', sales: null, forecast: 205 },
  { month: 'Nov', sales: null, forecast: 220 },
  { month: 'Dec', sales: null, forecast: 240 },
  { month: 'Jan', sales: null, forecast: 210 },
  { month: 'Feb', sales: null, forecast: 225 },
];

// Mock products
const products = [
  { id: 1, name: 'Product Alpha', category: 'Category A' },
  { id: 2, name: 'Product Beta', category: 'Category B' },
  { id: 3, name: 'Product Gamma', category: 'Category A' },
  { id: 4, name: 'Product Delta', category: 'Category C' },
];

export default function ForecastPage() {
  const [selectedProduct, setSelectedProduct] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState('baseline');
  const [uploadMessage, setUploadMessage] = useState('');
  
  // Combined data for chart
  const combinedData = [...historicalData, ...forecastData];
  
  // Handle file upload
  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would process the file
    setUploadMessage('Forecast data uploaded and processed successfully!');
    setTimeout(() => setUploadMessage(''), 3000);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Demand Forecasting</h1>
        <div className="flex gap-4">
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
            Export Forecast
          </button>
        </div>
      </div>

      {/* Product Selection and Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Product Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(Number(e.target.value))}
              >
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scenario</label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
              >
                <option value="baseline">Baseline</option>
                <option value="optimistic">Optimistic</option>
                <option value="pessimistic">Pessimistic</option>
                <option value="seasonal">Seasonal Adjustment</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Forecast</h2>
          <form onSubmit={handleFileUpload}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">CSV File</label>
              <input 
                type="file" 
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                accept=".csv"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Upload & Process
            </button>
            {uploadMessage && (
              <div className="mt-2 p-2 bg-green-100 text-green-800 rounded-md text-sm">
                {uploadMessage}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sales Forecast</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              <span className="text-sm text-gray-600">Historical Sales</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span className="text-sm text-gray-600">Forecast</span>
            </div>
          </div>
        </div>
        <div className="h-80 w-full">
          {/* This would be a real chart in a production app */}
          <div className="h-full w-full bg-gray-50 flex items-center justify-center">
            <div className="w-full px-4">
              <div className="relative h-60">
                {/* X and Y axes */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-300"></div>
                <div className="absolute bottom-0 left-0 h-full w-[1px] bg-gray-300"></div>
                
                {/* Chart lines */}
                <svg className="absolute inset-0" viewBox="0 0 1000 240" preserveAspectRatio="none">
                  {/* Historical data line */}
                  <polyline
                    points={historicalData.map((d, i) => `${(i * 1000) / (combinedData.length - 1)},${240 - (d.sales! / 250) * 240}`).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  
                  {/* Forecast data line */}
                  <polyline
                    points={combinedData.map((d, i) => {
                      if (d.forecast) {
                        return `${(i * 1000) / (combinedData.length - 1)},${240 - (d.forecast / 250) * 240}`;
                      }
                      return '';
                    }).join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  
                  {/* Divider between historical and forecast */}
                  <line
                    x1={`${(historicalData.length * 1000) / (combinedData.length - 1)}`}
                    y1="0"
                    x2={`${(historicalData.length * 1000) / (combinedData.length - 1)}`}
                    y2="240"
                    stroke="#d1d5db"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                  
                  {/* "Now" label */}
                  <text
                    x={`${(historicalData.length * 1000) / (combinedData.length - 1) + 5}`}
                    y="20"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    Now
                  </text>
                </svg>
                
                {/* X-axis labels */}
                <div className="absolute bottom-[-25px] left-0 w-full flex justify-between">
                  {combinedData.map((d, i) => (
                    <div key={i} className="text-xs text-gray-500">{d.month}</div>
                  ))}
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute bottom-0 left-[-40px] h-full flex flex-col justify-between">
                  <div className="text-xs text-gray-500">250</div>
                  <div className="text-xs text-gray-500">200</div>
                  <div className="text-xs text-gray-500">150</div>
                  <div className="text-xs text-gray-500">100</div>
                  <div className="text-xs text-gray-500">50</div>
                  <div className="text-xs text-gray-500">0</div>
                </div>
              </div>
              <div className="text-center mt-6 text-sm text-gray-500">Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Forecast Analysis</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">Trend Analysis</h3>
              <p className="text-sm text-gray-600 mt-1">
                The forecast shows a steady growth trend with a 5.2% average monthly increase. 
                Seasonal patterns indicate higher demand in Q4, with December expected to peak at 240 units.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Accuracy Metrics</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">MAPE</p>
                  <p className="font-medium">3.8%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">MAD</p>
                  <p className="font-medium">5.2 units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bias</p>
                  <p className="font-medium">+1.2%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">R²</p>
                  <p className="font-medium">0.94</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Recommendations</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                <li>Increase production capacity by 10% for Q4</li>
                <li>Secure additional raw materials for anticipated demand</li>
                <li>Consider promotional activities in lower-demand months</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">What-If Scenarios</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Adjustment</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="-20" 
                  max="20" 
                  defaultValue="0"
                  className="w-full"
                />
                <span className="ml-2 text-sm text-gray-600">0%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marketing Budget</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="-50" 
                  max="100" 
                  defaultValue="0"
                  className="w-full"
                />
                <span className="ml-2 text-sm text-gray-600">0%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Market Growth</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="-10" 
                  max="20" 
                  defaultValue="5"
                  className="w-full"
                />
                <span className="ml-2 text-sm text-gray-600">5%</span>
              </div>
            </div>
            <div className="pt-4">
              <h3 className="font-medium text-gray-700">Scenario Impact</h3>
              <div className="mt-2 p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Baseline Forecast (6 months)</span>
                  <span className="font-medium">1,295 units</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Adjusted Forecast</span>
                  <span className="font-medium text-green-600">1,360 units (+5%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue Impact</span>
                  <span className="font-medium text-green-600">+$32,500</span>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Apply Scenario
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

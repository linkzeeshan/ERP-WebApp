"use client";

import { useState } from 'react';

// Mock report templates
const reportTemplates = [
  {
    id: 1,
    name: "Inventory Status Report",
    description: "Overview of current inventory levels, turnover, and valuation",
    category: "Inventory",
    lastGenerated: "2025-08-15",
    formats: ["PDF", "Excel"],
  },
  {
    id: 2,
    name: "Production Efficiency Report",
    description: "Analysis of production efficiency, utilization, and downtime",
    category: "Production",
    lastGenerated: "2025-08-18",
    formats: ["PDF", "Excel"],
  },
  {
    id: 3,
    name: "Energy Consumption Report",
    description: "Detailed breakdown of energy usage by equipment and area",
    category: "Energy",
    lastGenerated: "2025-08-20",
    formats: ["PDF", "Excel"],
  },
  {
    id: 4,
    name: "Sales Forecast Analysis",
    description: "Comparison of forecasted vs. actual sales with variance analysis",
    category: "Forecast",
    lastGenerated: "2025-08-10",
    formats: ["PDF", "Excel"],
  },
  {
    id: 5,
    name: "KPI Dashboard Report",
    description: "Summary of all key performance indicators with trends",
    category: "Decision",
    lastGenerated: "2025-08-21",
    formats: ["PDF", "Excel"],
  },
  {
    id: 6,
    name: "Maintenance Schedule Report",
    description: "Upcoming maintenance activities and historical records",
    category: "Production",
    lastGenerated: "2025-08-17",
    formats: ["PDF", "Excel"],
  },
  {
    id: 7,
    name: "Raw Material Usage Report",
    description: "Consumption patterns and efficiency metrics for raw materials",
    category: "Inventory",
    lastGenerated: "2025-08-14",
    formats: ["PDF", "Excel"],
  },
  {
    id: 8,
    name: "Quality Control Report",
    description: "Quality metrics, defect rates, and root cause analysis",
    category: "Production",
    lastGenerated: "2025-08-19",
    formats: ["PDF", "Excel"],
  },
];

// Mock scheduled reports
const scheduledReports = [
  {
    id: 1,
    templateId: 1,
    name: "Weekly Inventory Status",
    frequency: "Weekly",
    day: "Monday",
    time: "08:00",
    format: "Excel",
    recipients: ["inventory@example.com", "management@example.com"],
    lastSent: "2025-08-19",
  },
  {
    id: 2,
    templateId: 5,
    name: "Daily KPI Summary",
    frequency: "Daily",
    day: null,
    time: "18:00",
    format: "PDF",
    recipients: ["management@example.com", "operations@example.com"],
    lastSent: "2025-08-20",
  },
  {
    id: 3,
    templateId: 3,
    name: "Monthly Energy Analysis",
    frequency: "Monthly",
    day: "1",
    time: "09:00",
    format: "Excel",
    recipients: ["energy@example.com", "management@example.com"],
    lastSent: "2025-08-01",
  },
];

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedReport, setSelectedReport] = useState<number | null>(null);
  const [exportFormat, setExportFormat] = useState("PDF");
  const [dateRange, setDateRange] = useState("last30");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  
  // Filter reports by category
  const filteredReports = selectedCategory === "All" 
    ? reportTemplates 
    : reportTemplates.filter(report => report.category === selectedCategory);
  
  // Handle report generation
  const handleGenerateReport = () => {
    if (!selectedReport) return;
    
    setShowExportModal(true);
    setExportProgress(0);
    setExportComplete(false);
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setExportComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="flex gap-4">
          <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            onClick={() => setSelectedReport(null)}
          >
            Create Custom Report
          </button>
        </div>
      </div>

      {/* Report Categories and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Inventory">Inventory</option>
              <option value="Production">Production</option>
              <option value="Energy">Energy</option>
              <option value="Forecast">Forecast</option>
              <option value="Decision">Decision</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <option value="PDF">PDF</option>
              <option value="Excel">Excel</option>
              <option value="CSV">CSV</option>
            </select>
          </div>
          <div className="ml-auto">
            <button 
              className={`px-4 py-2 rounded-md mt-6 ${
                selectedReport 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!selectedReport}
              onClick={handleGenerateReport}
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div 
              key={report.id} 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedReport === report.id 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{report.name}</h3>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                  {report.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{report.description}</p>
              <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                <span>Last generated: {report.lastGenerated}</span>
                <div className="flex gap-1">
                  {report.formats.map((format) => (
                    <span key={format} className="px-1.5 py-0.5 bg-gray-100 rounded">
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Scheduled Reports</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sent
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scheduledReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.frequency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.frequency === "Daily" 
                      ? `Every day at ${report.time}` 
                      : report.frequency === "Weekly"
                      ? `Every ${report.day} at ${report.time}`
                      : `${report.day}${Number(report.day) === 1 ? 'st' : Number(report.day) === 2 ? 'nd' : Number(report.day) === 3 ? 'rd' : 'th'} of month at ${report.time}`
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.format}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      {report.recipients.map((recipient, index) => (
                        <span key={index}>{recipient}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.lastSent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">
              {exportComplete ? "Export Complete" : "Generating Report..."}
            </h3>
            
            {!exportComplete ? (
              <>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Please wait while we generate your report...
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 mb-4">
                  Your report has been generated successfully!
                </p>
                <div className="flex justify-center">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 mr-2">
                    Download {exportFormat}
                  </button>
                </div>
              </>
            )}
            
            <div className="flex justify-end mt-4">
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowExportModal(false)}
              >
                {exportComplete ? "Close" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

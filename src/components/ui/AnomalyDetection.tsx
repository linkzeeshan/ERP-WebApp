"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ReferenceLine } from 'recharts';

interface AnomalyData {
  date: string;
  value: number;
  isAnomaly: boolean;
  confidence: number;
  type: 'sales' | 'stock' | 'demand';
  severity: 'low' | 'medium' | 'high';
  description: string;
}

interface AnomalyDetectionProps {
  data: AnomalyData[];
  title?: string;
  type?: 'sales' | 'stock' | 'demand';
  showChart?: boolean;
  showTable?: boolean;
  compact?: boolean;
}

export default function AnomalyDetection({
  data,
  title = "Anomaly Detection",
  type = 'sales',
  showChart = true,
  showTable = true,
  compact = false
}: AnomalyDetectionProps) {
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyData | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const anomalies = data.filter(item => item.isAnomaly);
  const filteredAnomalies = filterSeverity === 'all' 
    ? anomalies 
    : anomalies.filter(item => item.severity === filterSeverity);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales': return '📈';
      case 'stock': return '📦';
      case 'demand': return '🎯';
      default: return '📊';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getTypeIcon(type)}</span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as any)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{anomalies.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Anomalies</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {anomalies.filter(a => a.severity === 'high').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">High Severity</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {anomalies.filter(a => a.severity === 'medium').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Medium Severity</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {Math.round((anomalies.length / data.length) * 100)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Anomaly Rate</div>
        </div>
      </div>

      {showChart && (
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3">Anomaly Detection Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload as AnomalyData;
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow">
                        <p className="font-semibold">{label}</p>
                        <p>Value: {dataPoint.value}</p>
                        {dataPoint.isAnomaly && (
                          <>
                            <p className={`text-sm ${getSeverityColor(dataPoint.severity).split(' ')[0]}`}>
                              Anomaly: {dataPoint.severity.toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-600">Confidence: {dataPoint.confidence}%</p>
                          </>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={false}
              />
              {anomalies.map((anomaly, index) => (
                <Scatter
                  key={index}
                  data={[anomaly]}
                  fill={anomaly.severity === 'high' ? '#EF4444' : anomaly.severity === 'medium' ? '#F59E0B' : '#3B82F6'}
                  r={6}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {showTable && (
        <div>
          <h4 className="text-md font-semibold mb-3">Detected Anomalies</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAnomalies.map((anomaly, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedAnomaly(anomaly)}
                  >
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {anomaly.date}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {anomaly.value}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(anomaly.severity)}`}>
                        {anomaly.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {anomaly.confidence}%
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {anomaly.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Anomaly Detail Modal */}
      {selectedAnomaly && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Anomaly Details</h3>
              <button
                onClick={() => setSelectedAnomaly(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">{selectedAnomaly.date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Value</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">{selectedAnomaly.value}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Severity</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(selectedAnomaly.severity)}`}>
                  {selectedAnomaly.severity.toUpperCase()}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">{selectedAnomaly.confidence}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">{selectedAnomaly.description}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedAnomaly(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  console.log('Investigate anomaly:', selectedAnomaly);
                  setSelectedAnomaly(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Investigate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

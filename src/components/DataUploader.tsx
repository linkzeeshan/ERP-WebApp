"use client";

import { useState } from 'react';
import type { ModuleType } from '../services/dataService';

interface DataUploaderProps {
  onDataLoaded: (data: Record<string, any[]>) => void;
  moduleType: 'inventory' | 'production' | 'energy' | 'forecast' | 'decision' | 'reports' | 'all';
}

export default function DataUploader({ onDataLoaded, moduleType }: DataUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Use FileReader to read the file
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          // Dynamically import xlsx only when needed (client-side only)
          const xlsx = await import('xlsx');
          
          // Convert file to array buffer
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = xlsx.read(data, { type: 'array' });
          
          const result: Record<string, any[]> = {};
          
          // Process each sheet
          workbook.SheetNames.forEach((sheetName: string) => {
            const worksheet = workbook.Sheets[sheetName];
            result[sheetName] = xlsx.utils.sheet_to_json(worksheet);
          });
          
          onDataLoaded(result);
          
          // Save to localStorage for persistence
          localStorage.setItem(`erp-data-${moduleType}`, JSON.stringify(result));
          
          setSuccess(`Successfully loaded data from ${file.name}`);
        } catch (error) {
          setError('Failed to process Excel file. Please check the format.');
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read the file.');
        setIsLoading(false);
      };
      
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Failed to process Excel file. Please check the format.');
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium mb-4">Import {moduleType.charAt(0).toUpperCase() + moduleType.slice(1)} Data</h3>
      
      <div className="flex items-center space-x-4">
        <label className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700">
          <span>{isLoading ? 'Processing...' : 'Upload Excel File'}</span>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isLoading}
          />
        </label>
        
        {success && (
          <span className="text-green-600 text-sm">{success}</span>
        )}
        
        {error && (
          <span className="text-red-600 text-sm">{error}</span>
        )}
      </div>
      
      <p className="text-sm text-gray-500 mt-2">
        Upload an Excel file with your {moduleType} data. The file should contain properly formatted data.
      </p>
    </div>
  );
}

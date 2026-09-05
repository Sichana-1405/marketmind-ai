import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';
import { Customer } from '../../types/customer';
import { classifyCustomer } from '../../utils/segmentation';

interface CSVUploaderProps {
  onDataLoaded: (customers: Customer[]) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    setSuccessCount(null);

    if (!file.name.endsWith('.csv')) {
      setError('Invalid file format. Please upload a valid .csv file.');
      return;
    }

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`CSV Parsing Error: ${results.errors[0].message}`);
          return;
        }

        const rows = results.data;
        if (!rows || rows.length === 0) {
          setError('The uploaded CSV file is empty.');
          return;
        }

        // Validate required headers
        const firstRow = rows[0];
        const requiredFields = ['name', 'totalSpent', 'purchaseCount'];
        const missingFields = requiredFields.filter((field) => !(field in firstRow));

        if (missingFields.length > 0) {
          setError(`Missing required columns: ${missingFields.join(', ')}`);
          return;
        }

        try {
          const parsedCustomers: Customer[] = rows.map((row, index) => {
            const raw = {
              customerId: row.customerId || `CSV-${1000 + index}`,
              name: row.name || `Customer ${index + 1}`,
              email: row.email || `customer${index + 1}@example.com`,
              age: parseInt(row.age, 10) || 30,
              location: row.location || 'Unknown',
              totalSpent: parseFloat(row.totalSpent) || 0,
              purchaseCount: parseInt(row.purchaseCount, 10) || 1,
              lastPurchaseDate: row.lastPurchaseDate || new Date().toISOString().split('T')[0],
              websiteVisits: parseInt(row.websiteVisits, 10) || 5,
              emailOpens: parseInt(row.emailOpens, 10) || 2,
              emailClicks: parseInt(row.emailClicks, 10) || 1,
            };

            const result = classifyCustomer(raw);

            return {
              ...raw,
              segment: result.segment,
              engagementScore: result.engagementScore,
              explanation: result.explanation,
            };
          });

          setSuccessCount(parsedCustomers.length);
          onDataLoaded(parsedCustomers);
        } catch (err) {
          setError('Failed to process customer rows. Please check data formatting.');
        }
      },
      error: (err) => {
        setError(`Failed to read CSV: ${err.message}`);
      },
    });
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-brand-500 bg-brand-50'
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-900">
            Click to upload or drag & drop customer CSV
          </p>
          <p className="text-xs text-slate-600 max-w-sm">
            CSV must contain headers: <code className="text-brand-600">name</code>, <code className="text-brand-600">totalSpent</code>, <code className="text-brand-600">purchaseCount</code>
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {successCount !== null && (
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-700">
          <FileCheck className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Successfully imported and segmented {successCount} customers!</span>
        </div>
      )}
    </div>
  );
};

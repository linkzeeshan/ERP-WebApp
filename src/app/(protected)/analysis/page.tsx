"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ComprehensiveAnalysis from '../../../components/analysis/ComprehensiveAnalysis';

function AnalysisContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  return (
    <div className="p-6">
      <ComprehensiveAnalysis initialTab={tab || 'orders'} />
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading analysis...</div>}>
      <AnalysisContent />
    </Suspense>
  );
}

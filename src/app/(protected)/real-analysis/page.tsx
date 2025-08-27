"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RealComprehensiveAnalysis from '../../../components/analysis/RealComprehensiveAnalysis';

function RealAnalysisContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'orders';

  return (
    <div className="container mx-auto px-4 py-8">
      <RealComprehensiveAnalysis initialTab={tab} />
    </div>
  );
}

export default function RealAnalysisPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading real analysis...</div>}>
      <RealAnalysisContent />
    </Suspense>
  );
}

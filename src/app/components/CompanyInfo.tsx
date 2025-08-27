import React from 'react';

interface CompanyInfoProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export default function CompanyInfo({ variant = 'compact', className = '' }: CompanyInfoProps) {
  if (variant === 'compact') {
    return (
      <div className={`text-xs text-gray-500 ${className}`}>
        <div>Sunflag Thailand Ltd.</div>
        <div>Quality is our priority</div>
      </div>
    );
  }

  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      <div className="font-semibold text-gray-800">Sunflag Thailand Ltd.</div>
      <div className="text-xs text-gray-500 mt-1">Quality is our priority</div>
      <div className="text-xs text-gray-400 mt-1">
        Established in 1989 • Polyester Yarn Manufacturing
      </div>
      <div className="text-xs text-gray-400">
        Rojana Industrial Park, Ayuthaya, Thailand
      </div>
    </div>
  );
}

import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative';
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
}

export default function KPICard({
  title,
  value,
  change,
  changeType,
  subtitle,
  icon,
  iconBgColor = 'bg-orange-50'
}: KPICardProps) {
  const isPositive = changeType === 'positive';
  
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-[#2C3E50]">{value}</p>
          <div className="flex items-center gap-2 mt-3">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              isPositive ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                {isPositive ? (
                  <path
                    d="M6 9V3M6 3L3 6M6 3L9 6"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M6 3V9M6 9L3 6M6 9L9 6"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
              <span className={`text-xs font-semibold ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(change)}%
              </span>
            </div>
            {subtitle && (
              <span className="text-xs text-gray-500">{subtitle}</span>
            )}
          </div>
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

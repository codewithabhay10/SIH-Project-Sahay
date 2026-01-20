"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "PMAY-U", value: 3245, color: "#3B82F6" },
  { name: "DAY-NULM", value: 2134, color: "#EA9000" },
  { name: "AMRUT", value: 1876, color: "#10B981" },
  { name: "Smart Cities", value: 1543, color: "#8B5CF6" },
  { name: "NULM", value: 1234, color: "#EF4444" },
  { name: "Others", value: 890, color: "#6B7280" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-1">{data.name}</p>
        <div className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          ></div>
          <span className="text-gray-600">Projects:</span>
          <span className="font-semibold text-gray-900">{data.value}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {((data.value / data.payload.total) * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomLegend = () => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      {data.map((entry, index) => (
        <div key={index} className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-gray-700">{entry.name}</span>
          </div>
          <span className="font-semibold text-gray-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function DonutChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map((item) => ({ ...item, total }));

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="w-full px-4">
        <CustomLegend />
      </div>
    </div>
  );
}

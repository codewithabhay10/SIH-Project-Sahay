"use client";

import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    month: "Apr",
    released: 850,
    utilized: 680,
  },
  {
    month: "May",
    released: 920,
    utilized: 750,
  },
  {
    month: "Jun",
    released: 780,
    utilized: 620,
  },
  {
    month: "Jul",
    released: 1050,
    utilized: 840,
  },
  {
    month: "Aug",
    released: 950,
    utilized: 790,
  },
  {
    month: "Sep",
    released: 1120,
    utilized: 920,
  },
  {
    month: "Oct",
    released: 1200,
    utilized: 980,
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold text-gray-900">
              ₹{entry.value}Cr
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TimeSeriesChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <ComposedChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="month"
          stroke="#9CA3AF"
          style={{ fontSize: "12px" }}
          tickLine={false}
        />
        <YAxis
          stroke="#9CA3AF"
          style={{ fontSize: "12px" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}Cr`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
          iconType="circle"
        />
        <Bar
          dataKey="released"
          fill="#3B82F6"
          radius={[4, 4, 0, 0]}
          name="Released"
        />
        <Line
          type="monotone"
          dataKey="utilized"
          stroke="#EA9000"
          strokeWidth={2}
          dot={{ fill: "#EA9000", r: 4 }}
          activeDot={{ r: 6 }}
          name="Utilized"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

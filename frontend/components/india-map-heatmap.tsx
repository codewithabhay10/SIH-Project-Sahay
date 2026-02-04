"use client";

import React, { useState, useEffect, useRef } from "react";
import * as d3Geo from "d3-geo";

// India GeoJSON URL
const INDIA_GEO_JSON =
  "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";

// Sample data for states - matching exact names from GeoJSON
const stateData: Record<string, {
  fundsReleased: number;
  projectsCount: number;
  unspentFunds: number;
  utilizationRate: number;
}> = {
  "Maharashtra": {
    fundsReleased: 2345,
    projectsCount: 145,
    unspentFunds: 456,
    utilizationRate: 80.5,
  },
  "Karnataka": {
    fundsReleased: 1892,
    projectsCount: 132,
    unspentFunds: 382,
    utilizationRate: 79.8,
  },
  "Tamil Nadu": {
    fundsReleased: 1987,
    projectsCount: 156,
    unspentFunds: 357,
    utilizationRate: 82.0,
  },
  "Gujarat": {
    fundsReleased: 1765,
    projectsCount: 128,
    unspentFunds: 425,
    utilizationRate: 75.9,
  },
  "Uttar Pradesh": {
    fundsReleased: 2456,
    projectsCount: 198,
    unspentFunds: 526,
    utilizationRate: 78.6,
  },
  "West Bengal": {
    fundsReleased: 1678,
    projectsCount: 142,
    unspentFunds: 398,
    utilizationRate: 76.2,
  },
  "Rajasthan": {
    fundsReleased: 1456,
    projectsCount: 118,
    unspentFunds: 356,
    utilizationRate: 75.5,
  },
  "Andhra Pradesh": {
    fundsReleased: 1345,
    projectsCount: 104,
    unspentFunds: 285,
    utilizationRate: 78.8,
  },
  "Telangana": {
    fundsReleased: 1234,
    projectsCount: 96,
    unspentFunds: 254,
    utilizationRate: 79.4,
  },
  "Madhya Pradesh": {
    fundsReleased: 1567,
    projectsCount: 135,
    unspentFunds: 387,
    utilizationRate: 75.3,
  },
  "Bihar": {
    fundsReleased: 1789,
    projectsCount: 167,
    unspentFunds: 459,
    utilizationRate: 74.3,
  },
  "Odisha": {
    fundsReleased: 1123,
    projectsCount: 89,
    unspentFunds: 283,
    utilizationRate: 74.8,
  },
  "Punjab": {
    fundsReleased: 987,
    projectsCount: 76,
    unspentFunds: 227,
    utilizationRate: 76.9,
  },
  "Haryana": {
    fundsReleased: 1098,
    projectsCount: 84,
    unspentFunds: 248,
    utilizationRate: 77.4,
  },
  "Kerala": {
    fundsReleased: 1256,
    projectsCount: 102,
    unspentFunds: 266,
    utilizationRate: 78.8,
  },
  "Delhi": {
    fundsReleased: 890,
    projectsCount: 68,
    unspentFunds: 198,
    utilizationRate: 77.8,
  },
  "Jharkhand": {
    fundsReleased: 945,
    projectsCount: 72,
    unspentFunds: 215,
    utilizationRate: 77.2,
  },
  "Assam": {
    fundsReleased: 876,
    projectsCount: 65,
    unspentFunds: 203,
    utilizationRate: 76.8,
  },
  "Chhattisgarh": {
    fundsReleased: 823,
    projectsCount: 61,
    unspentFunds: 189,
    utilizationRate: 77.0,
  },
  "Uttarakhand": {
    fundsReleased: 654,
    projectsCount: 48,
    unspentFunds: 145,
    utilizationRate: 77.8,
  },
  "Himachal Pradesh": {
    fundsReleased: 543,
    projectsCount: 42,
    unspentFunds: 123,
    utilizationRate: 77.3,
  },
  "Jammu and Kashmir": {
    fundsReleased: 732,
    projectsCount: 56,
    unspentFunds: 167,
    utilizationRate: 77.2,
  },
  "Goa": {
    fundsReleased: 234,
    projectsCount: 18,
    unspentFunds: 52,
    utilizationRate: 77.8,
  },
};

// Color scale based on utilization rate
const getColorByUtilization = (rate: number) => {
  if (rate >= 80) return "#10B981"; // Green - High utilization
  if (rate >= 75) return "#FDB714"; // Yellow - Medium utilization
  if (rate >= 70) return "#F59E0B"; // Orange - Low utilization
  return "#EF4444"; // Red - Very low utilization
};

const formatCurrency = (amount: number) => {
  return `₹${amount}Cr`;
};

interface TooltipData {
  name: string;
  fundsReleased: number;
  projectsCount: number;
  unspentFunds: number;
  utilizationRate: number;
}

interface GeoFeature {
  type: string;
  properties: {
    ST_NM?: string;
    NAME_1?: string;
    name?: string;
  };
  geometry: object;
}

interface GeoJSON {
  type: string;
  features: GeoFeature[];
}

export default function IndiaMapHeatmap() {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [geoData, setGeoData] = useState<GeoJSON | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch(INDIA_GEO_JSON)
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  if (!geoData) {
    return (
      <div className="relative w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  // Create projection
  const projection = d3Geo.geoMercator()
    .center([78.5, 22.5])
    .scale(850)
    .translate([400, 250]);

  const pathGenerator = d3Geo.geoPath().projection(projection);

  return (
    <div className="relative w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
      <svg
        ref={svgRef}
        width={800}
        height={500}
        style={{ width: "100%", height: "100%" }}
        viewBox="0 0 800 500"
      >
        {geoData.features.map((feature, index) => {
          const stateName = feature.properties.ST_NM || feature.properties.NAME_1 || feature.properties.name || "";
          const data = stateData[stateName];
          const fillColor = data
            ? getColorByUtilization(data.utilizationRate)
            : "#E5E7EB";
          const isHovered = hoveredState === stateName;

          return (
            <path
              key={index}
              d={pathGenerator(feature as unknown as d3Geo.GeoPermissibleObjects) || ""}
              fill={fillColor}
              stroke={isHovered ? "#2C3E50" : "#FFFFFF"}
              strokeWidth={isHovered ? 1.5 : 0.5}
              opacity={isHovered ? 0.8 : 1}
              style={{ cursor: data ? "pointer" : "default", transition: "all 0.2s" }}
              onMouseEnter={(event) => {
                setHoveredState(stateName);
                if (data) {
                  setTooltip({
                    name: stateName,
                    ...data,
                  });
                  setTooltipPosition({
                    x: event.clientX,
                    y: event.clientY,
                  });
                }
              }}
              onMouseMove={(event) => {
                setTooltipPosition({
                  x: event.clientX,
                  y: event.clientY,
                });
              }}
              onMouseLeave={() => {
                setHoveredState(null);
                setTooltip(null);
              }}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-white shadow-lg rounded-lg p-4 border border-gray-200 pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 15}px`,
            top: `${tooltipPosition.y + 15}px`,
          }}
        >
          <div className="space-y-2">
            <p className="font-bold text-[#2C3E50] text-base">{tooltip.name}</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Funds Released:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(tooltip.fundsReleased)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Projects:</span>
                <span className="font-semibold text-gray-900">
                  {tooltip.projectsCount}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Unspent:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(tooltip.unspentFunds)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Utilization:</span>
                <span className="font-semibold text-gray-900">
                  {tooltip.utilizationRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Utilization Rate
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#10B981" }}></div>
            <span className="text-xs text-gray-600">≥80% (High)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#FDB714" }}></div>
            <span className="text-xs text-gray-600">75-80% (Medium)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#F59E0B" }}></div>
            <span className="text-xs text-gray-600">70-75% (Low)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#EF4444" }}></div>
            <span className="text-xs text-gray-600">&lt;70% (Very Low)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200"></div>
            <span className="text-xs text-gray-600">No Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}

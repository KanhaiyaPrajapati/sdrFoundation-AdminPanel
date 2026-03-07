import React from "react";
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";

interface CountryMapProps {
  mapColor?: string;
}

const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-white p-4 shadow-sm dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
      <VectorMap
        map={worldMill}
        backgroundColor="transparent"
        zoomOnScroll={false}
        markerStyle={{
          initial: {
            fill: "#f97316",
            stroke: "#ffffff",
            strokeWidth: 2,
            r: 6,
          } as any,
          hover: {
            fill: "#ea580c",
            cursor: "pointer",
          } as any,
        }}
        regionStyle={{
          initial: {
            fill: mapColor || "#f1f5f9",
            stroke: "#10b981",
            strokeWidth: 0.5,
            strokeOpacity: 0.2,
          },
          hover: {
            fill: "#10b981",
            fillOpacity: 0.8,
          },
        }}
        markers={[
          { latLng: [37.09, -95.71], name: "USA" },
          { latLng: [20.59, 78.96], name: "India" },
          { latLng: [55.37, -3.43], name: "United Kingdom" },
          { latLng: [60.12, 18.64], name: "Sweden" },
        ]}
        zoomAnimate={true}
        series={{
          regions: [
            {
              attribute: "fill",
              scale: ["#d1fae5", "#10b981"],
              values: {
                US: 100,
                IN: 100,
                GB: 100,
                SE: 100,
              },
            },
          ],
        }}
      />
      <div className="absolute bottom-6 left-6 flex items-center gap-4 rounded-2xl bg-white/90 p-3 shadow-xl backdrop-blur-md dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Active
          </span>
        </div>
        <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Markets
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountryMap;

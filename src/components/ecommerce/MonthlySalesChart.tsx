import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState, useEffect } from "react";

const CountUp = ({
  end,
  duration = 1000,
}: {
  end: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
};

export default function DonationAnalyticsPremium() {
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    "#10b981",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
  ];
  const labels = [
    "Zakat",
    "Sadaqah",
    "Education",
    "Emergency",
    "Health",
    "Masjid",
  ];
  const series = [8500, 6200, 5800, 4400, 3900, 2700];
  const total = series.reduce((a, b) => a + b, 0);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Inter, sans-serif",
      sparkline: { enabled: true },
      animations: { enabled: true, speed: 1000 },
      background: "transparent",
    },
    colors: colors,
    labels: labels,
    stroke: { width: 3, colors: ["#ffffff"] },
    plotOptions: {
      pie: {
        donut: {
          size: "82%",
        },
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { theme: "light" },
    states: {
      hover: { filter: { type: "none" } },
    },
  };

  return (
    <div className="w-full p-2">
      <div className="p-2">
        <div className="mb-6 flex items-center justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Impact Analytics
              </h2>
            </div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              Live Donation Flow
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 transition-all hover:text-emerald-500 dark:bg-gray-800 dark:border-gray-700"
            >
              <MoreDotIcon className="size-5" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              className="right-0 top-11 w-44 shadow-xl border-none"
            >
              <DropdownItem
                onItemClick={() => setIsOpen(false)}
                className="text-xs font-semibold"
              >
                Weekly Report
              </DropdownItem>
              <DropdownItem
                onItemClick={() => setIsOpen(false)}
                className="text-xs font-semibold"
              >
                Export CSV
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          <div className="relative flex flex-col items-center justify-center lg:col-span-4">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total
              </span>
              <div className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                $<CountUp end={total / 1000} />k
              </div>
            </div>
            <div className="w-[200px] sm:w-[220px]">
              <Chart
                options={options}
                series={series}
                type="donut"
                width="100%"
                height={220}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 lg:col-span-8">
            {labels.map((label, index) => {
              const percentage = Math.round((series[index] / total) * 100);
              return (
                <div
                  key={label}
                  className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-gray-200 hover:shadow-sm dark:bg-gray-800/40 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold text-white shadow-sm"
                      style={{ backgroundColor: colors[index] }}
                    >
                      <span className="text-[10px]">{percentage}%</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">
                        {label}
                      </p>
                      <p className="mt-1 text-[9px] font-bold text-emerald-500 uppercase leading-none">
                        +{Math.floor(Math.random() * 15)}%
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-black text-gray-900 dark:text-white">
                      $<CountUp end={series[index]} />
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                      Current
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-5 dark:border-gray-800">
          <div className="flex items-center gap-8 px-2">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Avg Donation
              </p>
              <p className="text-lg font-black text-emerald-600 leading-none mt-1">
                $<CountUp end={142} />
              </p>
            </div>
            <div className="h-8 w-px bg-gray-100 dark:bg-gray-800" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Retention
              </p>
              <p className="text-lg font-black text-gray-900 dark:text-white leading-none mt-1">
                <CountUp end={88} />%
              </p>
            </div>
          </div>
          <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-gray-800 active:scale-95 dark:bg-emerald-600 dark:hover:bg-emerald-700">
            Generate Analytics
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

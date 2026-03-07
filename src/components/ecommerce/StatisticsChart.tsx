import { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import { CalenderIcon } from "../../icons";

export default function CompactAppointmentChart() {
  const datePickerRef = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<"day" | "month">("day");

  useEffect(() => {
    if (!datePickerRef.current) return;
    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M d, Y",
      defaultDate: [new Date(), new Date()],
    });
    return () => {
      if (fp && typeof fp.destroy === "function") fp.destroy();
    };
  }, []);

  const chartData = {
    day: {
      categories: ["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"],
      series: [
        { name: "Confirmed", data: [15, 22, 35, 28, 38, 22, 12] },
        { name: "Pending", data: [5, 8, 12, 7, 10, 5, 3] },
      ],
    },
    month: {
      categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
      series: [
        { name: "Confirmed", data: [120, 145, 132, 168] },
        { name: "Pending", data: [35, 42, 28, 51] },
      ],
    },
  };

  const options: ApexOptions = {
    colors: ["#10B981", "#F59E0B"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      background: "transparent",
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 600,
        animateGradually: { enabled: true, delay: 100 },
        dynamicAnimation: { enabled: true, speed: 250 },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "50%",
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#F1F5F9",
      strokeDashArray: 4,
      padding: {
        top: -20,
        bottom: 0,
      },
    },
    xaxis: {
      categories: chartData[view].categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#94A3B8", fontWeight: 600, fontSize: "10px" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#94A3B8", fontSize: "10px" },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      fontFamily: "Outfit",
      fontWeight: 600,
      markers: {
        size: 5,
        strokeWidth: 0,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: { theme: "light" },
  };

  return (
    <div className="w-full p-4">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
            Appointment Stats
          </h3>
          <div className="mt-2 flex gap-1">
            {(["day", "month"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setView(type)}
                className={`rounded-lg px-4 py-1 text-[10px] font-bold uppercase transition-all ${
                  view === type
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <CalenderIcon className="absolute left-3 top-1/2 z-10 size-3.5 -translate-y-1/2 text-orange-500" />
          <input
            ref={datePickerRef}
            readOnly
            className="w-40 rounded-xl border-0 bg-transparent py-2 pl-9 pr-3 text-xs font-bold text-gray-700 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-orange-500 dark:text-gray-200 dark:ring-gray-700 cursor-pointer"
            placeholder="Select date"
          />
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <Chart
          options={options}
          series={chartData[view].series}
          type="bar"
          height={250}
        />
      </div>
    </div>
  );
}

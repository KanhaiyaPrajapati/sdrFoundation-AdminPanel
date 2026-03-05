import React, { useEffect, useState, useMemo } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  GroupIcon,
  BoxIconLine,
} from "../../icons";
import Badge from "../ui/badge/Badge";

const CountUp = ({ to, isCurrency }: { to: string; isCurrency?: boolean }) => {
  const [count, setCount] = useState(0);
  const target = useMemo(() => parseFloat(to.replace(/,/g, "")), [to]);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress < 0.5
        ? 8 * Math.pow(progress, 4)
        : 1 - Math.pow(-2 * progress + 2, 4) / 2;
      
      setCount(ease * target);
      if (progress < 1) window.requestAnimationFrame(step);
      else setCount(target);
    };

    window.requestAnimationFrame(step);
  }, [target]);

  return (
    <span className="tabular-nums">
      {isCurrency && <span className="mr-0.5 font-medium opacity-70">$</span>}
      {Math.round(count).toLocaleString()}
    </span>
  );
};

interface MetricProps {
  title: string;
  value: string;
  percentage: string;
  isUp: boolean;
  Icon: React.ElementType;
}

const MetricCard: React.FC<MetricProps> = ({ title, value, percentage, isUp, Icon }) => {
  const isDonation = title.toLowerCase().includes("donation");
  
  const theme = {
    dot: isUp ? "bg-emerald-500" : "bg-orange-500",
    iconBox: isUp 
      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
      : "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${theme.iconBox}`}>
          <Icon className="size-5" />
        </div>
        
        <Badge color={isUp ? "success" : "warning"}> 
          <div className="flex items-center gap-1 text-[10px] font-bold">
            {isUp ? <ArrowUpIcon className="size-2.5" /> : <ArrowDownIcon className="size-2.5" />}
            {percentage}%
          </div>
        </Badge>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-1.5">
          <div className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {title}
          </p>
        </div>

        <div className="mt-1 flex items-baseline justify-between">
          <h4 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            <CountUp to={value} isCurrency={isDonation} />
          </h4>
          
          <div className={`h-1 w-6 rounded-full transition-all group-hover:w-10 ${isUp ? 'bg-emerald-500' : 'bg-orange-500'}`} />
        </div>
      </div>
    </div>
  );
};

export default function DashboardMetrics() {
  const metrics: MetricProps[] = [
    { title: "Total Users", value: "3782", percentage: "11.01", isUp: true, Icon: GroupIcon },
    { title: "Total Volunteer", value: "5359", percentage: "9.05", isUp: false, Icon: BoxIconLine },
    { title: "Total Appointment", value: "592", percentage: "0.02", isUp: true, Icon: GroupIcon },
    { title: "Total Donation", value: "150500", percentage: "1.50", isUp: false, Icon: BoxIconLine },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 p-4">
      {metrics.map((item, index) => (
        <MetricCard key={index} {...item} />
      ))}
    </div>
  );
}
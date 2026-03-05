import React from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | Admin Analytics"
        description="Comprehensive system monitoring and analytics dashboard."
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <EcommerceMetrics />
        </div>

        <div className="col-span-12 lg:col-span-12">
          <MonthlySalesChart />
        </div>
        <div className="col-span-12">
          <StatisticsChart />
        </div>
      </div>
    </>
  );
}




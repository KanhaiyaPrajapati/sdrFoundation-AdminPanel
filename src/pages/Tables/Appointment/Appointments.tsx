import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import AppointmentTableOne from "../../../components/tables/Appointment/Form/AppointmentTableOne";
import { Grid, List, RefreshCw, Plus } from "lucide-react";

export default function Appointments() {
  const [loading] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <PageMeta
        title="SRD Foundation - Appointments Management"
        description="Manage appointments between users and volunteers"
      />
      
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb pageTitle="Appointments" />
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "table" 
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Table View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "grid" 
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 hover:text-amber-600 transition-all"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <ComponentCard 
          title="Appointments Management"
          desc="Schedule and manage appointments between users and volunteers"
        >
          <AppointmentTableOne key={refreshKey} viewMode={viewMode} />
        </ComponentCard>
      </div>

      <div className="fixed bottom-6 right-6 sm:hidden">
        <button
          onClick={() => {
            const event = new CustomEvent('openAddAppointmentModal');
            window.dispatchEvent(event);
          }}
          className="w-14 h-14 bg-linear-to-r from-amber-500 to-orange-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all hover:scale-110"
        >
          <Plus size={24} />
        </button>
      </div>
    </>
  );
}
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import VolunteersTableOne from "../../../components/tables/Volunteers/Form/VolunteersTableOne";

export default function VolunteersTables() {
  return (
    <>
      <PageMeta
        title="VenTexa Admin Panel - Volunteers"
        description="Manage volunteers in the VenTexa Admin Panel"
      />
      <PageBreadcrumb pageTitle="Volunteers" />
      <div className="space-y-6">
        <ComponentCard title="Volunteers Table">
          <VolunteersTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import ServiceTableOne from "../../../components/tables/ServiceTable/Form/ServiceTableOne";

export default function Services() {
  return (
    <>
      <PageMeta
        title="SRD_FoundationServices"
        description="Manage your services with full CRUD operations"
      />
      <PageBreadcrumb pageTitle="Services" />
      <div className="space-y-6">
        <ComponentCard title="Services Table">
          <ServiceTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
import CreatePhoneForm from "../../components/PhonesDataPage/CreatePhoneForm";
import PhonesDataTable from "../../components/PhonesDataPage/PhonesDataTable";
import SearchFilters from "../../components/PhonesDataPage/SearchFilters";

export default function PhonesDataPage() {
  return (
    <>
      <h1 className="mb-6 fw-600 text-center">Table of phones models</h1>
      <CreatePhoneForm />
      <h2 className="mb-2">Table</h2>
      <SearchFilters />
      <PhonesDataTable />
    </>
  );
}

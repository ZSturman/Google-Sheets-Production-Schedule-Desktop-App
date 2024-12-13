import { useTab } from "../context/TabProvider";
import SettingsContainer from "./settings/SettingsContainer";
import DataTable from "./data-table/DataTable";
import { TableProvider } from "../context/TableProvider";
import ErrorBoundary from "./ErrorBoundary";
import GanttDisplay from "./GanttDisplay";

const SelectedTab = () => {
  const { selectedTab } = useTab();

  const renderSelectedTab = () => {
    if (selectedTab.id === "settings") {
      return <SettingsContainer />;
    }

    if (selectedTab.isWorkCenter) {
      return (
        <TableProvider key={selectedTab.id}>
        <ErrorBoundary>
          <GanttDisplay />
          <DataTable />
        </ErrorBoundary>
      </TableProvider>

      )
    }

    return (
      <TableProvider key={selectedTab.id}>
        <ErrorBoundary>
          <DataTable />
        </ErrorBoundary>
      </TableProvider>
    );
  };

  return (
    <div className="flex flex-col w-[95vw]  gap-4 py-4 ">
      <div className="text-5xl">{selectedTab.name}</div>

      {renderSelectedTab()}
    </div>
  );
};

export default SelectedTab;

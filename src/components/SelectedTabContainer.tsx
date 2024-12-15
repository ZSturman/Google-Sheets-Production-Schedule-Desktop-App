import { useTab } from "../context/TabProvider";
import SettingsContainer from "./settings/SettingsContainer";
import DataTable from "./data-table/DataTable";
import { TableProvider } from "../context/TableProvider";
import ErrorBoundary from "./ErrorBoundary";
import CurrentProduct from "./CurrentProduct";
import { GanttProvider } from "../context/GanttProvider";
import TimelineComponent from "./gantt/TimelineComponent";
import { useCredentials } from "../context/CredentialProvider";

const SelectedTab = () => {
  const { credentialsPath, sheetIdentifier } = useCredentials();

  if (!credentialsPath || !sheetIdentifier) {
    return <SettingsContainer />;
  }



  const { selectedTab } = useTab();

  const renderSelectedTab = () => {
    if (selectedTab.id === "settings") {
      return <SettingsContainer />;
    }

    if (selectedTab.isWorkCenter) {
      return (
        <TableProvider key={selectedTab.id}>
          <GanttProvider>
            <ErrorBoundary>
             <CurrentProduct /> 
             <TimelineComponent  />
              <DataTable />
            </ErrorBoundary>
          </GanttProvider>
        </TableProvider>
      );
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

import { useTab } from "../context/TabProvider";
import SettingsContainer from "./settings/SettingsContainer";
import DataTable from "./data-table/DataTable";
import { TableProvider } from "../context/TableProvider";
import ErrorBoundary from "./ErrorBoundary";
import CurrentProduct from "./CurrentProduct";
import { GanttProvider } from "../context/GanttProvider";
import { useCredentials } from "../context/CredentialProvider";
import RefreshButton from "./RefreshButton";
import { ChartCustomBar } from "./gantt/GanttChart";
import { useData } from "../context/DataProvider";
import { useEffect } from "react";

const SelectedTab = () => {
  const { credentialsPath, sheetIdentifier } = useCredentials();

  if (
    !credentialsPath ||
    !sheetIdentifier ||
    sheetIdentifier === "error" ||
    credentialsPath === "error"
  ) {
    return <SettingsContainer />;
  }

  const { unsavedChanges, loading } = useData();
  const { selectedTab } = useTab();

  useEffect(() => {
    console.log("LOADING STATE SHOULD BE CHANGING HERE", loading);
  }, [loading]);

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

              <ChartCustomBar />
              <DataTable />
            </ErrorBoundary>
          </GanttProvider>
        </TableProvider>
      );
    }

    if (selectedTab.id === "production_schedule") {
      return (
        <TableProvider key={selectedTab.id}>
          <GanttProvider>
            <ErrorBoundary>
              {/*   <ChartCustomBar /> */}
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
      <div>
        {unsavedChanges && (
          <div className="text-red-500">Unsaved changes</div>
        )}
      </div>
      <RefreshButton />

      {renderSelectedTab()}
    </div>
  );
};

export default SelectedTab;

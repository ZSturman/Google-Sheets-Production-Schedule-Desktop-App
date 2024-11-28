import "./App.css";
import { SidebarProvider } from "./components/ui/sidebar";
import { TabProvider, useTab } from "./context/TabProvider";
import SelectedTab from "./components/SelectedTabContainer";

import { DataProvider } from "./context/DataProvider";
import { useCredentials } from "./context/CredentialProvider";

function App() {
  return (
    <div className="w-screen h-screen max-w-screen max-h-screen overflow-scroll">
      <SidebarProvider>
        <TabProvider>
          <MainContent />
        </TabProvider>
      </SidebarProvider>
    </div>
  );
}

export default App;

const MainContent = () => {
  const { db } = useCredentials();
  const { selectedTab } = useTab();

  if (!db) {
    return <div>Database not connected</div>;
  }

  return (
    <DataProvider selectedTab={selectedTab} db={db}>
      <SelectedTab />
    </DataProvider>
  );
};

import "./App.css";
import { SidebarProvider } from "./components/ui/sidebar";
import { TabProvider } from "./context/TabProvider";
import SelectedTab from "./components/SelectedTabContainer";

import { DataProvider } from "./context/DataProvider";
//import { useCredentials } from "./context/CredentialProvider";

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
  

  return (
    <DataProvider>
      <SelectedTab />
    </DataProvider>
  );
};

// App.tsx
// Entry point for the application, sets up providers and renders the main content.

import "./App.css";
import { SidebarProvider } from "./components/ui/sidebar";
import { TabProvider } from "./context/TabProvider";
import SelectedTab from "./components/SelectedTabContainer";
import { DataProvider } from "./context/DataProvider";

/**
 * Main application component.
 * Sets up the providers for sidebar, tabs, and data context.
 */
function App() {
  return (
    <SidebarProvider className="max-w-screen">
      <TabProvider>
        <MainContent />
      </TabProvider>
    </SidebarProvider>
  );
}

export default App;

/**
 * MainContent component.
 * Encapsulates the primary content area and provides data context.
 */
const MainContent = () => {
  return (
    <DataProvider>
      <SelectedTab />
    </DataProvider>
  );
};
// TabProvider.tsx
// Provides context and UI for managing tabs in the sidebar.

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,

} from "../components/ui/sidebar";
import { Button } from "../components/ui/button";
import { sidebarTabGroups } from "../data/tabs";
import { useCredentials } from "./CredentialProvider";

type TabContextType = {
  selectedTab: TabOption;
};

const defaultTabContext: TabContextType = {
  selectedTab: sidebarTabGroups[0].groupTabs[0],
};

// Initialize the context
const TabContext = createContext<TabContextType>(defaultTabContext);

type TabProviderProps = {
  children: ReactNode;
};


/**
 * TabProvider component.
 * Manages the state of the selected tab and provides a UI for selecting tabs.
 * @param {ReactNode} children - Components that consume the tab context.
 */
export const TabProvider = ({ children }: TabProviderProps) => {
  const { lastSelectedTab, selectNewTab } = useCredentials();
  const [selectedTab, setSelectedTab] = useState<TabOption>(lastSelectedTab);

  /**
   * Updates the selected tab state and saves it to credentials.
   * @param tab - The tab option to select.
   */
  const handleSelectedTabs = (tab: TabOption) => {
    setSelectedTab(tab);
    selectNewTab(tab.id);
  }

  useEffect(() => {
    setSelectedTab(lastSelectedTab);
  } , [lastSelectedTab]);

    /**
   * Renders the sidebar with tab options grouped by categories.
   */
  const tabsList = () => {
    return (
      <Sidebar>
        <SidebarContent className="bg-zinc-300 text-xs">
          <div className="mt-4 mx-2">
            <SidebarTrigger />
          </div>

          {sidebarTabGroups.map((group, index) => (
            <SidebarGroup key={`${group.groupHeader}-${index}`}>
              <SidebarGroupLabel>{group.groupHeader}</SidebarGroupLabel>
              <SidebarGroupContent className="space-y-1">
                {group.groupTabs.map((tab, index) => (
                  <SidebarMenuItem
                    key={`${tab.id}-${index}`}
                    className="list-none"
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={tab.id === selectedTab.id}
                    >
                      <Button
                        className={`${
                          tab.id === selectedTab.id
                            ? "text-black bg-slate-300"
                            : "text-white bg-zinc-600"
                        } text-xs`}
                        key={tab.id}
                        value={tab.id}
                        onClick={() => handleSelectedTabs(tab)}
                      >
                        {tab.name}
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
    );
  };

  return (


    <TabContext.Provider
      value={{
        selectedTab,
      }}
      >
      {tabsList()}
      <div className="w-full h-full bg-zinc-100">
        <div className="flex flex-col  pt-8">{children}</div>
        <div className="fixed top-0 left-0 pt-4 px-2">
          <SidebarTrigger />
        </div>
      </div>
    </TabContext.Provider>
  );
};

// Custom hook for consuming the context
export const useTab = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTab must be used within a TabProvider");
  }
  return context;
};

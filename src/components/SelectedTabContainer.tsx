import { useTab } from "../context/TabProvider";

import { useData } from "../context/DataProvider";

import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import SettingsContainer from "./settings/SettingsContainer";
import DataTable from "./data-table/DataTable";
import { TableProvider } from "../context/TableProvider";

const SelectedTab = () => {
  const { selectedTab } = useTab();
  const {  messages, refreshData, productsData, workCenterScheduleData } =
    useData();

  const renderSelectedTab = () => {


    if (selectedTab.id === "settings") {
      return <SettingsContainer />;
    }

    if (selectedTab.id === "ledger") {
      return <p>Ledger</p>;
    }

    if (productsData === "loading" || workCenterScheduleData === "loading") {
      return <p>Loading...</p>;
    }

    if (productsData === "error" || workCenterScheduleData === "error") {
      return <p>Error fetching data from the server.</p>;
    }


    return (
      <TableProvider key={selectedTab.id} selectedTab={selectedTab} productsData={productsData} workCenterScheduleData={workCenterScheduleData}>
        <DataTable />
      </TableProvider>
    );
  };

  return (
    <div className="flex flex-col w-[95vw]  gap-4 py-4 ">
      <div className="text-5xl">{selectedTab.name}</div>

      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        {messages.map((message, index) => (
          <div key={index}>
            <div
              className={`${message.type === "error" && "text-red-600"} ${
                message.type === "info" && "text-black"
              } ${message.type === "success" && "text-green-600"} ${
                message.type === "warning" && "text-yellow-600"
              }`}
            >
              {message.timestamp.toISOString()} ={message.message}
            </div>
          </div>
        ))}
      </ScrollArea>
      <Button variant="default" onClick={refreshData}>
        Refresh Data
      </Button>

      {renderSelectedTab()}
    </div>
  );
};

export default SelectedTab;

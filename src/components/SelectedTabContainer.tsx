import { useTab } from "../context/TabProvider";
import SettingsContainer from "./settings/SettingsContainer";
import DataTable from "./data-table/DataTable";
import { TableProvider } from "../context/TableProvider";
import ErrorBoundary from "./ErrorBoundary";
//import CurrentProduct from "./CurrentProduct";
import { GanttProvider } from "../context/GanttProvider";
import { useCredentials } from "../context/CredentialProvider";
import RefreshButton from "./RefreshButton";
import { ChartCustomBar } from "./GanttChart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import SingleProductInfo from "./SingleProductInfo";
import ReadyForInspection from "./ReadyForInspection";

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

  const { selectedTab } = useTab();

  const renderSelectedTab = () => {
    if (selectedTab.id === "settings") {
      return <SettingsContainer />;
    }

    if (selectedTab.isWorkCenter) {

      if (selectedTab.id === "wc_ready_for_inspection") {
        return (
          <TableProvider key={selectedTab.id}>
            <GanttProvider>
              <ErrorBoundary>
                <AccordionComp trigger="Ready" value="currentProduct" defaultOpen>
                  <ReadyForInspection />
                </AccordionComp>
                <DataTable />
              </ErrorBoundary>
            </GanttProvider>
          </TableProvider>
        );
      } else if (selectedTab.id === "wc_unassigned") {
        <TableProvider key={selectedTab.id}>
        <GanttProvider>
          <ErrorBoundary>
            <DataTable />
          </ErrorBoundary>
        </GanttProvider>
      </TableProvider>

      } else {
      return (
        <TableProvider key={selectedTab.id}>
          <GanttProvider>
            <ErrorBoundary>

              <AccordionComp trigger="In Progress" value="currentProduct" defaultOpen>
                <SingleProductInfo />
              </AccordionComp>
              <AccordionComp trigger="Gantt Chart" value="gantt" defaultOpen>
                <ChartCustomBar />
              </AccordionComp>
              <DataTable />
            </ErrorBoundary>
          </GanttProvider>
        </TableProvider>
      );
    }
    }

    if (selectedTab.id === "production_schedule") {
      return (
        <TableProvider key={selectedTab.id}>
          <GanttProvider>
            <ErrorBoundary>
              <AccordionComp trigger="Gantt Chart" value="gantt">
                <ChartCustomBar />
              </AccordionComp>
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
    <div className="flex flex-col  gap-4 px-2 py-4 ">
      <div>
        <RefreshButton />
      </div>

      <div className="text-xl">{selectedTab.name}</div>

      {renderSelectedTab()}
    </div>
  );
};

export default SelectedTab;

type AccordionCompProps = {
  trigger: string;
  value: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

const AccordionComp: React.FC<AccordionCompProps> = ({ trigger, children, value, defaultOpen }) => {
  return (
    <Accordion type="single" collapsible className="border-2 px-4 py-2" defaultValue={defaultOpen ? value : undefined} >

      <AccordionItem value={value}>
        <AccordionTrigger className="justify-start px-2">
          {trigger}
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

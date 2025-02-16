// DataProvider.tsx
// Manages data state and provides helper functions for data operations.

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useCredentials } from "./CredentialProvider";
import {
  allTabs,
  ledgersTab,
  productsTab,
  workCenterSchedulesTab,
} from "../data/tabs";
import {
  defaultTables,
  getDefaultLedgersRow,
  getDefaultProductsRow,
  getDefaultWorkCenterSchedules,
} from "../data/defaults";
import { updateGoogleSheetData } from "../data/updateGoogleSheetsData";
import fetchGoogleSheetsData from "../data/getGoogleSheetsData";
import { v4 as uuidv4 } from "uuid";
import { calculateScheduleStartAndEnd } from "../data/calculateScheduledStartAndEnd";
import { workCenters } from "../data/lists";
import { createGoogleSheetWithHeaders } from "../data/createGoogleSheet";

type DataState = {
  products: ProductData[];
  workCenterSchedules: WorkCenterScheduleData[];
  ledger: LedgerData[];
};

const initialState: DataState = {
  products: [],
  workCenterSchedules: [],
  ledger: [],
};

type DataContextType = {
  state: DataState;
  loading: boolean;
  updatedAt: number;
  handleDataChange: (
    tab: TabOption,
    actionType: "add" | "update",
    data: ProductData | WorkCenterScheduleData | LedgerData
  ) => Promise<void>;
  handleDeleteRows: (
    tab: TabOption,
    data: (ProductData | WorkCenterScheduleData | LedgerData)[]
  ) => Promise<void>;
  processAllWorkCenters: () => Promise<void>;
  processSpecificWorkCenter: (workCenter: WorkCenter) => Promise<void>;
  refreshData: () => Promise<void>;
  unsavedChanges: boolean;
  dataChanged: boolean;
  moveToReady: (product: ProductData) => void;
  // exportToCSV: (tab: TabId) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

type DataProviderProps = {
  children: ReactNode;
};

/**
 * DataProvider component.
 * Handles global data state and exposes methods for managing data.
 * @param {ReactNode} children - Components that consume the data context.
 */
export const DataProvider = ({ children }: DataProviderProps) => {
  const { credentialsPath, sheetIdentifier } = useCredentials();
  const [state, setState] = useState<DataState>(initialState);
  const dataRef = useRef<DataState>(initialState);
  const isInitialized = useRef(false);

  const [productsPopulated, setProductsPopulated] = useState(false);
  const [workCenterSchedulesPopulated, setWorkCenterSchedulesPopulated] =
    useState(false);

  const [dataChanged, setDataChanged] = useState(false);

  const [, setProductsDebounceTimer] = useState<number | null>(null);
  const [, setWorkCenterSchedulesDebounceTimer] = useState<number | null>(null);
  const [, setLedgerDebounceTimer] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(Date.now());

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const moveToReady = (product: ProductData) => {
    const updatedProduct = { ...product, work_center: "Ready for inspection" };
    handleDataChange(productsTab, "update", updatedProduct);
    refreshData();
  };

  /**
   * Handles data changes by updating the state and committing changes to the database.
   * @param tab - The tab option to modify.
   * @param actionType - Action type ("add" or "update").
   * @param data - Data to modify.
   */
  const handleDataChange = async (
    tab: TabOption,
    actionType: "add" | "update",
    data: ProductData | WorkCenterScheduleData | LedgerData
  ) => {
    setUnsavedChanges(true);
    setDataChanged(true);

    try {
      // Determine the relevant timer state and commit function
      let timerStateSetter: React.Dispatch<React.SetStateAction<number | null>>;
      let commitFunction: () => Promise<void>;

      switch (tab.id) {
        case "work_center_schedules":
          timerStateSetter = setWorkCenterSchedulesDebounceTimer;
          commitFunction = commitWorkCenterSchedulesSheet;
          break;
        case "ledger":
          timerStateSetter = setLedgerDebounceTimer;
          commitFunction = commitLedgerSheet;
          break;
        default:
          timerStateSetter = setProductsDebounceTimer;
          commitFunction = commitProductsSheet;
          break;
      }

      console.log(timerStateSetter, commitFunction);

      if (actionType === "add" || actionType === "update") {
        console.log("Is Add or Update");
        if (!tab.columnDict) {
          console.error("Column dictionary not found for tab:", tab);
          return;
        }

        if (tab.id === "work_center_schedules") {
          console.log("Is WorkCenterSchedules");
          if (actionType === "add") {
            console.log("Is Add");
            dataRef.current.workCenterSchedules = [
              ...dataRef.current.workCenterSchedules,
              data as WorkCenterScheduleData,
            ];
          } else {
            console.log("Is Update");
            const updated = dataRef.current.workCenterSchedules.map((w) =>
              w.id === (data as WorkCenterScheduleData).id
                ? (data as WorkCenterScheduleData)
                : w
            );
            dataRef.current.workCenterSchedules = updated;
          }
        } else if (tab.id === "ledger") {
          console.log("Is Ledger");
          if (actionType === "add") {
            console.log("Is Add");
            dataRef.current.ledger = [
              ...dataRef.current.ledger,
              data as LedgerData,
            ];
          } else {
            console.log("Is Update");
            const updated = dataRef.current.ledger.map((l) =>
              l.id === (data as LedgerData).id ? (data as LedgerData) : l
            );
            dataRef.current.ledger = updated;
          }
        } else {
          if (actionType === "add") {
            if (actionType === "add") {
              dataRef.current.products = [
                ...dataRef.current.products,
                { ...data, id: uuidv4() } as ProductData, // Ensure id is unique
              ];
            }
          } else {
            const updated = dataRef.current.products.map((product) =>
              product.id === (data as ProductData).id
                ? (data as ProductData)
                : product
            );
            dataRef.current.products = updated;

            if (tab.isWorkCenter) {
              console.log("Is WorkCenter");

              await processSpecificWorkCenter(tab.name as WorkCenter);
            }
          }
        }
      }
      await commitFunction(); // Commit the relevant table
      setState(dataRef.current); // Updates the state
      setUpdatedAt(Date.now()); // Trigger a timestamp update
    } catch (error) {
      console.error(`Error during ${actionType} operation:`, error);
    } finally {
      setUnsavedChanges(false);
    }
  };

  const processSpecificWorkCenter = async (workCenter: WorkCenter) => {
    if (!productsPopulated || !workCenterSchedulesPopulated) {
      return;
    }

    const { products, workCenterSchedules } = dataRef.current;

    const updatedRows: ProductData[] = [];

    const returnedTimes = await calculateScheduleStartAndEnd(
      products,
      workCenterSchedules,
      workCenter
    );

    if (returnedTimes) {
      returnedTimes.forEach((updatedRow) => {
        const productIndex = dataRef.current.products.findIndex(
          (p) => p.id === updatedRow.id
        );

        if (productIndex !== -1) {
          dataRef.current.products[productIndex] = updatedRow;
          updatedRows.push(updatedRow);
        }
      });
    }

    for (const updatedRow of updatedRows) {
      await handleDataChange(productsTab, "update", updatedRow);
    }

    setState({ ...dataRef.current });
  };

  const processAllWorkCenters = async () => {
    if (!productsPopulated || !workCenterSchedulesPopulated) {
      return;
    }

    try {
      if (!productsPopulated || !workCenterSchedulesPopulated) {
        return;
      }

      const workCenterDB: WorkCenter[] = workCenters.filter(
        (workCenter) =>
          workCenter !== "Ready for inspection" && workCenter !== "UNASSIGNED"
      );

      const { products, workCenterSchedules } = dataRef.current;
      const updatedRows: ProductData[] = [];

      for (const workCenter of workCenterDB) {
        const returnedTimes = await calculateScheduleStartAndEnd(
          products,
          workCenterSchedules,
          workCenter
        );

        if (returnedTimes) {
          returnedTimes.forEach((updatedRow) => {
            const productIndex = dataRef.current.products.findIndex(
              (p) => p.id === updatedRow.id
            );

            if (productIndex !== -1) {
              dataRef.current.products[productIndex] = updatedRow;
              updatedRows.push(updatedRow);
            }
          });
        }
      }

      // Push updates to the database
      for (const updatedRow of updatedRows) {
        await handleDataChange(productsTab, "update", updatedRow);
      }

      setState({ ...dataRef.current });
    } catch (err) {
      console.error("Error processing all work centers:", err);
    }

    setDataChanged(false);
  };

  const handleDeleteRows = async (
    tab: TabOption,
    data: (ProductData | WorkCenterScheduleData | LedgerData)[]
  ) => {
    console.log("DELETING ROWS", tab, data);
    try {
      if (!tab.columnDict) {
        console.error("Column dictionary not found for tab:", tab);
        return;
      }

      if (tab.id === "products") {
        dataRef.current.products = dataRef.current.products.filter(
          (product) => !data.includes(product)
        );
      } else if (tab.id === "work_center_schedules") {
        dataRef.current.workCenterSchedules =
          dataRef.current.workCenterSchedules.filter(
            (schedule) => !data.includes(schedule)
          );
      } else if (tab.id === "ledger") {
        dataRef.current.ledger = dataRef.current.ledger.filter(
          (entry) => !data.includes(entry)
        );
      }

      setState(dataRef.current); // Updates the state
      setUpdatedAt(Date.now()); // Trigger a timestamp update

      // Commit the changes
      switch (tab.id) {
        case "work_center_schedules":
          await commitWorkCenterSchedulesSheet();
          break;
        case "ledger":
          await commitLedgerSheet();
          break;
        default:
          await commitProductsSheet();
          break;
      }
    } catch (error) {
      console.error("Error during delete operation:", error);
    }
  };
  const prepareGoogleSheetData = (
    tab: TabOption,
    data: (ProductData | WorkCenterScheduleData | LedgerData)[]
  ): (string | null)[][] => {
    if (!tab.columnDict) {
      console.error("Column dictionary not found for tab:", tab);
      return [];
    }

    const headers = [
      "id",
      ...Object.values(tab.columnDict)
        .filter((col) => col.id !== "id")
        .map((col) => String(col.googleSheetHeader)),
    ];

    console.log("Headers", headers);

    const rows = data.map((item) => {
      return tab.columnDict
        ? [
            "id",
            ...Object.values(tab.columnDict)
              .filter((col) => col.id !== "id")
              .map((col) => {
                let value = item[col.id as keyof typeof item];

                if (value === undefined || value === null) {
                  value = item[col.googleSheetHeader as keyof typeof item];
                }
                return value !== undefined && value !== null
                  ? String(value)
                  : "N/A";
              }),
          ]
        : [];
    });

    return [headers, ...rows];
  };

  const commitProductsSheet = async () => {
    const productsData = prepareGoogleSheetData(
      productsTab,
      dataRef.current.products
    );
    updateGoogleSheetData(
      credentialsPath,
      sheetIdentifier,
      productsTab,
      productsData
    );
  };

  const commitWorkCenterSchedulesSheet = async () => {
    const workCenterSchedulesData = prepareGoogleSheetData(
      workCenterSchedulesTab,
      dataRef.current.workCenterSchedules
    );
    updateGoogleSheetData(
      credentialsPath,
      sheetIdentifier,
      workCenterSchedulesTab,
      workCenterSchedulesData
    );
  };

  const commitLedgerSheet = async () => {
    const ledgerData = prepareGoogleSheetData(
      ledgersTab,
      dataRef.current.ledger
    );
    console.log("ledgerData", ledgerData);
    updateGoogleSheetData(
      credentialsPath,
      sheetIdentifier,
      ledgersTab,
      ledgerData
    );
  };

  const seedDefaults = async (
    tableDefaults: "Products" | "WorkCenterSchedules" | "Ledger"
  ) => {
    switch (tableDefaults) {
      case "Products":
        if (!productsTab.columnDict) {
          console.error("Column dictionary not found for tab:", productsTab);
          return;
        }

        const defaultRow = getDefaultProductsRow();
        dataRef.current.products = [defaultRow];

        await commitProductsSheet();
        break;
      case "WorkCenterSchedules":
        if (!workCenterSchedulesTab.columnDict) {
          console.error(
            "Column dictionary not found for tab:",
            workCenterSchedulesTab
          );
          return;
        }
        const defaultWorkCenterSchedulesRow = getDefaultWorkCenterSchedules();
        dataRef.current.workCenterSchedules = defaultWorkCenterSchedulesRow;

        await commitWorkCenterSchedulesSheet();

        break;
      case "Ledger":
        if (!ledgersTab.columnDict) {
          console.error("Column dictionary not found for tab:", ledgersTab);
          return;
        }
        const defaultLedgersRow = getDefaultLedgersRow();

        dataRef.current.ledger = [defaultLedgersRow];

        await commitLedgerSheet();

        break;
    }
    setState(dataRef.current);
  };

  const transformRecords = async (
    tab: TabOption,
    records: string[][],
    headers: string[]
  ): Promise<DataRowT[]> => {
    const transformedRecords = records.map((row) => {
      const record: Partial<DataRowT> = {};
      headers.forEach((header, index) => {
        const column = Object.values(tab.columnDict!).find(
          (col) =>
            col.googleSheetHeader?.trim().toLowerCase() ===
            header.trim().toLowerCase()
        );
        if (column && column.id !== "id") {
          record[column.id] = row[index];
        }
      });

      // Assign a unique ID if not present
      if (!record.id) {
        record.id = uuidv4();
      }

      return record as DataRowT;
    });

    return transformedRecords;
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      if (isInitialized.current) return;
      isInitialized.current = true;

      try {
        for (const tab of allTabs) {
          if (tab.googleSheetName && tab.columnDict) {
            try {
              // Attempt to fetch data from the Google Sheet
              const googleSheetData = await fetchGoogleSheetsData(
                credentialsPath,
                sheetIdentifier,
                tab
              );

              if (googleSheetData) {
                const headers = googleSheetData[0];
                const records = googleSheetData.slice(1);

                switch (tab.id) {
                  case "products":
                    if (records.length === 0) {
                      console.log("Seeding defaults for Products");
                      await seedDefaults("Products");
                    }
                    const transformedProductRecords = await transformRecords(
                      tab,
                      records,
                      headers
                    );
                    dataRef.current.products =
                      transformedProductRecords as ProductData[];
                    setProductsPopulated(true);
                    break;
                  case "ledger":
                    if (records.length === 0) {
                      await seedDefaults("Ledger");
                    }
                    const transformedLedgerRecords = await transformRecords(
                      tab,
                      records,
                      headers
                    );
                    dataRef.current.ledger =
                      transformedLedgerRecords as LedgerData[];
                    break;
                  case "work_center_schedules":
                    if (records.length === 0) {
                      await seedDefaults("WorkCenterSchedules");
                    }
                    const transformedRecords = await transformRecords(
                      tab,
                      records,
                      headers
                    );
                    dataRef.current.workCenterSchedules =
                      transformedRecords as WorkCenterScheduleData[];
                    setWorkCenterSchedulesPopulated(true);
                    break;
                }
                setState(dataRef.current);
                setUpdatedAt(Date.now());
              }
            } catch (error) {
              console.error("Error fetching Google Sheet data:", error);

              // Create the missing Google Sheet with headers
              const defaultTable = Object.values(defaultTables).find(
                (table) => table.sheetName === tab.googleSheetName
              );
              if (defaultTable) {
                console.log(
                  `Creating missing sheet: ${defaultTable.sheetName}`
                );
                await createGoogleSheetWithHeaders(
                  credentialsPath,
                  sheetIdentifier,
                  defaultTable.sheetName,
                  defaultTable.headers
                );

                // Retry fetching the data
                const googleSheetData = await fetchGoogleSheetsData(
                  credentialsPath,
                  sheetIdentifier,
                  tab
                );
                if (googleSheetData) {
                  const headers = googleSheetData[0];
                  const records = googleSheetData.slice(1);
                  const transformedRecords = await transformRecords(
                    tab,
                    records,
                    headers
                  );
                  switch (tab.id) {
                    case "products":
                      dataRef.current.products =
                        transformedRecords as ProductData[];
                      setProductsPopulated(true);
                      break;
                    case "ledger":
                      dataRef.current.ledger =
                        transformedRecords as LedgerData[];
                      break;
                    case "work_center_schedules":
                      dataRef.current.workCenterSchedules =
                        transformedRecords as WorkCenterScheduleData[];
                      setWorkCenterSchedulesPopulated(true);
                      break;
                  }
                  setState(dataRef.current);
                  setUpdatedAt(Date.now());
                }
              } else {
                console.error(`Default table not found for tab: ${tab.id}`);
              }
            }
          }
        }
      } catch (error) {
        console.log(JSON.stringify(error), null, 2);
      } finally {
        setLoading(false);
      }
    };

    if (
      credentialsPath !== "loading" &&
      credentialsPath !== "error" &&
      sheetIdentifier !== "loading" &&
      sheetIdentifier !== "error"
    ) {
      initialize();
    }
  }, [credentialsPath, sheetIdentifier]);

  const refreshData = async () => {
    console.log("Refreshing data...");
    setLoading(true);
    try {
      for (const tab of allTabs) {
        if (tab.googleSheetName && tab.columnDict) {
          const googleSheetData = await fetchGoogleSheetsData(
            credentialsPath,
            sheetIdentifier,
            tab
          );

          if (googleSheetData) {
            const headers = googleSheetData[0];
            const records = googleSheetData.slice(1);

            switch (tab.id) {
              case "products":
                const transformedProductRecords = await transformRecords(
                  tab,
                  records,
                  headers
                );
                dataRef.current.products =
                  transformedProductRecords as ProductData[];
                setProductsPopulated(true);
                break;
              case "ledger":
                const transformedLedgerRecords = await transformRecords(
                  tab,
                  records,
                  headers
                );
                dataRef.current.ledger =
                  transformedLedgerRecords as LedgerData[];
                break;
              case "work_center_schedules":
                const transformedWorkCenterSchedulesRecords =
                  await transformRecords(tab, records, headers);
                dataRef.current.workCenterSchedules =
                  transformedWorkCenterSchedulesRecords as WorkCenterScheduleData[];
                setWorkCenterSchedulesPopulated(true);
                break;
            }
            setState(dataRef.current);
            setUpdatedAt(Date.now());
          }
        }
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  // TODO: Implement exportToCSV

  const contextValue = useMemo(
    () => ({
      state,
      handleDataChange,
      handleDeleteRows,
      loading,
      updatedAt,
      processAllWorkCenters,
      processSpecificWorkCenter,
      refreshData,
      unsavedChanges,
      dataChanged,
      moveToReady,
    }),
    [state, loading, updatedAt, unsavedChanges, dataChanged]
  );

  useEffect(() => {
    if (!credentialsPath || !sheetIdentifier || credentialsPath === "error" || sheetIdentifier === "error" || credentialsPath === "loading" || sheetIdentifier === "loading") {
      console.log("Credentials or sheet identifier not found, reloading...");
      return;
    } else {
      console.log("Credentials and sheet identifier found, setting up timeout...");
      const timeout = setTimeout(() => {
        if (loading) {
          console.log("Loading timeout reached, reloading...");
          window.location.reload();
        }
      }, 5000);

      return () => clearTimeout(timeout); // Cleanup on component unmount or loading state change
    }
  }, [loading, credentialsPath, sheetIdentifier]);

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

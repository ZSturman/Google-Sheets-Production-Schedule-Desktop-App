import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useCredentials } from "./CredentialProvider";
import getGoogleSheetData from "../data/getGoogleSheetsData";
import Database from "@tauri-apps/plugin-sql";
import {
  createTable,
  fetchRecords,

  insertOrUpdateRecords,
} from "../data/sqlDatabaseFunctions";
import { updateGoogleSheetData } from "../data/updateGoogleSheetsData";
import { productsTab, workCenterScheduleTab } from "../data/tabs";


type DataContextType = {
  messages: Message[];
  addMessage: (message: Message) => void;
  refreshData: () => Promise<void>;
  productsData: ProductData[] | LoadingState;
  workCenterScheduleData: WorkCenterScheduleData[] | LoadingState;
  addLocalSheetUpdate: (
    tab: TabOption,
    type: "update" | "delete" | "add",
    row: DataRowT,
    prevRow?: DataRowT
  ) => void;
};

const defaultDataContext: DataContextType = {
  messages: [],
  addMessage: () => {},
  refreshData: async () => {},
  productsData: "loading",
  workCenterScheduleData: "loading",
  addLocalSheetUpdate: () => {},
};

const DataContext = createContext<DataContextType>(defaultDataContext);

type DataProviderProps = {
  children: ReactNode;
  selectedTab: TabOption;
  db: Database;
};

export const DataProvider = ({
  children,
  selectedTab,
  db,
}: DataProviderProps) => {
  const { credentialsPath, sheetIdentifier, appDirectoryPath } = useCredentials();

  const [isConfigReady, setIsConfigReady] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [productsData, setProductsData] = useState<ProductData[] | LoadingState>("loading");
  const [workCenterScheduleData, setWorkCenterScheduleData] = useState<WorkCenterScheduleData[] | LoadingState>("loading");

  const [needToPushToDatabase, setNeedToPushToDatabaseUpdates] = useState<LocalSheetUpdate[]>([]);
  const [needToPushToGoogle, setNeedToPushToGoogleUpdates] = useState<SqlSheetUpdate[]>([]);
  const [finalizedUpdates, setFinalizedUpdates] = useState<FinalizedSheetUpdate[]>([]);


  /* ----------------- Local Sheet Updates ----------------- */ 
  

  const addLocalSheetUpdate = (
    tab: TabOption,
    type: "update" | "delete" | "add",
    row: DataRowT,
    prevRow?:DataRowT
  ) => {

    console.log("Adding local sheet update:", type, row);
    console.log("Previous row:", prevRow);

    const updatedLocallyAt = new Date();

    const newSheetUpdate: LocalSheetUpdate = {
      tab,
      updatedLocallyAt,
      undo: false,
      type,
      row,
      prevRow,
    };

    setNeedToPushToDatabaseUpdates((prevUpdates) => [
      newSheetUpdate,
      ...prevUpdates,
    ]);
  };


  useEffect(() => {
    console.log("Need to push to database:", needToPushToDatabase);
    if (needToPushToDatabase.length === 0) return;
    console.log("Pushing to database");
    const [update, ...rest] = needToPushToDatabase;
    updateDbAndGetReadyToUpdateGoogle(update);
    setNeedToPushToDatabaseUpdates(rest);
  }, [needToPushToDatabase]);

  useEffect(() => {

    console.log("Need to push to Google:", needToPushToGoogle);
    if (needToPushToGoogle.length === 0) return;
    const [update, ...rest] = needToPushToGoogle;

    console.log("Pushing to Google Sheets:", update);
  
    // Directly call the update function without a delay
    updateGoogleSheets(update).then(() => {
      console.log("Google Sheets updated successfully");
      setNeedToPushToGoogleUpdates(rest);
    });
  }, [needToPushToGoogle]);


  const updateDbAndGetReadyToUpdateGoogle = async (update: LocalSheetUpdate) => {

    console.log("Updating database and preparing to update Google Sheets:", update);
    try {
      const { type, row, tab } = update;

      console.log("Updating database:", type, row);
  
      switch (type) {
        case "add":
          await addRecord(row, tab.sqlTableName);
          break;
        case "update":
          await updateRecord(row.id, row, tab.sqlTableName);
          break;
        case "delete":
          await deleteRecord(row.id, row, tab.sqlTableName);
          break;
        default:
          throw new Error("Unknown update type");
      }
  
      // Refresh data to ensure local state matches database
      await refreshData();

      console.log("Database updated successfully (locally)");
  
      // Push the update to Google Sheets
      const sqlUpdate = {
        ...update,
        updatedSqlAt: new Date(),
      };

      console.log("Preparing to update Google Sheets:", sqlUpdate);
      setNeedToPushToGoogleUpdates((prevUpdates) => [sqlUpdate, ...prevUpdates]);
    } catch (error) {
      console.error("Error updating database:", error);
    }
  };
  
  const updateGoogleSheets = async (update: SqlSheetUpdate) => {
    try {
      // Fetch the latest data from the database
      let refreshedData = await fetchRecords<DataRowT>(db, update.tab.sqlTableName);
  
      console.log("REFRESHED DATA:", refreshedData);
  
      // If the updated row exists in refreshed data, replace it with the updated row
      refreshedData = refreshedData.map((record) =>
        record.id === update.row.id ? update.row : record
      );
  
      // Prepare data for Google Sheets
      const preparedData = refreshedData.map((record) =>
        Object.values(update.tab.columnDict ?? {})
          .filter((col) => col.googleSheetHeader) // Filter out the `id` column
          .map((col) =>
            col.toGoogleConverter
              ? col.toGoogleConverter(record[col.sqlTableHeader])
              : String(record[col.sqlTableHeader] ?? "")
          )
      );
  
      console.log("PREPARED DATA:", preparedData);
  
      const googleSheetData = [
        Object.values(update.tab.columnDict ?? {})
          .filter((col) => col.googleSheetHeader)
          .map((col) => col.googleSheetHeader!), // Use only headers that map to Google Sheet columns
        ...preparedData,
      ];
  
      console.log("GOOGLE SHEET DATA:", googleSheetData);
  
      await updateGoogleSheetData(
        credentialsPath,
        sheetIdentifier,
        update.tab,
        addMessage,
        googleSheetData
      );
  
      console.log("Google Sheets updated successfully");
  
      // Mark the update as finalized
      const finalizedUpdate = {
        ...update,
        updatedGoogleAt: new Date(),
      };
      setFinalizedUpdates((prevUpdates) => [finalizedUpdate, ...prevUpdates]);
    } catch (error) {
      console.error("Error updating Google Sheets:", error);
    }
  };

  /* ----------------- Data Refresh ----------------- */


  useEffect(() => {
    if (isConfigReady) refreshData();
  }, [isConfigReady]);

  useEffect(() => {
    if (
      credentialsPath !== "loading" &&
      sheetIdentifier !== "loading" &&
      appDirectoryPath !== "loading" &&
      credentialsPath !== "error" &&
      sheetIdentifier !== "error" &&
      appDirectoryPath !== "error"
    ) {
      setIsConfigReady(true);
    }
  }, [credentialsPath, sheetIdentifier, appDirectoryPath]);




  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    console[message.type === "error" ? "error" : "log"](message.message);
  };

  const refreshData = async () => {
    console.log("Refreshing data");
    try {
      // Create tables and sync data for each tab
      await createTablesAndSyncData(productsTab);
      await createTablesAndSyncData(workCenterScheduleTab);
  
      addMessage({
        type: "success",
        message: "Data refreshed successfully",
        timestamp: new Date(),
      });
    } catch (error) {
      addMessage({
        type: "error",
        message: "Error refreshing data",
        timestamp: new Date(),
      });
      console.error("Error refreshing data:", error);
    }
  };


  /* ----------------- Google Sheet Data Fetch ----------------- */



  const fetchGoogleSheetData = async (tab: TabOption): Promise<string[][]> => {
    try {
      return await getGoogleSheetData(
        credentialsPath,
        sheetIdentifier,
        tab,
        addMessage
      );
    } catch (error) {
      addMessage({
        type: "error",
        message: "Error fetching Google Sheet data",
        timestamp: new Date(),
      });
      throw error;
    }
  };


  /* ----------------- Sync Data -----------------*/



  const createTablesAndSyncData = async (tab: TabOption) => {
    console.log("Creating table and syncing data:", tab);
    if (!tab.sqlTableName || !tab.columnDict) {
      addMessage({
        type: "error",
        message: "Missing SQL table name or column dictionary",
        timestamp: new Date(),
      });
      return;
    }
    try {
      await createTable(db, tab.sqlTableName, tab.columnDict);
      const googleSheetData = await fetchGoogleSheetData(tab);
      await syncGoogleSheetDataToDatabase(googleSheetData, tab);
    } catch (error) {
      console.error("Error syncing data:", error);
    }
  };



  const syncGoogleSheetDataToDatabase = async (
    data: string[][],
    tab: TabOption
  ) => {
    if (!tab.columnDict || !tab.sqlTableName) {
      addMessage({
        type: "error",
        message: "Missing column dictionary",
        timestamp: new Date(),
      });
      return;
    }
    try {
      const [headers, ...rows] = data;
      const transformedData = rows.map((row) =>
        headers.reduce((acc, header, index) => {
          acc[header] = row[index];
          return acc;
        }, {} as Record<string, any>)
      );

      if (transformedData.length > 0) {
        await insertOrUpdateRecords(
          db,
          tab,
          transformedData
        );
      }

      const records = await fetchRecords(db, tab.sqlTableName);
      if (tab.sqlTableName === "Products") {
        setProductsData(records as ProductData[]);
      } else if (tab.sqlTableName === "WorkCenterSchedule") {
        setWorkCenterScheduleData(records as WorkCenterScheduleData[]);
      } 
    } catch (error) {
      console.error("Error syncing data to the database:", error);
    }
  };



  /* ----------------- CRUD Operations ----------------- */


  const deleteRecord = async (
    rowId: string,
    row: DataRowT,
    tableName?: string
  ) => {
    try {
      await db.execute(
        `DELETE FROM ${
          tableName ? tableName : selectedTab.sqlTableName
        } WHERE id = ?`,
        [rowId]
      );
      await refreshData();
      addLocalSheetUpdate(selectedTab, "delete", row);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const updateRecord = async (
    id: string,
    updatedRecord: DataRowT,
    tableName?: string
  ) => {
    console.log("Updating record:", updatedRecord);
    try {
      console.log("Updating record:", updatedRecord);
      const columns = Object.keys(updatedRecord).map((col) => `"${col}" = ?`);
      const updateSQL = `
        UPDATE ${
          tableName ? tableName : selectedTab.sqlTableName
        } SET ${columns.join(", ")} WHERE id = ?;
      `;
      const values = Object.values(updatedRecord).concat([id]);

      console.log("Update SQL:", updateSQL);
      const response = await db.execute(updateSQL, values);
      console.log("Update response:", response);
      await refreshData();
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const addRecord = async (
    newRecord: DataRowT,
    tableName?: string
  ) => {

    console.log("Adding record:", newRecord);
    try {
      const columns = Object.keys(newRecord).map((col) => `"${col}"`);
      const placeholders = Object.keys(newRecord)
        .map(() => "?")
        .join(", ");
      const insertSQL = `
        INSERT INTO ${
          tableName ? tableName : selectedTab.sqlTableName
        } (${columns.join(", ")}) VALUES (${placeholders});
      `;
      const values = Object.values(newRecord);
      await db.execute(insertSQL, values);
      await refreshData();
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };




  return (
    <DataContext.Provider
      value={{
        messages,
        addMessage,
        refreshData,
        productsData,
        workCenterScheduleData,
        addLocalSheetUpdate,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

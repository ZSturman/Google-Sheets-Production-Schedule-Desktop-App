import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { load, Store } from "@tauri-apps/plugin-store";
import {
  exists,
  readTextFile,
  writeTextFile,
  mkdir,
} from "@tauri-apps/plugin-fs";
import { open } from "@tauri-apps/plugin-dialog";
import { appDataDir, join } from "@tauri-apps/api/path";
import { withTimeout } from "../lib/withTimeout";
import { invoke } from "@tauri-apps/api/core";
//import Database from "@tauri-apps/plugin-sql";

type CredentialsType = {
  credentialsPath: string | LoadingState;
  sheetIdentifier: string | LoadingState;
  appDirectoryPath: string | LoadingState;
  allIdentifiers: string[];
  testOutput: string | null;
  //db: Database | null;
  addCredentialsPath: () => void;
  addIdentifier: (identifier: string) => void;
  handleSelectIdentifier: (selectedIdentifier: string) => void;
};

// Default values for context
const defaultCredentials: CredentialsType = {
  credentialsPath: "loading",
  sheetIdentifier: "loading",
  appDirectoryPath: "loading",
  allIdentifiers: [],
  testOutput: null,
  //db: null,
  addCredentialsPath: () => {},
  addIdentifier: () => {},
  handleSelectIdentifier: () => {},
};

// Create Context
const Credentials = createContext<CredentialsType>(defaultCredentials);

// Provider Component
export const CredentialsProvider = ({ children }: { children: ReactNode }) => {
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [credentialsPath, setCredentialsPath] = useState<string | LoadingState>(
    "loading"
  );
  const [allIdentifiers, setIdentifiers] = useState<string[]>([]);
  const [sheetIdentifier, setSheetIdentifier] = useState<string | LoadingState>(
    "loading"
  );
  const [appDirectoryPath, setAppDirectoryPath] = useState<
    string | LoadingState
  >("loading");
  const [store, setStore] = useState<Store | null>(null);
  //const [db, setDb] = useState<Database | null>(null);

  const STORE = {
    STORE_NAME: "rods-sheets.Credentials.json",
    IDENTIFIERS: "identifiers",
    LAST_USED_IDENTIFIER: "selectedIdentifier",
    //DB_NAME: "rods-sheets2.db",
  };

  const CREDENTIALS_FILENAME = "credentials.json";

  useEffect(() => {
    const initializeAppDirectory = async () => {
      setAppDirectoryPath("loading");
      try {
        await setupAppDirectory();
      } catch {
        setAppDirectoryPath("error");
      }
    };

    // const initializeDatabase = async () => {
    //   try {
    //     const db = await setUpDb(STORE.DB_NAME);
    //     setDb(db);
    //   } catch {
    //     setDb(null);
    //   }
    // };

    const initializeStore = async () => {
      try {
        await setUpStore();
      } catch {
        setStore(null);
      }
    };

    const initializeProvider = async () => {
      try {
        await initializeAppDirectory();
        await initializeStore();
       // await initializeDatabase();

        checkForCredentialsPath();
        checkForIdentifiers();
      } catch (e) {
        console.error("Error during initialization:", e);
      }
    };

    initializeProvider();
  }, []);

  useEffect(() => {
    if (typeof appDirectoryPath === "string") {
      checkForCredentialsPath();
    }
  }, [appDirectoryPath]);

  useEffect(() => {
    if (store) {
      checkForIdentifiers();
    }
  }, [store]);

  const setupAppDirectory = async () => {
    const appDataDirPath = await appDataDir();
    const appDataDirExists = await exists(appDataDirPath);

    if (!appDataDirExists) {
      await mkdir(appDataDirPath, { recursive: true });
    } else {
    }

    setAppDirectoryPath(appDataDirPath);
  };

  const setUpStore = async () => {
    const store = await load(STORE.STORE_NAME);
    setStore(store);
  };

  // const setUpDb = async (dbName: string) => {
  //   try {
  //     // Load or create a database file
  //     const db = await Database.load(`sqlite:${dbName}`);

  //     return db;
  //   } catch (error) {
  //     console.error("Error initializing database:", error);
  //     throw error;
  //   }
  // };

  const checkForCredentialsPath = async () => {
    if (appDirectoryPath === "loading") {
      return;
    }

    const credentialsFilePath = await join(
      appDirectoryPath,
      CREDENTIALS_FILENAME
    );

    const result = await withTimeout(
      exists(credentialsFilePath),
      5000 // 5 seconds timeout
    );

    if (result === "timeout") {
      setCredentialsPath("error");
      console.error("Timeout: Failed to check credentials path");
      return;
    }

    if (result) {
      setCredentialsPath(credentialsFilePath);
    } else {
      setCredentialsPath("error");
    }
  };

  const checkForIdentifiers = async () => {
    if (!store) {
      return;
    }

    const result = await withTimeout(
      store.get<string[]>(STORE.IDENTIFIERS),
      5000 // 5 seconds timeout
    );

    if (result === "timeout") {
      console.error("Timeout: Failed to load identifiers");
      setSheetIdentifier("error");
      return;
    }

    const identifiersList = result;

    if (!identifiersList || identifiersList.length === 0) {
      setIdentifiers([]);
      setSheetIdentifier("error");
      return;
    }

    const uniqueIdentifiers = Array.from(new Set(identifiersList));
    setIdentifiers(uniqueIdentifiers);

    const lastUsedIdentifier = await store.get<string>(
      STORE.LAST_USED_IDENTIFIER
    );

    if (!lastUsedIdentifier) {
      setSheetIdentifier(uniqueIdentifiers[0] || "error");
      return;
    }

    setSheetIdentifier(lastUsedIdentifier);
  };

  const addCredentialsPath = async () => {
    const file = await open({
      multiple: false,
      directory: false,
      types: [{ extensions: ["json"] }],
    });

    if (!appDirectoryPath) return;

    const credentialsFilePath = await join(
      appDirectoryPath,
      CREDENTIALS_FILENAME
    );
    if (file) {
      const fileData = await readTextFile(file);
      await writeTextFile(credentialsFilePath, fileData);
      setCredentialsPath(credentialsFilePath);
    }
  };

  const addIdentifier = async (identifier: string) => {
    if (!store) return;

    const identifiersList =
      (await store.get<string[]>(STORE.IDENTIFIERS)) || [];
    const uniqueIdentifiers = new Set(identifiersList);
    uniqueIdentifiers.add(identifier);

    await store.set(STORE.IDENTIFIERS, Array.from(uniqueIdentifiers));
    await store.save();

    setIdentifiers(Array.from(uniqueIdentifiers));
    await store.set(STORE.LAST_USED_IDENTIFIER, identifier);
    await store.save();
    setSheetIdentifier(identifier);
  };

  const handleSelectIdentifier = async (selectedIdentifier: string) => {
    if (!store) return;
    await store.set(STORE.LAST_USED_IDENTIFIER, selectedIdentifier);
    await store.save();
    setSheetIdentifier(selectedIdentifier);
  };

  const testAuth = async () => {
    try {
      const sheetNames = await invoke<string[]>("test_auth", {
        privKeyPath: credentialsPath,
        sheetId: sheetIdentifier,
      });

      setTestOutput(`Sheet names: ${sheetNames.join(", ")}`);
    } catch (error) {
      setTestOutput("Error: Could not retrieve sheet names.");
    }
  };

  useEffect(() => {
    if (credentialsPath === "loading" || sheetIdentifier === "loading") {
      return;
    }

    if (credentialsPath === "error" || sheetIdentifier === "error") {
      setTestOutput(null);
      return;
    }
    testAuth();
  }, [credentialsPath, sheetIdentifier]);

  return (
    <Credentials.Provider
      value={{
        credentialsPath,
        sheetIdentifier,
        appDirectoryPath,
        allIdentifiers,
        testOutput,
        //db,
        addCredentialsPath,
        addIdentifier,
        handleSelectIdentifier,
      }}
    >
      <div>{children}</div>
    </Credentials.Provider>
  );
};

export const useCredentials = () => useContext(Credentials);

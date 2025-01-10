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
  remove,
} from "@tauri-apps/plugin-fs";
import { open } from "@tauri-apps/plugin-dialog";
import { withTimeout } from "../lib/withTimeout";
import { invoke } from "@tauri-apps/api/core";
import { join, appDataDir } from "@tauri-apps/api/path";

type CredentialsType = {
  credentialsPath: string | LoadingState;
  sheetIdentifier: string | LoadingState;
  appDirectoryPath: string | LoadingState;
  allIdentifiers: string[];
  testOutput: string | null;

  addCredentialsPath: () => void;
  addIdentifier: (identifier: string) => void;
  handleSelectIdentifier: (selectedIdentifier: string) => void;
  deleteCredentials: () => void;
  ensureCredentialsFileExists: () => Promise<string>;
  refresh: () => void;
};

// Default values for context
const defaultCredentials: CredentialsType = {
  credentialsPath: "loading",
  sheetIdentifier: "loading",
  appDirectoryPath: "loading",
  allIdentifiers: [],
  testOutput: null,
  addCredentialsPath: () => {},
  addIdentifier: () => {},
  handleSelectIdentifier: () => {},
  deleteCredentials: () => {},
  ensureCredentialsFileExists: async () => "",
  refresh: () => {},
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

  const STORE = {
    STORE_NAME: "rods-sheets.Credentials.json",
    IDENTIFIERS: "identifiers",
    LAST_USED_IDENTIFIER: "selectedIdentifier",
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

  const refresh = async () => {
    try {
      await setUpStore();
      checkForCredentialsPath();
      checkForIdentifiers();
    } catch (e) {
      console.error("Error during refresh:", e);
    }
  };

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

  const deleteCredentials = async () => {
    if (!appDirectoryPath || appDirectoryPath === "loading") return;

    try {
      const credentialsFilePath = await join(
        appDirectoryPath,
        CREDENTIALS_FILENAME
      );

      const result = await exists(credentialsFilePath);

      if (!result) {
        setCredentialsPath("error");
        return;
      }

      if (result) {
        await remove(credentialsFilePath);
      }

      // Reset related state values
      setCredentialsPath("error");
      setTestOutput(null);
      setIdentifiers([]);

      console.log("Credentials deleted successfully.");
    } catch (error) {
      console.error("Failed to delete credentials:", error);
    }
  };

  const checkForCredentialsPath = async () => {
    if (appDirectoryPath === "loading") {
      return;
    }

    const credentialsFilePath = await join(
      appDirectoryPath,
      CREDENTIALS_FILENAME
    );

    const result = await withTimeout(exists(credentialsFilePath), 5000);

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

  const ensureCredentialsFileExists = async (): Promise<string> => {
    if (appDirectoryPath === "loading" || appDirectoryPath === "error") {
      const appDataDirPath = await appDataDir();
      const appDataDirExists = await exists(appDataDirPath);

      if (!appDataDirExists) {
        await mkdir(appDataDirPath, { recursive: true });
      }

      setAppDirectoryPath(appDataDirPath);
    }

    const credentialsFilePath = await join(
      appDirectoryPath as string,
      CREDENTIALS_FILENAME
    );

    const fileExists = await exists(credentialsFilePath);
    if (!fileExists) {
      await writeTextFile(credentialsFilePath, "{}"); // Create an empty JSON file
    }

    return credentialsFilePath;
  };

  const addCredentialsPath = async () => {
    const file = await open({
      multiple: false,
      directory: false,
      types: [{ extensions: ["json"] }],
    });

    if (!appDirectoryPath || typeof appDirectoryPath !== "string") {
      throw new Error("App directory not initialized.");
    }

    const credentialsFilePath = await ensureCredentialsFileExists();

    if (file) {
      const fileData = await readTextFile(file);
      await writeTextFile(credentialsFilePath, fileData); // Overwrite with selected file contents
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
        addCredentialsPath,
        addIdentifier,
        handleSelectIdentifier,
        deleteCredentials,
        ensureCredentialsFileExists,
        refresh,
      }}
    >
      <div>{children}</div>
    </Credentials.Provider>
  );
};

export const useCredentials = () => useContext(Credentials);

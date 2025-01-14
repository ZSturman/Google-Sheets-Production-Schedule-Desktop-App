import { useEffect, useState } from "react";
import { useCredentials } from "../../context/CredentialProvider";
import {
  readTextFile,
  writeTextFile,
  readDir,
  readFile,
} from "@tauri-apps/plugin-fs";
import { listen } from "@tauri-apps/api/event";
import { Button } from "../ui/button";
import { FaCircleCheck } from "react-icons/fa6";
import { useData } from "../../context/DataProvider";

export const isDirectory = async (path: string): Promise<boolean> => {
  try {
    const entries = await readDir(path);
    return Array.isArray(entries); // If it returns entries, it's a directory
  } catch (error) {
    console.error(`Error reading path ${path}:`, error);
    return false;
  }
};

const CredentialsSettings = () => {
  const {
    credentialsPath,
    addCredentialsPath,
    deleteCredentials,
    ensureCredentialsFileExists,
    refresh,
  } = useCredentials();
  const { refreshData } = useData();
  const [droppedPath, setDroppedPath] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<string | Uint8Array | null>(
    null
  );
  const [showTextArea, setShowTextArea] = useState<boolean>(false);

  const [credentialsFileContents, setCredentialsFileContents] = useState<
    any | null
  >(null);
  const [jsonInput, setJsonInput] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const loadContents = async () => {
      const contents = await contentsOfCredentialsPathFile();
      setCredentialsFileContents(contents);
    };
    loadContents();
  }, [credentialsPath]);

  useEffect(() => {
    const unlisten = listen<{ paths: string[] }>(
      "tauri://drag-drop",
      async (event) => {
        console.log("File dropped:", JSON.stringify(event.payload));

        if (event.payload?.paths?.length > 0) {
          const path = event.payload.paths[0];
          const isJsonFile = path.toLowerCase().endsWith(".json");

          if (!isJsonFile) {
            console.warn("Only .json files are allowed.");
            return;
          }

          setDroppedPath(path);

          const isDir = await isDirectory(path);
          if (isDir) {
            console.warn("Directories are not supported for .json validation.");
            return;
          }

          try {
            const fileData = await readFile(path);
            const fileContents = new TextDecoder().decode(fileData);
            setFileContents(fileContents);
          } catch (error) {
            console.error("Error reading .json file:", error);
            setFileContents("Error reading file");
          }
        }
      }
    );

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setJsonInput(
      credentialsFileContents
        ? JSON.stringify(credentialsFileContents, null, 2)
        : ""
    );
  };

  const saveJsonInput = async () => {
    if (!jsonInput.trim()) {
      alert("JSON input cannot be empty.");
      return;
    }

    try {
      const sanitizedInput = jsonInput.trim();
      const parsedInput = JSON.parse(sanitizedInput); // Validate JSON structure
      const jsonString = JSON.stringify(parsedInput, null, 2); // Re-format the JSON string

      // Ensure the path and file exist dynamically
      const finalPath = await ensureCredentialsFileExists();

      await writeTextFile(finalPath, jsonString);
      setCredentialsFileContents(parsedInput); // Update state with new contents
      setJsonInput(jsonString); // Update the textarea with formatted JSON
      setIsEditing(false);

      refresh();
      refreshData()
    } catch (error) {
      console.error("Error parsing or saving JSON input:", error);
      alert("Invalid JSON format. Please correct it.");
    }
  };

  const saveNewJsonInput = async (contents: string) => {
    try {
      const sanitizedInput = contents.trim();
      const parsedInput = JSON.parse(sanitizedInput); // Validate JSON structure
      const jsonString = JSON.stringify(parsedInput, null, 2); // Re-format the JSON string

      // Ensure the path and file exist dynamically
      const finalPath = await ensureCredentialsFileExists();

      await writeTextFile(finalPath, jsonString);
      setCredentialsFileContents(parsedInput); // Update state with new contents
      setJsonInput(jsonString); // Update the textarea with formatted JSON
      setIsEditing(false);

      alert("Credentials saved successfully!");
      refresh();
      refreshData()
    } catch (error) {
      console.error("Error parsing or saving JSON input:", error);
      alert("Invalid JSON format. Please correct it.");
    }
  };

  const contentsOfCredentialsPathFile = async (): Promise<any | null> => {
    if (credentialsPath === "loading" || credentialsPath === "error") {
      return null;
    }

    try {
      const fileContents = await readTextFile(credentialsPath);
      const parsedContents = JSON.parse(fileContents);

      if (
        typeof parsedContents === "object" &&
        Object.keys(parsedContents).length === 0
      ) {
        return null;
      }

      return parsedContents;
    } catch (error) {
      console.error("Error reading or parsing credentials file:", error);
      return null;
    }
  };

  const renderFileContents = () => {
    return (
      <div className="flex flex-col gap-4 max-w-[70vw]">
        <pre className="text-wrap break-words line-clamp-5">
          {fileContents as string}{" "}
        </pre>
        <Button onClick={() => saveNewJsonInput(fileContents as string)}>
          Save JSON
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col border-b-2 mb-2 border-black py-4">
      <div className="flex flex-row gap-2">
        <Button onClick={refresh}>Refresh</Button>

        {credentialsFileContents && (
          <div className="flex flex-row gap-2">
            <Button onClick={deleteCredentials}>Delete Credentials</Button>
            <Button onClick={addCredentialsPath}>Replace Credentials</Button>
          </div>
        )}
        <Button onClick={handleEditToggle}>
          {isEditing ? "Cancel Editing" : "Edit/Add JSON"}
        </Button>
      </div>

      {credentialsFileContents && (
        <div className="flex flex-row items-center gap-4 text-xl font-bold">
          <FaCircleCheck />

          <h2>Credentials file set</h2>
        </div>
      )}

      {isEditing ||
        (!credentialsFileContents &&
          (showTextArea ? (
            <div className="flex flex-col mt-4">
              <Button onClick={() => setShowTextArea(false)} className="bg-transparent border-2 border-black text-black hover:bg-black hover:text-white">
                Drag and Drop instead
              </Button>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={10}
                className="w-full p-2 border"
                placeholder="Paste your JSON here..."
              />
              <Button onClick={saveJsonInput} disabled={!jsonInput}>Save JSON</Button>
            </div>
          ) : (
            <div className="flex flex-col mt-4">
              <Button onClick={() => setShowTextArea(true)} className="bg-transparent border-2 border-black text-black hover:bg-black hover:text-white">
                Add JSON manually
              </Button>
              {droppedPath ? (
                <div>{renderFileContents()}</div>
              ) : (
                <div className="border-2 border-dashed p-10 w-full flex items-center justify-center">

                <p>Drag and drop json config here</p>
                </div>
              )}
            </div>
          )))}
    </div>
  );
};

export default CredentialsSettings;

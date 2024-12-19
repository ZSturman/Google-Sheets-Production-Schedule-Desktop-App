
import { useEffect, useState } from "react";
import { useCredentials } from "../../context/CredentialProvider";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

const CredentialsSettings = () => {
  const { credentialsPath, addCredentialsPath, deleteCredentials, ensureCredentialsFileExists, refresh } =
    useCredentials();

  const [credentialsFileContents, setCredentialsFileContents] = useState<any | null>(null);
  const [jsonInput, setJsonInput] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const loadContents = async () => {
      const contents = await contentsOfCredentialsPathFile();
      setCredentialsFileContents(contents);
    };
    loadContents();
  }, [credentialsPath]);



  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setJsonInput(
      credentialsFileContents ? JSON.stringify(credentialsFileContents, null, 2) : ""
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
  
      alert("Credentials saved successfully!");
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

      if (typeof parsedContents === "object" && Object.keys(parsedContents).length === 0) {
        return null;
      }

      return parsedContents;
    } catch (error) {
      console.error("Error reading or parsing credentials file:", error);
      return null;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <button onClick={refresh}>Refresh</button>
        <button onClick={deleteCredentials}>Delete Credentials</button>
        <button onClick={addCredentialsPath}>Replace Credentials</button>
        <button onClick={handleEditToggle}>
          {isEditing ? "Cancel Editing" : "Edit/Add JSON"}
        </button>
      </div>

      {isEditing && (
        <div className="flex flex-col mt-4">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={10}
            className="w-full p-2 border"
            placeholder="Paste your JSON here..."
          />
          <button onClick={saveJsonInput} className="mt-2 p-2 border bg-blue-500 text-white">
            Save JSON
          </button>
        </div>
      )}

      {!isEditing && credentialsFileContents && (
        <div className="flex flex-col max-w-screen-lg mt-4">
          <h2>Credentials</h2>
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {JSON.stringify(credentialsFileContents, null, 2)}
          </pre>
        </div>
      )}

      { !credentialsFileContents && (
        <div className="mt-4">
          <p>No valid credentials found. Use the text area to paste or create JSON data.</p>
        </div>
      )}
    </div>
  );
};

export default CredentialsSettings;
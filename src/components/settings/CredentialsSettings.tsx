// import { useEffect, useState } from "react";
// import { useCredentials } from "../../context/CredentialProvider";
// import { readTextFile } from "@tauri-apps/plugin-fs";

// const CredentialsSettings = () => {
//   const { credentialsPath, addCredentialsPath, deleteCredentials } =
//     useCredentials();

//   const [credentialsFileContents, setCredentialsFileContents] = useState<
//     any | null
//   >(null);
//   const [viewCredentials, setViewCredentials] = useState<boolean>(false);

//   useEffect(() => {
//     const loadContents = async () => {
//       const contents = await contentsOfCredentialsPathFile();
//       setCredentialsFileContents(contents);
//     };
//     loadContents();
//   }, [credentialsPath]);

//   const toggleCredentials = () => {
//     setViewCredentials(!viewCredentials);
//   };

//   const contentsOfCredentialsPathFile = async (): Promise<any | null> => {
//     if (credentialsPath === "loading" || credentialsPath === "error") {
//       return null;
//     }

//     try {
//       const fileContents = await readTextFile(credentialsPath);
//       const parsedContents = JSON.parse(fileContents);

//       if (
//         typeof parsedContents === "object" &&
//         Object.keys(parsedContents).length === 0
//       ) {
//         return null;
//       }

//       return parsedContents;
//     } catch (error) {
//       return null;
//     }
//   };

//   if (credentialsPath === "loading") {
//     return <p>Loading credentials path...</p>;
//   }

//   if (credentialsPath === "error") {
//     return (
//       <div>
//         <p>Error loading credentials file.</p>
//         <button onClick={addCredentialsPath}>Select Credentials File</button>
//       </div>
//     );
//   }

//   if (!credentialsFileContents) {
//     return (
//       <div>
//         <p>Credentials file loaded: {credentialsPath}</p>
//         <p>
//           The file is empty or invalid. Please upload a valid credentials file.
//         </p>
//         <button onClick={deleteCredentials}>Delete Credentials</button>
//         <button onClick={addCredentialsPath}>Select Credentials File</button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col">
//       <div className="flex flex-row">
//       <button onClick={toggleCredentials}>
//         {viewCredentials ? "Hide Credentials" : "View Credentials"}
//       </button>
//       <button onClick={deleteCredentials}>Delete Credentials</button>
//       <button onClick={addCredentialsPath}>Replace Credentials</button>
//       </div>
//       {viewCredentials && (
//       <div className="flex flex-col max-w-screen-lg">
//         <h2>Credentials</h2>
//         <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
//         {JSON.stringify(credentialsFileContents, null, 2)}
//         </pre>
//       </div>
//       )}
//     </div>
//   );
// };

// export default CredentialsSettings;


import { useEffect, useState } from "react";
import { useCredentials } from "../../context/CredentialProvider";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

const CredentialsSettings = () => {
  const { credentialsPath, addCredentialsPath, deleteCredentials } =
    useCredentials();

  const [credentialsFileContents, setCredentialsFileContents] = useState<
    any | null
  >(null);
  const [viewCredentials, setViewCredentials] = useState<boolean>(false);
  const [jsonInput, setJsonInput] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const loadContents = async () => {
      const contents = await contentsOfCredentialsPathFile();
      setCredentialsFileContents(contents);
    };
    loadContents();
  }, [credentialsPath]);

  const toggleCredentials = () => {
    setViewCredentials(!viewCredentials);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (credentialsFileContents) {
      setJsonInput(JSON.stringify(credentialsFileContents, null, 2));
    }
  };

  const saveJsonInput = async () => {
    if (!jsonInput.trim()) {
      alert("JSON input cannot be empty.");
      return;
    }
  
    try {
      // Clean and parse the input
      const sanitizedInput = jsonInput.trim();
      const parsedInput = JSON.parse(sanitizedInput); // Validate JSON structure
  
      const jsonString = JSON.stringify(parsedInput, null, 2); // Re-format the JSON string
  
      if (credentialsPath !== "loading" && credentialsPath !== "error") {
        await writeTextFile(credentialsPath, jsonString); // Write JSON to the file
        setCredentialsFileContents(parsedInput); // Update state with new contents
        setJsonInput(jsonString); // Update the textarea with formatted JSON
        setIsEditing(false);
        alert("Credentials saved successfully!");
      } else {
        alert("Invalid credentials path.");
      }
    } catch (error) {
      console.error("Error parsing JSON input:", error);
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

  if (credentialsPath === "loading") {
    return <p>Loading credentials path...</p>;
  }

  if (credentialsPath === "error") {
    return (
      <div>
        <p>Error loading credentials file.</p>
        <button onClick={addCredentialsPath}>Select Credentials File</button>
      </div>
    );
  }

  if (!credentialsFileContents) {
    return (
      <div>
        <p>Credentials file loaded: {credentialsPath}</p>
        <p>
          The file is empty or invalid. Please upload a valid credentials file.
        </p>
        <button onClick={deleteCredentials}>Delete Credentials</button>
        <button onClick={addCredentialsPath}>Select Credentials File</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <button onClick={toggleCredentials}>
          {viewCredentials ? "Hide Credentials" : "View Credentials"}
        </button>
        <button onClick={deleteCredentials}>Delete Credentials</button>
        <button onClick={addCredentialsPath}>Replace Credentials</button>
        <button onClick={handleEditToggle}>
          {isEditing ? "Cancel Editing" : "Edit JSON"}
        </button>
      </div>

      {isEditing && (
        <div className="flex flex-col mt-4">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={10}
            className="w-full p-2 border"
          />
          <button onClick={saveJsonInput} className="mt-2 p-2 border bg-blue-500 text-white">
            Save JSON
          </button>
        </div>
      )}

      {viewCredentials && !isEditing && (
        <div className="flex flex-col max-w-screen-lg mt-4">
          <h2>Credentials</h2>
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {JSON.stringify(credentialsFileContents, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CredentialsSettings;
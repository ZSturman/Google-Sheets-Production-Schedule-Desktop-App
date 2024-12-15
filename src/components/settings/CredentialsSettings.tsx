// import { useEffect, useState } from "react";
// import { useCredentials } from "../../context/CredentialProvider";
// import { readTextFile } from "@tauri-apps/plugin-fs";

// const CredentialsSettings = () => {
//   const { credentialsPath, addCredentialsPath } =
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
//         <button onClick={addCredentialsPath}>Select Credentials File</button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col">
//         <div>
//             TO ADD: The ability to just copy and paste the credentials into a text box
//         </div>
//       <div className="flex flex-row">
//         <button onClick={toggleCredentials}>
//           {viewCredentials ? "Hide Credentials" : "View Credentials"}
//         </button>
//         <button onClick={addCredentialsPath}>Replace Credentials</button>
//       </div>
//       {viewCredentials && (
//         <div className="flex flex-col">
//           <h2>Credentials</h2>
//           <pre>{JSON.stringify(credentialsFileContents, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CredentialsSettings;


import { useEffect, useState } from "react";
import { useCredentials } from "../../context/CredentialProvider";
import { readTextFile } from "@tauri-apps/plugin-fs";

const CredentialsSettings = () => {
  const { credentialsPath, addCredentialsPath } = useCredentials();
  const [credentialsFileContents, setCredentialsFileContents] = useState<any | null>(null);
  const [viewCredentials, setViewCredentials] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    if (credentialsPath && !manualMode) {
      loadContentsFromFile();
    }
  }, [credentialsPath, manualMode]);

  const loadContentsFromFile = async () => {
    try {
      const fileContents = await readTextFile(credentialsPath);
      const parsedContents = JSON.parse(fileContents);
      setCredentialsFileContents(parsedContents);
    } catch (error) {
      setCredentialsFileContents(null);
    }
  };

  const handleManualInput = () => {
    try {
      const parsedInput = JSON.parse(manualInput);
      setCredentialsFileContents(parsedInput);
      setManualMode(true);
    } catch {
      alert("Invalid JSON. Please ensure your input is valid.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Credentials Settings</h2>
      <div>
        {!manualMode && credentialsPath && (
          <p className="text-gray-700">
            Credentials file loaded: <span className="font-mono">{credentialsPath}</span>
          </p>
        )}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          onClick={addCredentialsPath}
        >
          {credentialsPath ? "Replace Credentials File" : "Select Credentials File"}
        </button>
      </div>

      <div>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => setManualMode(!manualMode)}
        >
          {manualMode ? "Switch to File Upload" : "Paste Credentials"}
        </button>
      </div>

      {manualMode && (
        <div className="space-y-2">
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            rows={6}
            placeholder="Paste your JSON credentials here..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
          ></textarea>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleManualInput}
          >
            Save Credentials
          </button>
        </div>
      )}

      {viewCredentials && credentialsFileContents && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">Credentials</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(credentialsFileContents, null, 2)}
          </pre>
        </div>
      )}

      {credentialsFileContents && (
        <button
          className="text-blue-500 underline mt-2"
          onClick={() => setViewCredentials(!viewCredentials)}
        >
          {viewCredentials ? "Hide Credentials" : "View Credentials"}
        </button>
      )}
    </div>
  );
};

export default CredentialsSettings;
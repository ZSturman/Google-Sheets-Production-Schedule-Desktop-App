import { useEffect, useState } from "react";
import { useCredentials } from "../../context/CredentialProvider";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

const CredentialsSettings = () => {
  const { credentialsPath, addCredentialsPath } =
    useCredentials();

  const [credentialsFileContents, setCredentialsFileContents] = useState<
    any | null
  >(null);
  const [viewCredentials, setViewCredentials] = useState<boolean>(false);

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
        <button onClick={addCredentialsPath}>Select Credentials File</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
        <div>
            TO ADD LATER: The ability to just copy and paste the credentials into a text box
        </div>
      <div className="flex flex-row">
        <button onClick={toggleCredentials}>
          {viewCredentials ? "Hide Credentials" : "View Credentials"}
        </button>
        <button onClick={addCredentialsPath}>Replace Credentials</button>
      </div>
      {viewCredentials && (
        <div className="flex flex-col">
          <h2>Credentials</h2>
          <pre>{JSON.stringify(credentialsFileContents, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CredentialsSettings;

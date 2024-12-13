import { useState } from "react";
import { useCredentials } from "../../context/CredentialProvider";

const IdentifierSettings = () => {
  const { sheetIdentifier, addIdentifier } = useCredentials();
  const [viewIdentifier, setViewIdentifier] = useState<boolean>(false);
  const [newIdentifier, setNewIdentifier] = useState<string>("");
  const [showNewIdentifierInput, setShowNewIdentifierInput] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (sheetIdentifier === "loading") {
    return <p>Loading sheet identifier...</p>;
  }

  const toggleIdentifierView = () => {
    setViewIdentifier(!viewIdentifier);
  };

  const toggleShowInput = () => {
    setShowNewIdentifierInput(!showNewIdentifierInput);
    setError(null); // Clear error when toggling input
  };

  const replaceIdentifier = async () => {
    const validationError = validateIdentifier(); // Directly get the validation error
    console.log("Validation Error:", validationError);

    if (validationError) {
      setError(validationError); // Set the error state for display
      return; // Exit if validation fails
    }

    if (newIdentifier.trim()) {
      await addIdentifier(newIdentifier);
      setNewIdentifier(""); // Clear the input field
      setError(null); // Clear any error state
      setShowNewIdentifierInput(false); // Hide the input field
    }
  };

  const validateIdentifier = (): string | null => {
    console.log("Validating identifier...");
    console.log("New Identifier:", newIdentifier);

    if (newIdentifier.trim() === "") {
      return "Invalid identifier. It cannot be empty.";
    }

    if (newIdentifier.includes("https")) {
      return "The ID is located in the URL between /d/ and /edit.";
    }

    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialChars.test(newIdentifier)) {
      return "Invalid identifier. No special characters allowed.";
    }

    return null; // No errors
  };

  if (sheetIdentifier === "error" || typeof sheetIdentifier !== "string") {
    return (
      <div>
        <p>
          Enter a sheet identifier. This can be the ID of the sheet or the
          entire URL.
        </p>
        <input
          type="text"
          value={newIdentifier}
          onChange={(e) => setNewIdentifier(e.target.value)}
        />
        <button onClick={replaceIdentifier}>Add New Identifier</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <button onClick={toggleIdentifierView}>
          {viewIdentifier ? "Hide Identifier" : "View Identifier"}
        </button>

        <button onClick={toggleShowInput}>
          {showNewIdentifierInput ? "Hide Input" : "Add New Identifier"}
        </button>
      </div>

      {showNewIdentifierInput && (
        <div className="flex flex-col">
          <div className="flex flex-row">
            <input
              type="text"
              value={newIdentifier}
              onChange={(e) => setNewIdentifier(e.target.value)}
            />
            <button onClick={replaceIdentifier}>Add New Identifier</button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}

      {viewIdentifier && (
        <div className="flex flex-col">
          <h2>Sheet Identifier</h2>
          <p>{sheetIdentifier}</p>
        </div>
      )}
    </div>
  );
};

export default IdentifierSettings;

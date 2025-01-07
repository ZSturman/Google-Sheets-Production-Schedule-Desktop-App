import { useState } from "react";
import { useCredentials } from "../../context/CredentialProvider";

const IdentifierSettings = () => {
  const { sheetIdentifier, addIdentifier } = useCredentials();
  const [newIdentifier, setNewIdentifier] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateIdentifier = () => {
    if (newIdentifier.trim() === "") {
      return "The identifier cannot be empty.";
    }
    if (newIdentifier.includes("https")) {
      return "Please use only the ID, not the full URL.";
    }
    return null;
  };

  const replaceIdentifier = async () => {
    const validationError = validateIdentifier();
    if (validationError) {
      setError(validationError);
      return;
    }
    await addIdentifier(newIdentifier.trim());
    setNewIdentifier("");
    setError(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Sheet Identifier Settings</h2>
      {sheetIdentifier ? (
        <div>
          <p className="text-gray-700">
            Current Sheet Identifier: <span className="font-mono">{sheetIdentifier}</span>
          </p>
        </div>
      ) : (
        <p className="text-red-600">No sheet identifier set. Please add one.</p>
      )}

      <div className="space-y-2">
        <input
          type="text"
          className="border border-gray-300 rounded w-full p-2"
          placeholder="Enter sheet identifier..."
          value={newIdentifier}
          onChange={(e) => setNewIdentifier(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={replaceIdentifier}
        >
          Save Identifier
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default IdentifierSettings;
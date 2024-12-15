import { invoke } from "@tauri-apps/api/core";

export const createGoogleSheetWithHeaders = async (
    credentialsPath: string,
    sheetIdentifier: string,
    newSheetName: string,
    headers: string[]
  ): Promise<void> => {
    try {
      if (!headers || headers.length === 0) {
        throw new Error("Headers array is empty or invalid.");
      }
  
      await invoke("create_sheet_with_headers", {
        newSheetName,
        privKeyPath: credentialsPath,
        sheetId: sheetIdentifier,
        headers,
      });
  
      console.log(`New sheet "${newSheetName}" created successfully with headers.`);
    } catch (error) {
      console.error("Error creating new sheet with headers:", error);
    }
  };
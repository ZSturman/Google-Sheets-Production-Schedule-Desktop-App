import { invoke } from "@tauri-apps/api/core";

export const updateGoogleSheetData = async (
  credentialsPath: string,
  sheetIdentifier: string,
  selectedTab: TabOption,
  googleSheetData: (string | null)[][]
) => {

  console.log("googleSheetData", googleSheetData);  
  try {
    if (!googleSheetData || googleSheetData.length === 0) {
      throw new Error("Google Sheets data is empty or invalid.");
    }

    await invoke("update_data", {
      sheetName: selectedTab.googleSheetName,
      privKeyPath: credentialsPath,
      sheetId: sheetIdentifier,
      values: googleSheetData,
    });

    console.log(
      `Google Sheets successfully updated for ${selectedTab.googleSheetName}.`
    );
  } catch (error) {
    console.error("Error updating Google Sheets:", error);
  }
};





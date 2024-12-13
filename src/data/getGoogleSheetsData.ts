import { invoke } from "@tauri-apps/api/core";

const fetchGoogleSheetsData = async (
  credentialsPath: string,
  sheetIdentifier: string,
  selectedTab: TabOption,
): Promise<string[][]> => {

  try {
    // Invoke the backend command to fetch data
    const response = await invoke<string>("get_values", {
      sheetName: selectedTab.googleSheetName, 
      privKeyPath: credentialsPath,
      sheetId: sheetIdentifier,
    });

    // Parse the JSON response into a 2D array
    const data = JSON.parse(response) as string[][];

    return data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching Google Sheet data:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

export default fetchGoogleSheetsData;

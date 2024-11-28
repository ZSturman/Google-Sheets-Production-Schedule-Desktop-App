import { invoke } from "@tauri-apps/api/core";

const getGoogleSheetData = async (
  credentialsPath: string,
  sheetIdentifier: string,
  selectedTab: TabOption,
  addMessage: (message: Message) => void
): Promise<string[][]> => {
  try {
    // Invoke the backend command to fetch data
    const response = await invoke<string>("get_values", {
      sheetName: selectedTab.googleSheetName, // Matches backend's argument name
      privKeyPath: credentialsPath,
      sheetId: sheetIdentifier,
    });

    // Parse the JSON response into a 2D array
    const data = JSON.parse(response) as string[][];

    // Notify success
    addMessage({
      type: "success",
      message: "Successfully fetched Google Sheet data",
      timestamp: new Date(),
    });

    return data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching Google Sheet data:", error);

    // Notify error
    addMessage({
      type: "error",
      message: "Error fetching Google Sheet data",
      timestamp: new Date(),
    });

    throw error; // Rethrow the error for the caller to handle
  }
};

export default getGoogleSheetData;

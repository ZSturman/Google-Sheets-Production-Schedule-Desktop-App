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

// export const updateGoogleSheetData = async (
//   credentialsPath: string,
//   sheetIdentifier: string,
//   selectedTab: TabOption,
//   addMessage: (message: Message) => void,
//   googleSheetData: (string | null)[][] // Prepared data for Google Sheets
// ) => {
//   try {
//     console.log("Selected tab:", selectedTab);
//     console.log("Prepared Google Sheets data:", googleSheetData);

//     if (googleSheetData.length === 0 || googleSheetData[0].length === 0) {
//       console.error("Invalid Google Sheets data prepared:", googleSheetData);
//       addMessage({
//         type: "error",
//         message: "Invalid Google Sheets data prepared.",
//         timestamp: new Date(),
//       });
//       return;
//     }

//     // Invoke Tauri command to update Google Sheets
//     await invoke("update_data", {
//       sheetName: selectedTab.name,
//       privKeyPath: credentialsPath,
//       sheetId: sheetIdentifier,
//       values: googleSheetData,
//     });

//     console.log("Google Sheets successfully updated.");
//     addMessage({
//       type: "success",
//       message: "Google Sheets successfully updated.",
//       timestamp: new Date(),
//     });
//   } catch (error) {
//     console.error("Error updating Google Sheets:", error);
//     addMessage({
//       type: "error",
//       message: "Error updating Google Sheets.",
//       timestamp: new Date(),
//     });
//   }
// };

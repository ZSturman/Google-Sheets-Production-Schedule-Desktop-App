use google_sheets4::api::ClearValuesRequest;
use google_sheets4::oauth2::{self, authenticator::Authenticator};
use google_sheets4::{api::ValueRange, hyper, hyper_rustls, Sheets};
use hyper_rustls::HttpsConnector;
use serde::{Deserialize, Serialize};
use tokio::runtime::Runtime;

#[derive(Serialize, Deserialize)]
struct Config {
    priv_key_path: String,
    sheet_id: String,
}

fn http_client() -> hyper::Client<HttpsConnector<hyper::client::HttpConnector>> {
    hyper::Client::builder().build(
        hyper_rustls::HttpsConnectorBuilder::new()
            .with_native_roots()
            .https_only()
            .enable_http1()
            .enable_http2()
            .build(),
    )
}

async fn auth(
    priv_key_path: &str,
    client: hyper::Client<HttpsConnector<hyper::client::HttpConnector>>,
) -> Result<Authenticator<HttpsConnector<hyper::client::HttpConnector>>, String> {
    println!("Reading service account key from path: {}", priv_key_path);
    let secret = oauth2::read_service_account_key(priv_key_path)
        .await
        .map_err(|e| format!("Failed to read service account key: {}", e))?;
    println!("Service account key read successfully.");

    let auth = oauth2::ServiceAccountAuthenticator::with_client(secret, client)
        .build()
        .await
        .map_err(|e| format!("Failed to create authenticator: {}", e))?;
    println!("Authenticator created successfully.");

    Ok(auth)
}

#[tauri::command]
fn update_data(
    sheet_name: String,
    priv_key_path: String,
    sheet_id: String,
    values: Vec<Vec<String>>,
) -> Result<String, String> {
    println!("Received data: {:?}", values); // Debug log
    let rt = Runtime::new().map_err(|e| e.to_string())?;

    rt.block_on(async {
        let client = http_client();
        let auth = auth(&priv_key_path, client.clone()).await.map_err(|e| e.to_string())?;
        let hub = Sheets::new(client, auth);

        let value_range = ValueRange {
            range: Some(format!("{}!A:Z", sheet_name)),
            major_dimension: Some("ROWS".to_string()),
            values: Some(values),
        };

        hub.spreadsheets()
            .values_clear(ClearValuesRequest::default(), &sheet_id, &format!("{}!A:Z", sheet_name))
            .doit()
            .await
            .map_err(|e| format!("Failed to clear sheet: {}", e))?;

        hub.spreadsheets()
            .values_update(value_range, &sheet_id, &format!("{}!A:Z", sheet_name))
            .value_input_option("USER_ENTERED")
            .doit()
            .await
            .map_err(|e| format!("Failed to update sheet: {}", e))?;

        Ok("Worksheet updated successfully.".to_string())
    })
}

#[tauri::command]
fn get_values(
    sheet_name: String,
    priv_key_path: String,
    sheet_id: String,
) -> Result<String, String> {
    println!("Initializing Tokio runtime...");
    let rt = Runtime::new().map_err(|e| {
        println!("Failed to create runtime: {}", e);
        e.to_string()
    })?;
    println!("Runtime created successfully");

    rt.block_on(async {
        println!("Initializing HTTP client and authenticator.");
        let client = http_client();

        // Pass in priv_key_path for dynamic authentication
        let auth = match auth(&priv_key_path, client.clone()).await {
            Ok(auth) => auth,
            Err(e) => {
                println!("Authentication failed: {}", e);
                return Err("Failed to authenticate".to_string());
            }
        };

        let hub = Sheets::new(client, auth);

        let range = format!("{}!A:Z", sheet_name);
        println!("Attempting to retrieve values from sheet range: {}", range);

        // Attempt to retrieve values from Google Sheets
        let result = match hub
            .spreadsheets()
            .values_get(&sheet_id, &range)
            .doit()
            .await
        {
            Ok(result) => {
                println!("Values retrieved successfully from Google Sheets.");
                result
            }
            Err(e) => {
                println!("Failed to retrieve values from Google Sheets: {}", e);
                return Err("Error fetching data from Google Sheets".to_string());
            }
        };

        // Extract values from the API response
        let values = result.1.values.unwrap_or_default();

        // Serialize the data into JSON and return it
        serde_json::to_string(&values).map_err(|e| {
            println!("Error serializing data to JSON: {}", e);
            e.to_string()
        })
    })
}


#[tauri::command]
fn test_auth(priv_key_path: String, sheet_id: String) -> Result<Vec<String>, String> {
    let rt = Runtime::new().map_err(|e| e.to_string())?;
    rt.block_on(async {
        let client = http_client();

        // Authenticate using the provided private key path
        let auth = match auth(&priv_key_path, client.clone()).await {
            Ok(auth) => auth,
            Err(e) => return Err(format!("Authentication failed: {}", e)),
        };

        let hub = Sheets::new(client, auth);

        // Fetch spreadsheet metadata to retrieve sheet names
        match hub.spreadsheets().get(&sheet_id).doit().await {
            Ok((_, spreadsheet)) => {
                if let Some(sheets) = spreadsheet.sheets {
                    let sheet_names: Vec<String> = sheets
                        .into_iter()
                        .filter_map(|sheet| sheet.properties)
                        .filter_map(|props| props.title)
                        .collect();
                    Ok(sheet_names)
                } else {
                    Err("No sheets found in the spreadsheet.".to_string())
                }
            }
            Err(e) => Err(format!("Failed to retrieve spreadsheet details: {}", e)),
        }
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_values, update_data, test_auth])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
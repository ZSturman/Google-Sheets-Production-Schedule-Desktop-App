# Production Scheduling Desktop App

Production Scheduling Desktop App leverages Google Sheets as a database to streamline production scheduling with cross-platform support, interactive Gantt charts, and role-based access control.

## Overview
This app streamlines production scheduling by managing all schedule information in one Google Sheet and displaying progress with interactive Gantt charts.

## Features
- **Cross-Platform:** Runs on macOS, Windows, and Linux.
- **Google Sheets Integration:** No additional database needed.
- **Scheduling & Gantt Charts:** Auto generates visual timelines.
- **Secure Authentication:** Uses a secure JSON key from Google Cloud.
- **User Role Management:** Customizes view and access based on roles.
- **Flexibility:** Minimal UI with optional extensions.


## Installation & Setup

1. Download the Application 

    - This application is designed for company-specific use, with builds available on their hardware. However, the source code is fully open for anyone to use and modify.
    - To get started, clone the repository, install the dependencies, and build the app following the instructions below.
    - To customize the app for your specific needs:
        - Edit src/data/tabs.tsx to adjust the tabs configuration to match your Google Sheet columns.
        - Modify src/data/defaults.tsx to align with your data. These changes will update how initial Google Sheets are generated and structured in the app.

2. Obtain Google Sheets Credentials

    - Follow the instructions below in Managing Your Google Sheets Credentials to get a .json file from Google Cloud.
    - Drag and drop that file into the app or paste its contents into the appropriate screen.

3. Enter Spreadsheet ID

    - Inside the app, once credentials are loaded, provide the ID of the Google Spreadsheet you want to use.
    - Ensure that the service account email address (found in your .json file) has permission to edit the Google Sheet.

4. Start Scheduling

    - The app will load your Sheet data, show you a table of jobs, and generate Gantt charts.

That’s it. You can now view and manage your production schedule.


## Developer Setup Instructions
**Prerequisites:** Node.js (16+), Yarn/npm, and the Rust toolchain.

Clone the repository

```bash
git clone https://github.com/ZSturman/rods-sheets_v2.git
```

Install dependencies

``` bash
npm install
```

Build the app

```     bash
npm run tauri build
```

Run in development mode

``` bash
npm run tauri dev
```

_Edit the React frontend in the src directory or adjust Tauri configuration in tauri.conf.json as needed._

## Project Structure
- **src-tauri:** Rust-based backend for the desktop wrapper.
- **src:** React frontend for the user interface.

## Using the App
- View, edit, and filter production jobs.
- See real-time updates in Gantt charts.
- Export Gantt charts as images or PDFs.

## Managing Google Sheets Credentials
1. Visit Google Cloud Console.
2. Create/select a project and enable the Google Sheets API.
3. Create a service account and download the JSON key.
4. Securely import the key to the app.

## Work Centers & Schedules
The app groups production jobs by work center for easy filtering and tracking.

## Further Customization
- Add custom columns for extra job details.
- Modify Gantt chart behavior.
- Implement additional user roles and permissions.
- Enhance the UI with new components.

## Contributing
- Fork the repository and create a new branch.
- Make your changes, test them, and submit a pull request following our code style.
- Be respectful and constructive.

## License
This project is licensed under the MIT License. 

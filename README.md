# Rod's Sheets

## A production scheduling tool for a small manufacturing company that produces custom products. This app connecting to Google Sheets to manage orders, products, and production schedules.

### Description

This app is a production scheduling tool for a small manufacturing company that produces custom products. It connects to Google Sheets to manage orders, products, and production schedules. The app is built with React and Tauri. The app uses Google Sheets as a database to store orders, products, and production schedules. The app uses the Google Sheets API to read and write data to the Google Sheets.

### Features

- **Dashboard**: A summary of the current production schedule.
- **Orders**: A list of all orders.
- **Products**: A list of all products.
- **Schedule**: A list of all scheduled production.
- **Settings**: A list of all settings.

### To Do

- Eventually I want the ability to have more custimizable settings for users with different needs.
- I want to add the ability to have multiple users with different permissions.
- I want to add the ability to have multiple production schedules.
- I want to add the ability to have multiple production lines.
- The gantt chart functionality is not very good. I want to improve it.
- The state management isn't handled great yet and the feedback to the user when things are being pusbed to the Google Sheet is not great. I want to improve this.

### Installation

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Run `npm run tauri dev` to start the app.
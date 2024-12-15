import React from "react";

const GoogleSheetsSetup: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 font-sans">
      <h1 className="text-2xl font-bold text-center mb-6">
        Google Sheets Setup Guide
      </h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">Step 1: Create a Google Account</h2>
          <p className="text-gray-700">
            If you don’t already have a Google account, visit{" "}
            <a
              href="https://accounts.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Google Accounts
            </a>{" "}
            and click "Create account."
          </p>
          <p className="text-gray-700">Follow the instructions to set up your account.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Step 2: Create a Google Sheet</h2>
          <p className="text-gray-700">
            Go to{" "}
            <a
              href="https://sheets.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Google Sheets
            </a>{" "}
            and create a new spreadsheet by clicking the "+" button.
          </p>
          <p className="text-gray-700">
            Once the spreadsheet is open, copy the Spreadsheet ID from the URL.
            The ID is the long string of characters between <code>/d/</code> and{" "}
            <code>/edit</code> in the URL.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Step 3: Create a Google Cloud Project</h2>
          <p className="text-gray-700">
            Go to the{" "}
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Google Cloud Console
            </a>{" "}
            and create a new project.
          </p>
          <p className="text-gray-700">
            Click the project dropdown at the top and select "New Project." Enter a project
            name and click "Create."
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Step 4: Enable the Google Sheets API</h2>
          <p className="text-gray-700">
            In the Google Cloud Console, navigate to "APIs & Services" {'>'} "Library."
          </p>
          <p className="text-gray-700">
            Search for "Google Sheets API" and click on it. Then click "Enable" to activate
            the API for your project.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Step 5: Create Service Account Credentials</h2>
          <p className="text-gray-700">
            Go to "APIs & Services" {'>'} "Credentials" and click "Create Credentials." Select
            "Service Account."
          </p>

          <p className="text-gray-700">If it asks you what data you will be accessing, select "Application"</p>

          <p className="text-gray-700">
            Provide a name for the service account and follow the prompts. For the role,
            select "Editor," then click "Continue" and "Done."
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Step 6: Download the Credentials JSON</h2>
          <p className="text-gray-700">
            Click on the 'Credentials' tab or go back to the "Credentials" page in the Google Cloud Console. Click on the
            service account you just created.
          </p>
          <p className="text-gray-700">
            Navigate to the "Keys" tab, then click "Add Key" {'>'} "Create New Key." Choose
            "JSON" and click "Create." A file will download automatically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            Step 7: Share the Spreadsheet with the Service Account
          </h2>
          <p className="text-gray-700">
            Open your Google Sheet and click the "Share" button in the top-right corner.
          </p>
          <p className="text-gray-700">
            Enter the service account's email address (found in the `credentials.json` file
            under the `client_email` field). Grant "Editor" permissions and click "Send."
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">You're Done!</h2>
          <p className="text-gray-700">
            You’ve successfully set up Google Sheets, enabled the API, and downloaded the
            `credentials.json` file. You can now use these credentials to interact with your
            spreadsheet programmatically.
          </p>
        </section>
      </div>
    </div>
  );
};

export default GoogleSheetsSetup;
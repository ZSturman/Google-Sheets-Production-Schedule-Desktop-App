import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CredentialsProvider } from "./context/CredentialProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
<CredentialsProvider>

    <App />
</CredentialsProvider>
  </React.StrictMode>,
);

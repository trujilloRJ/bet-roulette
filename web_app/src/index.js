import React from "react";
import ReactDOM from "react-dom/client";
import { MetaMaskProvider } from "@metamask/sdk-react";
import "./index.css";
import DApp from "./DApp";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <MetaMaskProvider
      debug={true}
      sdkOptions={{
        dappMetadata: {
          name: "Example React Dapp",
          url: window.location.href,
        },
        infuraAPIKey: process.env.INFURA_API_KEY,
      }}
    >
      <DApp />
    </MetaMaskProvider>
  </React.StrictMode>
);

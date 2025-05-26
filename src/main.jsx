import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ContextProvider } from "./context.jsx"; // adjust path as needed
import "./index.css"; // your styles

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./global.css"; // Import global CSS
import { UserProvider } from "./context/userContext";

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

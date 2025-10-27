import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { store } from "./app/store.js";
import { ThemeProvider } from "./theme/ThemeProvider.jsx";
import { restoreAuthFromStorage } from "./features/auth/authSlice.js";
import "./styles/index.css";

// Restore auth state from localStorage before rendering
store.dispatch(restoreAuthFromStorage());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./Store";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MeetingProvider } from "./Context/MeetingContext";
import axios from "axios";
import Cookies from "js-cookie";

// A central admin can suspend a hospital for non-payment. Any API call then fails with this code:
// end the session and send the user to the sign-in page, which shows why access was blocked.
let redirectingBlocked = false;
axios.interceptors.response.use(undefined, (error) => {
  if (error.response?.data?.errorCode === "TENANT_ACCESS_BLOCKED") {
    if (!redirectingBlocked) {
      redirectingBlocked = true;
      ["Token", "UserId", "TenantId"].forEach((c) => Cookies.remove(c));
      localStorage.removeItem("admin_profile");
      localStorage.removeItem("location_profiles");
      const url = new URL(process.env.REACT_APP_SIGNIN_URL);
      url.searchParams.set("blocked", error.response.data.message || "Access to this hospital has been blocked.");
      window.location.replace(url.toString());
    }
    // Never settle, so callers don't navigate to /unauthorized while the page unloads.
    return new Promise(() => {});
  }
  return Promise.reject(error);
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
    <MeetingProvider>
      <React.StrictMode>
        <App />
        <Toaster position="top-center"/>
      </React.StrictMode>
    </MeetingProvider>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import firebase from "firebase/app";

firebase.initializeApp({
  apiKey: "AIzaSyB5iTtInHkXqPURj70aaomd2lWjeg2ns_k",
  authDomain: "connected-dating.firebaseapp.com",
  projectId: "connected-dating",
  storageBucket: "connected-dating.appspot.com",
  messagingSenderId: "809089558667",
  appId: "1:809089558667:web:c5301a51fba107f7ac8c8e",
  measurementId: "G-PZFYZDW5N2",
});
// firebase.analytics(); TODO: uncomment if analytics are desired

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

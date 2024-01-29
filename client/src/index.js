import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";
import { hydrate, render } from "react-dom";

//ReactDOM.render(<App />, document.getElementById("root"));
//import { hydrate, render } from "react-dom";
const APP = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(APP, rootElement);
} else {
  render(APP, rootElement);
}

//correct code
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

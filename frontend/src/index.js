import "bootstrap/dist/css/bootstrap.css";
import "./bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store";
import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

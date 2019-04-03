import React from "react";
import ReactDOM from "react-dom";
import "./i18n";
import App from "./App";
import { ErrorBoundary, GlobalError } from "./components";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <ErrorBoundary
    component={(error, info) => <GlobalError error={error} info={info} />}
  >
    <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossOrigin="anonymous"
    />
    <App />
  </ErrorBoundary>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

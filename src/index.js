import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./components/App";
import configureStore from "./store";
import GlobalStyles from "./styles/globals";

const renderApp = () => {
  const store = configureStore({});

  if (process.env.NODE_ENV !== "production") {
    console.log("Initial state =>");
    console.log(store.getState());
  }

  ReactDOM.render(
    <Provider store={store}>
      <div>
        <GlobalStyles />
        <App />
      </div>
    </Provider>,
    document.getElementById("root")
  );
};

renderApp();

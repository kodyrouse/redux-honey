import React from "react";
import { Provider } from "react-redux";

const HoneyProvider = store => ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
)

export default HoneyProvider;
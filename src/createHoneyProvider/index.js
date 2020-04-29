import React from "react";
import { Provider } from "react-redux";

export default store => ({ children }) => {
  return React.createElement(Provider, { store }, children)
}

import { connect } from "react-redux";

export default store => (extractFunction, Component) => {

  if (typeof extractFunction !== "function")
    return console.warn("Redux-Honey: \n the given method passed to extract was not a function. Please ensure the first parameter used in the extract method is a function");

  const propsToReturn = extractFunction(store.getState());

  Object.keys(propsToReturn).forEach(key => {
    if (typeof propsToReturn[key] === "undefined") {
      console.warn(`Redux-Honey: \n You attempted to extract a value for the key "${key}" for the component ${Component.name} but it returned undefined`);
    }
  });

  return connect(extractFunction)(Component);
}
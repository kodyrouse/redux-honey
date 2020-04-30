import { connect } from "react-redux";

export default store => (extractFunction, Component) => {

  if (typeof extractFunction !== "function")
    return console.warn("Redux-Honey: \n the given method passed to extract was not a function. Please ensure the first parameter used in the extract method is a function");

  if (!store) {
    console.error("Redux-Honey: \n Unable to call the extract method because the store was not set yet. Please ensure you're wrapping your application in <HoneyProvider></HoneyProvider> as well as ensure that your store is imported before your main application");
    return Component
  }

  const propsToReturn = extractFunction(store.getState());

  Object.keys(propsToReturn).forEach(key => {
    if (typeof propsToReturn[key] === "undefined") {
      console.warn(`Redux-Honey: \n You attempted to extract a value for the key "${key}" for the component ${Component.name} but it returned undefined`);
    }
  });

  return connect(extractFunction)(Component);
}
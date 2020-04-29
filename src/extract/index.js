import { connect } from "react-redux";

export default (extractFunction, Component) => {

  if (typeof extractFunction !== "function")
    return console.warn("Redux-Honey: \n the given method passed to extract was not a function. Please ensure the first parameter used in the extract method is a function");

  return connect(store => {

    const propsToReturn = extractFunction(store);

    Object.keys(propsToReturn).forEach(key => {
      if (typeof propsToReturn[key] === "undefined") {
        console.warn(`Redux-Honey: \n You attempted to extract a value for the key "${key}" but it does not exist`);
        console.warn(`Redux-Honey: \n The following extract() method failed for the component ${Component.name}: ${extractFunction}`);
      }
    })

    return propsToReturn;

  })(Component);
}
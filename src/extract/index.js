import { connect } from "react-redux";

export default (extractFunction, Component) => {

  if (typeof extractFunction !== "function")
    return console.warn("Redux-Honey: \n the given method passed to extract was not a function. Please ensure the first parameter used in the extract method is a function");

  return connect(store => {

    const propsToPass = extractFunction(store);

    Object.keys(propsToPass).forEach(key => {
      if (typeof propsToPass[key] === "undefined")
        console.warn(`Redux-Honey: \n the key ${key} returned in the extract method doesn't exist on the given state`);
    })

  })(Component);
}
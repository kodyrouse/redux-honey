import React from "react";
import createReactClass from "create-react-class";
import isEqual from "react-fast-compare";
import log from "../utils/log";

export default (store, typeSafe) => (mapHoneyToProps, WrappedComponent) => {

  if (typeof mapHoneyToProps !== "function") {
    log.warn(`The given mapHoneyToProps for component <${WrappedComponent.name}> was not a function. Please ensure the first parameter used in the extract method is a function`);
    return WrappedComponent;
  }

  if (typeSafe)
    validateHoneyRequested(mapHoneyToProps, WrappedComponent.name)

  return createReactClass({

    subscribedState: {},
    __isMounted: false,
    __forceUpdateOnMount: false,

    getInitialState: function() {
      this.subscribedState = mapHoneyToProps(store.getState());
      this.unsubscribe = store.subscribe(this.handleStoreChange);
      if (!typeSafe) validateHoneyRequested(mapHoneyToProps, WrappedComponent.name)
      return null;
    },

    handleStoreChange: function() {
      if (this.shouldUpdate()) {
        if (this.__isMounted)
          this.forceUpdate();
        else
          this.__forceUpdateOnMount = true;
      }
    },

    shouldUpdate: function() {

      try {

        const updatedSubscribedState = mapHoneyToProps(store.getState());

        if (!isEqual(this.subscribedState, updatedSubscribedState)) {
          this.subscribedState = updatedSubscribedState;
          return true;
        }
      } catch(error) {
        log.error(`extract() failed for the component <${WrappedComponent.name}>. This likely happened because your mapHoneyToProps was trying to access properties on an object that was set to null. To avoid this, it's best to set it to an empty object`);
        console.error(error);
      }

      return false;
    },

    componentDidMount: function() {
      this.__isMounted = true;
      if (this.__forceUpdateOnMount) {
        this.__forceUpdateOnMount = false;
        this.forceUpdate();
      }
    },
    
    componentWillUnmount: function() {
      this.unsubscribe();
      this.__isMounted = false;
    },

    render: function() {
      return (
        React.createElement(WrappedComponent, Object.assign({}, this.props, this.subscribedState))
      )
    }
  })
}


const validateHoneyRequested = (mapHoneyToProps, componentName) => {

  try {
    const honeyRequested = mapHoneyToProps(window.statesTypeMap);
    const honeyKeys = Object.keys(honeyRequested);
    const failedExtractedKeys = [];

    for (let i = 0; i < honeyKeys.length; i++) {

      const key = honeyKeys[i];
      if (typeof honeyRequested[key] === "undefined")
        failedExtractedKeys.push(`"${key}"`);
    }

    if (failedExtractedKeys.length)
      throw new Error(`Component <${componentName}> is attempting to extract the following keys from state but returned undefined: ${failedExtractedKeys.join(", ")}`)
  } catch(error) {
    log.error(error);
  }
}

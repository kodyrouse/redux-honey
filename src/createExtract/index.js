import React from "react";
import createReactClass from "create-react-class";
import isEqual from "react-fast-compare";
import log from "../utils/log";

export default store => (mapHoneyToProps, WrappedComponent) => {

  if (typeof mapHoneyToProps !== "function") {
    log.warn(`the given mapHoneyToProps for component <${WrappedComponent.name}> was not a function. Please ensure the first parameter used in the extract method is a function`);
    return WrappedComponent;
  }

  return createReactClass({

    subscribedState: {},

    getInitialState: function() {
      this.subscribedState =  mapHoneyToProps(store.getState());
      return null;
    },

    validateInitialSubscribedState: function() {

      const honeyRequested = mapHoneyToProps(store.getState());

      Object.keys(honeyRequested).forEach(key => {
        if (typeof honeyRequested[key] === "undefined") {
          log.warn(`You attempted to extract a value for the key "${key}" for the component <${WrappedComponent.name}> but it returned undefined`);
        }
      });
    },

    handleStoreChange: function() {
      if (this.shouldUpdate()) {
        this.forceUpdate();
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
        log.error(`extract() failed for the component <${WrappedComponent.name}>. This happened because your mapHoneyToProps was trying to access properties on an object that was set to null. To avoid this, it's best to set it to an empty object`);
        console.error(error);
      }

      return false;
    },

    componentDidMount: function() {
      this.subscribedState = mapHoneyToProps(store.getState());
      this.unsubscribe = store.subscribe(this.handleStoreChange);
      this.validateInitialSubscribedState();
    },
    
    componentWillUnmount: function() {
      this.unsubscribe();
    },

    render: function() {
      return (
        React.createElement(WrappedComponent, Object.assign({}, this.props, this.subscribedState))
      )
    }
  })
}


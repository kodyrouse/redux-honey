import React from "react";
import createReactClass from "create-react-class";
import isEqual from "react-fast-compare";

export default store => (mapHoneyToProps, WrappedComponent) => {

  if (typeof mapHoneyToProps !== "function") {
    console.warn(`Redux-Honey: \n the given mapHoneyToProps for component <${WrappedComponent.name}> was not a function. Please ensure the first parameter used in the extract method is a function`);
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
          console.warn(`Redux-Honey: \n You attempted to extract a value for the key "${key}" for the component <${WrappedComponent.name}> but it returned undefined`);
        }
      });
    },

    handleStoreChange: function() {
      if (this.shouldUpdate())
        this.forceUpdate();
    },

    shouldUpdate: function() {

      const updatedSubscribedState = mapHoneyToProps(store.getState());

      if (!isEqual(this.subscribedState, updatedSubscribedState)) {
        this.subscribedState = updatedSubscribedState;
        return true;
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
        React.createElement(WrappedComponent, { ...this.props, ...this.subscribedState })
      )
    }
  })
}


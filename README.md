# Redux-Sugar
A super lightweight, fast plugin that makes it *a lot* sweeter to work with advanced redux 🥰

## Some Benefits To Redux-Sugar
- Reduces unnecessary file clutter (AKA the fun and famous *redux boilerplate*)
- No need for top-file action types like **WHY_AM_I_YELLING**
- No need to create ugly switch case statements to handle store updates
- Built-in abilities to ```resetState``` and ```resetStoreToInitialState```

# Installation

<!-- prettier-ignore -->
```
// With npm
npm i redux-sugar

// Or with yarn
yarn add redux-sugar
```

# Usage

## Initialize
Pass your store into redux-sugar when creating your store:

```
import { createStore, combineReducers } from "redux";
import { sugarcoatStore } from "redux-sugar";
import funWithReduxSugarReducer from "./funWithReduxSugarReducer";

const combinedReducers = combineReducers({
	funWithReduxSugarReducer
});

const store = createStore(combinedReducers);
sugarcoatStore(store);
export default store;
```

## addSugar(stateKey, initialState)

Call ```addSugar()``` to create a new piece of state

### Arguments
- **stateKey** *(required)* - unique string. The filename / reducer name is recommended for debugging purposes
- **initialState** *(required)* - object that defines the stucture of this piece of your store

### Returns
- **reducer** - function - never called directly. Export out of the file to pass into *combineReducers()*
- **updateState** - function - used to update *this* piece of state only
- **getState** - function - used to get state from *this* piece of state only
- **resetState** - function - used to reset *this* piece of state back to the original *initialState* that was passed when calling ```addSugar()```

Example:
```
// This is what funWithReduxSugarReducer.js would look like

import { addSugar } from "redux-sugar";

// The initialState for this piece of state
const initialState = {
	loveProgramming: false,
	favPlugin: "redux-sugar"
};

// addSugar() returns an object with its reducer and 3 methods - updateState(), getState(), and resetState()
const { reducer, updateState, getState, resetState } = addSugar("funWithReduxSugar", initialState);
export default reducer;
```

## updateState(payload)

Call ```updateState()``` to update the state

### Arguments
- **payload** *required* - object - the object that defines the changes you want to make to your store. You can pass one or more key-value pairs to update your state

Example:

```
import { addSugar } from "redux-sugar";

// The initialState for this piece of state
const initialState = {
	loveProgramming: false,
	favPlugin: "redux-sugar",
	stateHasBeenUpdated: false
};

// addSugar() returns an object with its reducer and 3 methods - updateState(), getState(), and resetState()
const { reducer, updateState, getState, resetState } = addSugar("funWithReduxSugar", initialState);
export default reducer;

// Called 
const updateFavPlugin = (selectedFavPlugin) => {

	updateState({ favPlugin: selectedFavPlugin, stateHasBeenUpdated: true });
}
```

#### Side Note
As a safety check, you can't set keys that don't exist on the initialState when calling ```updateState()```. This prevents you from accidentally mispelling a key when trying to **updateState()**. It also prevents you from needing to bash your head against the wall when you didn't realize you spelled it ```favPlugim```;

```
// This entire call would fail because isGoingToFailToUpdate was not defined on the initialState
updateState({ stateHasBeenUpdated: true, isGoingToFailToUpdate: true });
```


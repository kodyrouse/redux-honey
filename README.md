# Redux-Sugar
A lightweight, fast plugin that makes it a lot sweeter to work with advanced redux 🥰

## Some Benefits To Redux-Sugar
- Reduces unnecessary file clutter (*AKA the infamous redux boilerplate*). It reduced my entire store file sizes by 45%!
- No need for top-file action types like WHY_AM_I_YELLING
- No need to create ugly switch case statements to handle store updates
- Built-in ability to to ```resetState``` or ```resetStoreToInitialState```

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
Pass your store into redux-sugar when creating your store like so:

```
import { createStore, combineReducers } from "redux";
import { sugarcoatStore } from "redux-sugar";
import funWithReduxSugar from "./funWithReduxSugar";

const combinedReducers = combineReducers({
	funWithReduxSugar
});

const store = createStore(combinedReducers);
sugarcoatStore(store);
export default store;
```

## addSugar(stateKey, initialState)

### Arguments
- **stateKey** *required* - unique string. The filename / reducer name is recommended
- **initialState** *required* - object that defines the stucture of this piece of your store

### Returns
- **reducer** - function - never called directly. export out of the file to pass into *combineReducers()*
- **updateState** - function - used to update *this* piece of state only
- **getState** - function - used to get state from *this* piece of state only
- **resetState** - function - used reset this piece of state back to the passed *initialState*

Example:
```
import { addSugar } from "redux-sugar";

// The initialState for this piece of state
const initialState = {
	isReduxFun: false,
	favLibrary: ""
};

// addSugar() returns an object with its reducer and 3 methods - updateState(), getState(), and resetState()
const { reducer, updateState, getState, resetState } = addSugar("funWithReduxSugar", initialState);
export default reducer;
```

## updateState(payload)

### Arguments
- **payload** *required* - object - the object that defines the changes you want to make to your store

As a safety check, you can't set keys that don't exist on the initialState. This prevents you from accidentally mispelling a key while calling **updateState()**.


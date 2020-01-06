# 🍯 Redux-Honey 🍯
A simple, fast plugin that makes it *a lot* sweeter to work with advanced redux 🥰

# Problems With Plain Redux
In a lot of ways, redux is *fantastic* at what it does! As your application starts to scale though, your files become *littered* with unnecessary boilerplate code and complicated craziness. It makes it difficult to maintain and read, which hurts my soul. This is where ```redux-honey``` comes to the rescue 🙌

# Benefits To Using Redux-Honey
- Reduces unnecessary file clutter (AKA the heartwarming *redux boilerplate*)
- No need for top-file action types like **WHY_AM_I_YELLING** or ugly switch case statements
- Built-in abilities to ```resetState``` and ```resetStoreToInitialState```
- Allows for simplier usage of asynchronous updates with ```wait()```, removing the need for middleware like ```redux-thunk``` and ```redux-saga```

# Installation

```js
// With npm
npm i redux-honey

// Or with yarn
yarn add redux-honey
```

# Usage

## Initialize
Pass your store into ```createHoneyPot``` at creation:

```js
import { createStore, combineReducers } from "redux";
import { createHoneyPot } from "redux-honey";
import funWithReduxHoneyReducer from "./funWithReduxHoneyReducer";

const combinedReducers = combineReducers({
 funWithReduxHoneyReducer
});

const store = createStore(combinedReducers);

// Pass your store into createHoneyPot to add the magic
createHoneyPot(store);

export default store;
```

## addHoney(stateKey, initialState)

Call ```addHoney(stateKey, initialState)``` to create a new piece of state

### Arguments
- **stateKey** *(required)* - unique string. The file/reducer name is recommended for debugging purposes
- **initialState** *(required)* - object that defines the stucture of this piece of your store

### Returns
- **reducer** - *(function)* - never called directly. Export out of the file to pass into *combineReducers()*
- **updateState** - *(function)* - used to update *this* piece of state only
- **getState** - *(function)* - used to get state from *this* piece of state only
- **resetState** - *(function)* - used to reset *this* piece of state back to the original *initialState* that was passed when calling ```addHoney()```

Example:
```js
// This is funWithReduxHoneyReducer.js

import { addHoney } from "redux-honey";

// The initialState for this piece of state
const initialState = {
 loveProgramming: false,
 favPlugin: "redux-honey"
};

// addHoney() returns an object with its reducer, updateState, getState, and resetState
const { reducer, updateState, getState, resetState } = addHoney("funWithReduxHoney", initialState);
export default reducer;
```

## updateState(payload)

Call ```updateState(payload)``` to update its state

### Arguments
- **payload** *(required)* - object - the object that defines the changes you want to make to your store. You can pass one or more key-value pairs to update your state

### Returns
*null*

Example:

```js
// This is funWithReduxHoneyReducer.js

import { addHoney } from "redux-honey";

// The initialState for this piece of state
const initialState = {
 loveProgramming: false,
 favPlugin: "redux-honey",
 isStateUpdated: false
};

const { reducer, updateState, getState, resetState } = addHoney("funWithReduxHoney", initialState);
export default reducer;

// Called in a react component
export const updateFavPlugin = selectedFavPlugin => {

	// updates state's favPlugin and isStateUpdated
	updateState({ favPlugin: selectedFavPlugin, isStateUpdated: true });
}
```

#### Side Note
As a safety check, you can't pass key-value pairs that didn't exist on the initialState when calling ```updateState()```. This prevents you from accidentally mispelling a key. It also prevents you from going all 🤬🤬 when you didn't realize you accidentally spelled it ```favPlugim``` instead of ```favPlugin```;

```js
// This entire call would fail because isGoingToFailToUpdate was not defined on the initialState
updateState({ favPlugin: "redux-honey", isGoingToFailToUpdate: true });
```

## getState(keysString, options)

Call ```getState(keysString, options)``` to retrieve what you need from its state.

### Arguments
- **keysString** *(optional)* - string - space-separated set of keys. If you want to get the entire state, pass no arguments for ```keysString```
- **options** *(optional)* - object - a set of options when calling ```getState()```. Options are defined below.

### Returns
- the piece of state that matches the passed keysString

This one is *pretty* neat, so get yo popcorn ready! 🍿 Here's a quick example:

```js
// An example state structure
{
 name: "John Smith",
 bodyDetails: {
  height: 185,
  weight: 175,
  athletics: {
   athleticLevel: "somewhat",
   sportingAbilities: {
    isGoodAtFootball: false,
    isGoodAtBaseball: false
   }
  }
 }
}

// If I wanted to get the sportingAbilities array, you pass an in-order list of keys like so:
getState("bodyDetails athletics sportingAbilities");
```

It's *that* simple! 🎉

One of the (many!) cool aspects about ```getState``` is that, by default, it returns a shallow-cloned copy of the original piece of state. Now, you don't need to worry about using spread operators to prevent you from mutating any existing pieces of state - it's already done for you!

### Options

**returnOriginal** - defaults to `false`. Set to `true` when calling `getState` to return the original, uncloned copy of your state

```js
// An example state structure
{
 name: "John Smith",
 bodyDetails: {
  height: 185,
  weight: 175,
  athletics: {
   athleticLevel: "somewhat",
   sportingAbilities: {
    isGoodAtFootball: false,
    isGoodAtBaseball: false
   }
  }
 }
}

// Right now the only option is returnOriginal. More will likely be added in the future!
const options = { returnOriginal: true };

// Returns an uncloned object for sportingAbilities
const sportingAbilities = getState("bodyDetails athletics sportingAbilities", options);
```

## resetState()

### Arguments
*none*

### Returns
*null*

Call ```resetState()``` to set the state piece back to the passed initialState passed.

Example:

```js
import { addHoney, wait } from "redux-honey";



// addHoney() returns an object with its reducer, updateState, getState, and resetState
const { reducer, updateState, getState, resetState } = addHoney("funWithReduxHoney", initialState);
export default reducer;



export const showFunStuffAction = async () => {
	
 // Let components know you're fetching data - You know, if you're into that stuff. Batteries not included
 updateState({ isFetching: true });

 // wait() is a method that returns a promise
 // Waits 500ms before continuing. Described in greater detail below
 await wait(500);

 // Resets this piece of state back to what it was when addHoney() was called
 resetState();
}
```

Super simple!

## wait(duration)

### Arguments
- **duration** *(required)* - number - the number of ms you want to wait until continuing

### Returns
*null*

Call ```wait()``` when you need to block code execution for a defined duration. An example of it's use is above ☝️


## resetStoreToInitialState()

### Arguments
*none*

### Returns
*null*

Call ```resetStoreToInitialState()``` when you need to reset all states in your store back to its initialState. A use case would be after a user signs out.

Example:

```js
import { addHoney, resetStoreToInitialState } from "redux-honey";



// addHoney() returns an object with its reducer, updateState, getState, and resetState
const { reducer, updateState, getState, resetState } = addHoney("funWithReduxHoney", initialState);
export default reducer;



export const showFunStuffAction = async () => {
	
 // Let components know you're fetching data - You know, if you're into that stuff. Batteries not included
 updateState({ isSigningOut: true });

 // For fun because why not :)
 await wait(1000);

 // Resets entire store back to all passed initialStates
 resetStoreToInitialState();
}
```

## License 

The MIT License (MIT)

Copyright (c) 2019-present Kody Rouse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



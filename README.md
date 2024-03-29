# 🍯 Redux-Honey 🍯
A dev-friendly library that makes it *a lot* sweeter to work with advanced redux 🥰

# Installation

```js
// With npm
npm i redux-honey

// With yarn
yarn add redux-honey
```

## Quick Use Overview
```js
import { addHoney, createHoneyPot } from "redux-honey";

// Create a state object with addHoney
const state = addHoney("overviewState", {
 favFood: "pizza",
 user: {
   name: "Bob Barker",
   age: 0
 },
});

// Creates redux-honey store
const store = createHoneyPot({ state });

// state.get() returns completely mutable state key-values
const { user } = state.get();
user.age = 96;

// Sets "user" key with updated name / age
// It also allows you to set multiple keys at once
state.set({ user, favFood: "Hot Pockets" });

// Allows you to reset state back to it's initially-set values
state.reset();

// Allows you to just reset a key back to its initial value
state.resetKey("favFood");
```
There's much more to this library, so sit tight! 🍿

## Before Getting Started 
While this still has the concept of a pieces of state combining into a global store, this library was purposefully designed to get away from core concepts in redux like `reducers`, `action types`, and `actions`. `addHoney` state pieces are beautiful, modular objects and works only with the initially given key-value pairs that are given!

# Benefits To Using Redux-Honey
- Drastically reduces unnecessary file clutter (AKA the heartwarming *redux boilerplate*). You no longer need to hear "reducer" or "action types" again! 🎉
- Plays nicely with typescript by default
- No need for ```redux-thunk``` nor ```redux-saga```
- Built-in methods like ```state.reset()``` and ```resetStoreToInitialState```
- Has support for plain redux reducers so you don't have to do a hard transition with your entire store

# Initialize
Call ```createHoneyPot``` to initialize your store. Pass in an object of all of your created state pieces

### Arguments
- **combinedState** *(required)* - object - An object that contains all states returned from calling ```addHoney()```

### Returns
- **Redux store**

```js
import { createHoneyPot, addHoney } from "redux-honey";


// "addHoney" creates a new piece of state that can be added to "createHoneyPot"
const funWithReduxHoney = addHoney("funWithReduxHoney", {
 isFun: true,
 favFood: "pizza"
});


// You can also pass in traditional redux reducers into createHoneyPot
// This allows you to migrate your store over as you go
const initialState = { isFun: true, favFood: "pizza" };
const funWithReduxHoneyReducer = (state = initialState, { type, payload }) => {
  switch(type) {
    case "SET_IS_FUN":
      return { ...state, isFun: payload.isFun };
    case "SET_FAV_FOOD":
      return { ...state, favFood: payload.favFood };
    default:
      return state;
  }
}

// Calling "createHoneyPot" creates your redux honey store
// It also accepts plain redux reducers so you don't have to
// transition your entire store at once
const store = createHoneyPot({
 funWithReduxHoney,
 funWithReduxHoneyReducer
});

/**
 * If you are using this library with React & react-redux,
 * you are still able to pass the returned store from
 * createHoneyPot() into <Provider> like usual
**/

ReactDOM.render(
  <Provider store={store}>
   <App />
  </Provider>,
 document.getElementById('root')
)
```


## addHoney(stateKey, initialState)

Call ```addHoney(stateKey, initialState)``` to create a new piece of state

### Arguments
- **stateKey** *(required)* - unique string. The file/reducer name is recommended for debugging purposes
- **initialState** *(required)* - object that defines the stucture of this piece of your store

### Returns
- **state** - *(object)* - an object containing the methods used to get, set, and reset this piece of state

Example:
```js

import { addHoney } from "redux-honey";

// addHoney() returns a self-contained state object
// that contains four methods:
// state.get(), state.set(), state.resetKey(), and state.reset()
const state = addHoney("funWithReduxHoney", {
 loveProgramming: false,
 favLibrary: "redux-honey"
});

// exported to be added passed into the createHoneyPot method
export default state;
```

### Typescript 
There's also typescript generic for typing your `intialState` and your `state.set` method calls

```js
type State = {
 loveProgramming: boolean
 favLibrary: string
}

const state = addHoney<State>("funWithReduxHoney", {
 loveProgramming: false,
 favLibrary: "redux-honey",
 name: "Steve Smith" // Typescript will yell at ya for this!
});

// Typescript will yell at ya for this!
state.set({ loveProgramming: "true" });
```

## state

The returned ```state``` is an object that contains three methods: ```get```, ```set```, and ```reset```.
 
```js

// Gets piece of state
state.get();

// Updates state
state.set();

// Resets key back to its starting value set on initialState
// that was passed in addHoney
state.resetKey();

// Reset back to the initialState that was passed in addHoney
state.reset();
```

## state.set(payload)

Call ```state.set(payload)``` to set its state

### Arguments
- **payload** *(required)* - object - the object that defines the changes you want to make to your store. You can pass one or more key-value pairs to set your state

### Returns
*null*

Example:

```js
import { addHoney } from "redux-honey";

// addHoney() returns a self-contained state object
// that contains four methods:
// state.get(), state.set(), state.resetKey(), and state.reset()
const state = addHoney("funWithReduxHoney", {
 loveProgramming: false,
 favLibrary: ""
});

// exported to be added passed into the createHoneyPot method
export default state;

// updates state's favLibrary and loveProgramming
state.set({ favLibrary: "redux-honey", loveProgramming: true });
```

 
#### Side Note
As a safety check when calling ```state.set()```, your passed payload can't contain key-value pairs that didn't exist on the initialState passed into ```addHoney()```. This prevents you from accidentally mispelling a key. It also prevents you from going all 🤬🤬, breaking your keyboard when you didn't realize you accidentally spelled it ```favLibrarz``` instead of ```favLibrary```. I have unfortunately done this far too many times!

 
```js
// This entire call would fail because
// isGoingToFailToUpdate was not defined on the initialState
state.set({ favLibrary: "redux-honey", isGoingToFailToUpdate: true });
```
 
 
## state.get(keysString, options)

Call ```state.get(keysString, options)``` to retrieve what you need from its state.

### Arguments
- **keysString** *(optional)* - string - period-separated set of keys. If you want to get the entire state, pass no arguments for ```keysString```
- **options** *(optional)* - object - a set of options when calling ```state.get()```. Options are defined below.

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

// If I wanted to get the sportingAbilities array,
// you pass an in-order list of keys like so:
state.get("bodyDetails.athletics.sportingAbilities");
```

It's *that* simple! 🎉 
 
## state.get(keysString, options) -> item from array

This is where ```state.get()``` gets *really* cool. ```state.get()``` can return data for more than just a value for a passed key. It can also retrieve an item from an array in two different ways.

An example to retrieve an item in an array based on index:

```js
import { addHoney } from "redux-honey";

const state = addHoney("funWithReduxHoney", {
 loveProgramming: false,
 favFoods: ["pizza", "chinese", "cookies"]
});

// This returns the item in the array at position 2 as long as it exists
// favFood2 returns "cookies"
const favFood2 = state.get("favFoods.[2]");
```

An example to retrieve an item in an array with a matched key-value pair:

```js
import { addHoney } from "redux-honey";

const state = addHoney("funWithReduxHoney", {
 name: "John Smith",
 friends: [
  {
   id: 21,
   name: "Tom Smith"
  },
  {
   id: 45,
   name: "Johnny Boy"
  },
  {
   id: 92,
   name: "Carl Thompson"
  }
 ]
});

// This returns the item in the array that has an id of 45
// "friend" will be { id: 45, name: "Johnny Boy" }
const friend = state.get("friends.[id=45]");

// This returns null because no object in the friends
// array has a name "Frank Sinatra"
const emptyFriend = state.get("friends.[name=Frank Sinatra]");
```

Now *that* is pretty freakin cool. 🤓
 

### Options *(state.get())*

**getItemIndex** - *(optional)* - boolean - defaults to `false`. Set to `true` when calling `state.get()` to receive an item index in an array.
**returnOriginal** - *(optional)* - boolean - defaults to `false`. Set to `true` when calling `state.get()` to recieve a non-cloned version of that piece of state. By default, ```state.get()``` returns a deep-cloned version to allow for easy mutability.

```js
import { addHoney } from "redux-honey";

const state = addHoney("funWithReduxHoney", {
 name: "John Smith",
 friends: [
  {
   id: 21,
   name: "Tom Smith"
  },
  {
   id: 45,
   name: "Johnny Boy"
  },
  {
   id: 92,
   name: "Carl Thompson"
  }
 ]
});

// Returns 0, which is the index of the object in friends with the id = 21
const tomSmithIndex = state.get("friends.[id=21]", { getItemIndex: true });

// Returns an uncloned version of the friend with id = 21
const tomSmith = state.get("friends.[id=21]", { returnOriginal: true });
```

## state.resetKey(key)

### Arguments
- **key** *(required)* - string - a key from your state you would like to reset back to its initial value

### Returns
*null*

Call ```state.resetKey()``` to set a key's value back to its initialState that was passed when calling ```addHoney()```

Example:

```js
import { addHoney, nap } from "redux-honey";


const state = addHoney("funWithReduxHoney", {
 isLoading: false,
 isSaving: false,
 details: {}
});

// exported to be added passed into the createHoneyPot method
export default state;


export const showFunStuffAction = async () => {
  
 const details = { isFun: true };
 state.set({ details });

 // nap() is a method that returns a promise
 // Waits 500ms before continuing. Described in greater detail below
 await nap(500);

 // Resets "details" back to its initial state, which is {}
 state.resetKey("details");
}
``` 

## state.reset(options)

### Arguments
- **options** *(optional)* - object - a set of options when calling ```state.reset()```. Options are defined below.

### Returns
*null*

Call ```state.reset()``` to set the state piece back to the passed initialState passed.

Example:

```js
import { addHoney, nap } from "redux-honey";


// addHoney() returns an object with its reducer and its state object
const state = addHoney("funWithReduxHoney", {
 isLoading: false,
 isSaving: false
});

// exported to be added passed into the createHoneyPot method
export default state;


export const showFunStuffAction = async () => {
	
 // Let components know you're loading data - You know, if you're into that stuff.
 state.set({ isLoading: true });

 // nap() is a method that returns a promise
 // Waits 500ms before continuing. Described in greater detail below
 await nap(500);

 // Resets this piece of state back to what it was when addHoney() was called
 state.reset();
}
```

Super simple!

### Options *(state.reset())*

**keepKeyValues** - *(optional)* - array - This allows you to call ```state.reset()``` but keep current values of certain keys.

```js
const state = addHoney("funWithReduxHoney", {
 isLoading: false,
 isSaving: false,
 favLibrary: "redux-honey",
 name: "Bob Barker"
});

state.set({ name: "Steve Smith", isLoading: true, favLibrary: "" });

// resets state back to its initialState except for "name"
state.reset({ keepKeyValues: ["name"] });
```
 
## nap(duration)

### Arguments
- **duration** *(required)* - number - the number of ms you want to wait until continuing

### Returns
*null*

Call ```nap()``` when you need to block code execution for a defined duration. This is especially useful for animation purposes. An example of it's use is above ☝️
 
 
## resetStoreToInitialState()

### Arguments
*none*

### Returns
*null*

Call ```resetStoreToInitialState()``` when you need to reset all states in your store back to its initialState. A use case would be after a user signs out.

Example:

```js
import { addHoney, nap, resetStoreToInitialState } from "redux-honey";


// addHoney() returns an object with its reducer and its state object
const state = addHoney("user", {
 name: "Steve Smith",
 isSigningOut: false
});


export const showFunStuffAction = async () => {
	
 state.set({ isSigningOut: true });

 // For fun because why not :)
 await nap(1000);

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



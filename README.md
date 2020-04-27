# 🍯 Redux-Honey 🍯
A plugin that makes it *a lot* sweeter to work with advanced redux 🥰

# Problems With Plain Redux
In a lot of ways, redux is *fantastic* at what it does. The problems begin to arise when your application starts scaling - files become *littered* with unnecessary boilerplate code and your store quickly becomes a complicated mess. It hurts my soul. This is where ```redux-honey``` comes to the rescue 🙌

# Benefits To Using Redux-Honey
- Drastically reduces unnecessary file clutter (AKA the heartwarming *redux boilerplate*)
- No need for top-file action types like **WHY_AM_I_YELLING** or ugly switch case statements for reducers
- Safety checks & warnings to prevent accidental updates && ```extract``` state pieces that don't exist
- Built-in methods to ```state.reset()``` and ```resetStoreToInitialState```
- Allows for simplier usage of asynchronous updates with ```wait()```, removing the need for middleware like ```redux-thunk``` and ```redux-saga```

# Installation

```js
// With npm
npm i redux-honey

// With yarn
yarn add redux-honey
```

# Initialize
Call ```createHoneyPot``` and pass in an object of all of your created state pieces:

```js
import { createHoneyPot, addHoney } from "redux-honey";


const funWithReduxHoney = addHoney("funWithReduxHoney", {
 isFun: true,
 favFood: "pizza"
});

// Calling "createHoneyPot" creates your redux honey store
const HoneyPot = createHoneyPot({
 funWithReduxHoney
});


// Wrap your App with the <HoneyPot> component like so
ReactDOM.render(
 <HoneyPot>
  <App />
 </HoneyPot>,
 document.getElementById('root')
);
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

// addHoney() returns a self-contained state object that contains three mains: state.get(), state.set(), and state.reset()
const state = addHoney("funWithReduxHoney", {
 loveProgramming: false,
 favPlugin: "redux-honey"
});

// exported to be added passed into the createHoneyPot method
export default state;
```


## state

The returned ```state``` is an object that contains three methods: ```get```, ```set```, and ```reset```.
 
```js

// Gets piece of state
state.get();

// Updates state
state.set();

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

// addHoney() returns a self-contained state object that contains three mains: state.get(), state.set(), and state.reset()
const state = addHoney("funWithReduxHoney", {
 loveProgramming: false,
 favPlugin: ""
});

// exported to be added passed into the createHoneyPot method
export default state;

// updates state's favPlugin and loveProgramming
state.set({ favPlugin: "redux-honey", loveProgramming: true });
```

 
#### Side Note
As a safety check when calling ```state.set()```, your passed payload can't contain key-value pairs that didn't exist on the initialState passed into ```addHoney()```. This prevents you from accidentally mispelling a key. It also prevents you from going all 🤬🤬, breaking your keyboard when you didn't realize you accidentally spelled it ```favPlugimz``` instead of ```favPlugin```. I have unfortunately done this far too many times!

 
```js
// This entire call would fail because isGoingToFailToUpdate was not defined on the initialState
state.set({ favPlugin: "redux-honey", isGoingToFailToUpdate: true });
```
 
 
## state.get(keysString, options)

Call ```state.get(keysString, options)``` to retrieve what you need from its state.

### Arguments
- **keysString** *(optional)* - string - space-separated set of keys. If you want to get the entire state, pass no arguments for ```keysString```
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

// If I wanted to get the sportingAbilities array, you pass an in-order list of keys like so:
state.get("bodyDetails athletics sportingAbilities");
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
const favFood2 = state.get("favFoods [2]");
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
const friend = state.get("friends [id=45]");

// This returns null because no object in the friends array has a name "Frank Sinatra"
const emptyFriend = state.get("friends [name=Frank Sinatra]");
```

Now *that* is pretty freakin cool. 🤓
 

### Options

**getItemIndex** - *(optional)* - boolean - defaults to `false`. Set to `true` when calling `state.get()` to receive an item index in an array. If ```getItemIndex``` is set to `true`, ```returnOriginal``` nor ```deepClone``` can be set to `true`.
**deepClone** - *(optional)* - boolean - defaults to `false`. Set to `true` when calling `state.get()` to receive an item index in an array. If ```deepClone``` is set 

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
const tomSmithIndex = state.get("friends [id=21]", { getItemIndex: true });

// Returns a deep-cloned version of the friend with id = 21
const tomSmith = state.get("friends [id=21]", { deepClone: true });
```
 

## state.reset(options)

### Arguments
- **options** *(optional)* - object - a set of options when calling ```state.reset()```. Options are defined below.

### Returns
*null*

Call ```state.reset()``` to set the state piece back to the passed initialState passed.

Example:

```js
import { addHoney, wait } from "redux-honey";


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

 // wait() is a method that returns a promise
 // Waits 500ms before continuing. Described in greater detail below
 await wait(500);

 // Resets this piece of state back to what it was when addHoney() was called
 state.reset();
}
```

Super simple!

## extract(mapHoneyToProps, Component)
A method to bind state to react components. This is very similiar to the react-redux method ```connect()```, but ```extract()``` will throw warnings if you attempt to bind state pieces that don't exist.

### Arguments
- **mapHoneyToProps** *(required)* - function - a function that outlines what state pieces you would like to use to pass as props inside your Component
- **Component** *(required)* - React component

### Returns
An updated component with the passed props from calling the ```extract()``` method

```js
import React from "react";
import { extract } from "redux-honey";

const UserProfile = ({ name, birthDay }) => (
 <div>
  <p>{name}</p>
  <p>{birthDay}</p>
 </div>
)

/*
 user state structure

 user: {
  name: "Steve Smith",
  birthday: "June 19th 1990",
  friends: [],
  favSongs: []
 }
*/

// The method used to determine what state pieces you want passed as props
const mapHoneyToProps = store => ({
 name: store.user.name,
 birthDay: store.user.birthDay
});

export default extract(mapHoneyToProps, UserProfile);
```

To prevent unknown misspelling problems when using extract, redux-honey will throw a warning that something you were asking for doesn't exist on that state:

```js
import React from "react";
import { extract } from "redux-honey";

const UserProfile = ({ name, birthDay }) => (
 <div>
  <p>{name}</p>
  <p>{birthDay}</p>
 </div>
)

/*
 user state structure

 user: {
  name: "Steve Smith",
  birthday: "June 19th 1990",
  friends: [],
  favSongs: []
 }
*/

// This will fail && will throw a warning that the key "friendz" doesn't exist on the user
const mapHoneyToProps = store => ({
 friendz: state.user.friendz
});

export default extract(mapHoneyToProps, UserProfile);
```
 
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


// addHoney() returns an object with its reducer and its state object
const state = addHoney("user", {
 name: "Steve Smith",
 isSigningOut: false
});


export const showFunStuffAction = async () => {
	
 state.set({ isSigningOut: true });

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



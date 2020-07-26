
# ChangeLog

### **6.1.0**
- Added ability to set an `initialValue` when using `arrayOf`
- Added an `anyValue()` that is used to enable value ignoring when `typeSafe` is set to true

### **6.0.2**
- Fixed issue with `extract` false failing when components were first mounted

### **6.0.1**
- Fixed README.md to show the name change from `wait` to `nap`

### **6.0.0**
- Added `typeSafe`, a major feature to help improve state visibility & wrap testing around state updates & subscriptions!
- Bug fixes with extract & props being updated 

### **5.1.0**
- Added a method ```state.resetKey()``` that allows the resetting of a single key vs resetting the entire state with ```state.reset()```
- Improved error messages for potential points of failure

### **5.0.1**
- Removed spread operator use in ```extract``` method

### **5.0.0**

- After repeatedly having issues with ```extract```, I decided it was best to get away from wrapping ```react-redux```. This ended up simplifying use, removing the need to wrap your application in ```<HoneyPot></HoneyPot>```

### **4.2.2**

- Fixed bugs with ```extract()``` and improved warning messages
- Fixed bug with ```keepKeyValues``` in ```state.reset()```
- Updated README.md

### **4.2.1**

- Fixed bugs with ```extract()``` on more complex state structures

### **4.2.0**

- Fixed bugs with ```extract()``` and ```createHoneyPot()```

### **4.1.0**

- For improved clarity, the ```state.get()``` chain no longer uses a space-separated string but instead uses a ```.```

### **4.0.0**
This version is an attempt to both mature this plugin as well as further simplify its use in comparison to plain redux.

- ```createHoneyPot``` no longer needs a redux store passed into it. It now just accepts an object with with all of the states created with  ```addHoney```. This also returns a ```<HoneyPot></HoneyPot>``` component that has your built in store - this component is to replace ```Provider``` from ```react-redux```
- ```extract``` is added to replace the use of the react-redux method ```connect()```. It adds a wrapper around ```connect()``` to check if the state pieces being extracted exist to prevent uncaught bugs when changing state

### **3.0.1**
- Bug Fix: fixed issue with `state.get()` with int-like strings not finding item in array

#### **3.0.0**
- Changed ```state.update``` to ```state.set``` due to request. This is more consistent with the get / set approach to state.

#### **2.2.0**
- Added an option ```keepKeyValues``` for ```state.reset()```. This enables the ability to reset a piece state back to its original initialState while keeping certain pass key-values in their current state

#### **2.1.2**
- Removed error warning when calling ```state.get()``` to retrieve an item an array with a given key-value pair that doesn't exist. I found this to be unexpected behavior and it now returns ```undefined``` if one was not found in the array, which is typical behavior with the ```.find``` method for arrays

#### **2.1.0**
- Added option ```deepClone``` for ```state.get()``` to return a deepCloned copy of the retrieved state
- Added option for ```getItemIndex``` ```state.get()``` to return the index of an array item

#### **2.0.0**
- changed method name to inject store to ```createHoneyPot```
- Now ```addHoney``` returns ```{ reducer, state }```. State now contains methods on it to ```update, get, and reset```
- updated folder & file structure

#### **1.1.1**
- Bug Fix: fixed issue with wait method being incorrectly exported

#### **1.1.0**
- Added method ```wait``` for easy use of asynchronous actions 

#### **1.0.1**
- restructured folder and moved deepClone into its own file
- Added option for ```getState()``` to return the original copy of the retrieved state
- Added more console warnings for error clarity

#### **1.0.0**

- First version release! 🎉

# ChangeLog

#### **2.1.1**
- Removed error warning when calling ```state.get()``` to retrieve an item an array with a given key-value pair that doesn't exist. I found this to be unexpected behavior and it now returns ```null``` if one was not found in the array

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
- restructured folder and moved deepClone into its own
- Added option for ```getState()``` to return the original copy of the retrieved state
- Added more console warnings for error clarity

#### **1.0.0**

- First version 🎉
- Added ability to use
- Upcoming changes
- Ability to trigger entire store to a given state
- Ability to make initialState pieces type-safe so I can't turn a boolean into a string by accident
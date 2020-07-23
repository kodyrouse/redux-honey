import log from "../utils/log";
import { typeMapObject, getValueType, isValueNull, isValueAnArray, isValueAnObject } from "../createTypeMapsForStates";
import arrayTypes from "../arrayTypes";

export default (...options) =>  {

  window.isAddHoneyUsingTypeSafeMethods = true;

  return (key, stateKey) => {

    if (options.length === 0) {
      log.error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but didn't pass any arguments. Please ensure you pass one argument when calling arrayOf() of arrayTypes.String, arrayTypes.Number, arrayTypes.Boolean, or a non-empty object`);
      return "string";
    } else if (options.length > 2)
      log.warn(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but passed in more than two arguments but arrayOf() only supports two arguments: The first argument is used to define the value type / object shape items in the array will be structured like. The second is the default value the array will initially be set to`);

    const returnArrayType = [];

    try {
      returnArrayType.push(getArrayItemType(options[0], key, stateKey));
    } catch(error) {
      log.error(error);
    }

    // This adds the given default value as part of the state map to return
    // This given set array is validated in createTypeMapsForStates
    if (options.length >= 2)
      returnArrayType.push(options[1]);

    return returnArrayType;
  }
}


const getArrayItemType = (arrayItem, key, stateKey) => {
  if (isValueNull(arrayItem))
    throw new Error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but the argument given was null. When using arrayOf(), please ensure you are passing the arrayItem as one of the arrayTypes or as a non-empty object`)
  else if (isValueAnArray(arrayItem))
    throw new Error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but was given an array. When using arrayOf(), please ensure you are passing the arrayItem as one of the arrayTypes or as a non-empty object`)
  else if (isValueAnObject(arrayItem) && Object.keys(arrayItem).length === 0)
    throw new Error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but was given an empty object. When using arrayOf(), please ensure you are passing the arrayItem as one of the arrayTypes or as a non-empty object`)
  else if (typeof arrayItem === "function")
    throw new Error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but was given a function. When using arrayOf(), please ensure you are passing the arrayItem as one of the arrayTypes or as a non-empty object`)
  else if (typeof arrayItem === "undefined")
    throw new Error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but was given an invalid arrayType. The current support arrayTypes are arrayTypes.String, arrayTypes.Number, and arrayTypes.Boolean`);
  else if (isValueAnObject(arrayItem)) 
    return typeMapObject(arrayItem, stateKey)
  else if (typeof arrayItem === "string") {
    const arrayType = getArrayTypeForString(arrayItem);
    if (!arrayType)
      throw new Error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but was not given a non-supported type. Ensure you are using one of the non-object types for arrayOf() - arrayTypes.String, arrayTypes.Number, or arrayTypes.Boolean`)
    return arrayType.split(".")[2]
  } else
    throw new Error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but was not given one . When using arrayOf(), please ensure you are passing the arrayItem as one of the arrayTypes or as a non-empty object`)
}


const getArrayTypeForString = arrayItem => {

  let arrayType;

  Object.keys(arrayTypes).forEach(type => {

    const stringValue = arrayTypes[type];
    if (arrayItem === stringValue)
      arrayType = stringValue;
  })

  return arrayType;
}











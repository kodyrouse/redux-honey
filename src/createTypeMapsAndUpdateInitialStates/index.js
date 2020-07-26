import arrayOf from "../arrayOf";
import canBeOneOf from "../canBeOneOf";
import anyValue from "../anyValue";
import arrayTypes from "../arrayTypes";
import log from "../utils/log";
import { typeCheckArray } from "../typeCheckPayload";
import isEqual from "react-fast-compare";

export default combinedState => {

  const typeMapsForStates = {};

  Object.keys(combinedState).forEach(stateKey => {
    typeMapsForStates[stateKey] = typeMapObject(stateKey, combinedState[stateKey]);
  });

  console.log(typeMapsForStates);
  console.log(combinedState);

  return typeMapsForStates;
}

export const typeMapObject = (stateKey, object) => {

  const objectMap = {};

  Object.keys(object).forEach(key => {

    const value = object[key];
    let valueType = null;

    try {
      valueType = getValueType(stateKey, key, value);
    } catch(error) {
      log.error(error);
    }

    if (isCustomTypeObject(valueType)) {
      object[key] = valueType.__initialValue;

      if (valueType.__honeyType === "arrayOf") {

        try {
          valueType.__itemType = typeMapArrayOfItem(stateKey, key, valueType.__itemType);
        } catch(error) {
          log.error(error);
        }
      }
    }

    objectMap[key] = valueType;
  });

  return objectMap;
}


export const getValueType = (stateKey, key, value) => {
  if (value === null)
    throw new Error(`The key "${key}" for addHoney("${stateKey}") was set to null. Values cannot be set to null wjem typeSafe is set to true when calling createHoneyPot()`)
  else if (Array.isArray(value))
    throw new Error(`The key "${key}" for addHoney("${stateKey}") was set to an array. Use arrayOf() to define an array when typeSafe is set to true when calling createHoneyPot().`)
  else if (isValueAnObject(value) && Object.keys(value).length === 0)
    throw new Error(`The key "${key}" for addHoney("${stateKey}") was set to an empty object. Objects must be non-empty when typeSafe is set to true when calling createHoneyPot()`)
  else if (isValueAnObject(value))
    return typeMapObject(stateKey, value)
  else if (isCustomValueMethod(value)) // true for "anyValue", "arrayOf", and "canBeOneOf"
    return value(key, stateKey)
  else
    return typeof value
}


const isValueAnObject = value => (
  typeof value === "object" && !Array.isArray(value)
)

const isCustomValueMethod = value => {
  const valueToString = value.toString();
  return typeof value === "function" && (valueToString === arrayOf().toString() || valueToString === canBeOneOf().toString() || valueToString === anyValue().toString())
}

const isCustomTypeObject = value => (
  typeof value === "object" && typeof value.__honeyType === "string"
)


const typeMapArrayOfItem = (stateKey, key, arrayItem) => {
  if (arrayItem === null)
    throw new Error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but the argument given was null. When using arrayOf(), please ensure you are passing the arrayItem as one of the arrayTypes or as a non-empty object`)
  else if (Array.isArray(arrayItem))
    throw new Error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but was given an array. When using arrayOf(), please ensure you are passing the arrayItem as one of the arrayTypes or as a non-empty object`)
  else if (isValueAnObject(arrayItem) && Object.keys(arrayItem).length === 0)
    throw new Error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but was given an empty object. When using arrayOf(), please ensure you are passing the arrayItem as one of the arrayTypes or as a non-empty object`)
  else if (typeof arrayItem === "function")
    throw new Error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but was given a function. When using arrayOf(), please ensure you are passing the arrayItem as one of the defined arrayTypes or as a non-empty object`)
  else if (typeof arrayItem === "undefined")
    throw new Error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but was given an invalid arrayType. The current support arrayTypes are arrayTypes.String, arrayTypes.Number, and arrayTypes.Boolean`);
  else if (isValueAnObject(arrayItem)) 
    return typeMapObject(stateKey, arrayItem)
  else if (typeof arrayItem === "string") {
    const arrayType = getArrayTypeForString(arrayItem);
    if (!arrayType)
      throw new Error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but was not given a non-supported type. Ensure you are using one of the non-object types for arrayOf() - arrayTypes.String, arrayTypes.Number, or arrayTypes.Boolean`)
    return arrayType.split(".")[2]
  } else
    throw new Error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but was not given one. When using arrayOf(), please ensure you are passing the arrayItem as one of the arrayTypes or as a non-empty object`)
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
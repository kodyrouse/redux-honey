import arrayOf from "../arrayOf";
import canBeOneOf from "../canBeOneOf";
import log from "../utils/log";
import isEqual from "react-fast-compare";

export default combinedState => {

  const typeMapsForStates = {};

  Object.keys(combinedState).forEach(stateKey => {
    typeMapsForStates[stateKey] = typeMapState(stateKey, combinedState[stateKey]);
  });

  return typeMapsForStates;
}


const typeMapState = (stateKey, state) => {

  const stateTypeMap = {};

  Object.keys(state).forEach(key => {

    const value = state[key];
    let valueType = null;

    try {
      valueType = getValueType(stateKey, key, value);
    } catch(error) {
      log.error(error);
    }
    
    stateTypeMap[key] = valueType;

    if (Array.isArray(valueType))
      state[key] = [];
    else if (typeof valueType === "string" && valueType.startsWith("[")) {
      state[key] = JSON.parse(valueType)[0];
    }
  });

  return stateTypeMap;
};


export const typeMapObject = (object, stateKey) => {

  const objectMap = {};

  Object.keys(object).forEach(key => {

    const value = object[key];
    let valueType = null;

    try {
      valueType = getValueType(stateKey, key, value);
    } catch(error) {
      log.error(error);
    }

    objectMap[key] = valueType;

    if (Array.isArray(valueType))
      object[key] = [];
    else if (typeof valueType === "string" && valueType.startsWith("[")) {
      object[key] = JSON.parse(valueType)[0];
    }
  });

  return objectMap;
}


export const getValueType = (stateKey, key, value) => {

  if (isValueNull(value))
    throw new Error(`The key "${key}" for addHoney("${stateKey}") was set to null. Values cannot be set to null wjem typeSafe is set to true when calling createHoneyPot()`)
  else if (isValueAnArray(value))
    throw new Error(`The key "${key}" for addHoney("${stateKey}") was set to an array. Use arrayOf() to define an array when typeSafe is set to true when calling createHoneyPot().`)
  else if (isValueAnObject(value) && Object.keys(value).length === 0)
    throw new Error(`The key "${key}" for addHoney("${stateKey}") was set to an empty object. Objects must be non-empty when typeSafe is set to true when calling createHoneyPot()`)
  else if (isValueAnObject(value))
    return typeMapObject(value, stateKey)
  else if (typeof value === "function" && (value.toString() === arrayOf().toString() || value.toString() === canBeOneOf().toString())) {
    return value(key, stateKey)
  } else
    return typeof value
}

export const isValueNull = value => (
  value === null
)

export const isValueAnObject = value => (
  typeof value === "object"
)

export const isValueAnArray = value => (
  Array.isArray(value)
)
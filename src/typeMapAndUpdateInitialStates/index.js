import arrayOf from "../arrayOf";
import canBeOneOf from "../canBeOneOf";
import anyValue from "../anyValue";
import log from "../utils/log";
import { typeCheckArray } from "../typeCheckPayload";
import isEqual from "react-fast-compare";

export default combinedState => {

  const typeMapsForStates = {};

  Object.keys(combinedState).forEach(stateKey => {
    typeMapsForStates[stateKey] = typeMapObject(stateKey, combinedState[stateKey]);
  });

  console.log(typeMapsForStates);

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
    return typeMapObject(stateKey, value)
  else if (typeof value === "function" && (value.toString() === arrayOf().toString() || value.toString() === canBeOneOf().toString() || value.toString() === anyValue().toString()))
    return value(key, stateKey)
  else
    return typeof value
}

export const isValueNull = value => (
  value === null
)

export const isValueAnObject = value => (
  typeof value === "object" && !Array.isArray(value)
)

export const isValueAnArray = value => (
  Array.isArray(value)
)





// 
// const typeMapState = (stateKey, state) => {
// 
//   const stateTypeMap = {};
// 
//   Object.keys(state).forEach(key => {
// 
//     const value = state[key];
//     let valueType = null;
// 
//     try {
//       valueType = getValueType(stateKey, key, value);
//     } catch(error) {
//       log.error(error);
//     }
// 
//     console.log(valueType);
//     
//     stateTypeMap[key] = valueType;
// 
//     if (typeof valueType === "object") {
// 
//       const type = valueType.__honeyType;
//       console.log(type);
//     }
// 
// //     if (Array.isArray(valueType)) {
// // 
// //       if (valueType.length !== 2) return state[key] = [];
// //       
// //       // valueType.length will be 2 when a default array value is passed into arrayOf()
// //       // -> when it's called. It's type checked here just to ensure it passes
// //       const typeCheckErrors = typeCheckArray(valueType[1], valueType[0], key);
// //       if (!typeCheckErrors.length)
// //         state[key] = valueType[1];
// //       else {
// //         state[key] = [];
// //         log.error(typeCheckErrors);
// //       }
// // 
// //     } else if (typeof valueType === "string" && valueType.startsWith("[")) {
// //       state[key] = JSON.parse(valueType)[0];
// //     }
//   });
// 
//   return stateTypeMap;
// };

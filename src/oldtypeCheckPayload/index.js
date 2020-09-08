
export default (payload, stateTypeMap) => {
  let typeCheckErrors = typeCheckObject(payload, stateTypeMap)
  return (typeCheckErrors.length) ? typeCheckErrors += ` \n` : typeCheckErrors;
}

const createTypeError = error => (
` \n > ${error}`
)

const typeCheckObject = (payloadObject, objectMap, keyChain = "") => {

  let typeCheckObjectErrors = "";

  const objectMapKeys = Object.keys(objectMap).sort();
  const payloadKeys = Object.keys(payloadObject).sort();

  for (let i = 0; i < payloadKeys.length; i++) {

    const key = payloadKeys[i];
    const payloadValue = payloadObject[key];
    const payloadValueType = typeof payloadValue;
    const initialStateType = objectMap[key];

    if (keyChain.length) {
      for (let i = 0; i < objectMapKeys.length; i++) {
        if (objectMapKeys[i] === key) {
          objectMapKeys.splice(i, 1);
        }
      }
    }

    if ((payloadValue === null || payloadValue === undefined))
      typeCheckObjectErrors += createTypeError(`The payload key "${key}" was given a value of null/undefined but values cannot be set to null/undefined with typeSafe on`)
    else if (initialStateType === undefined)
      typeCheckObjectErrors += createTypeError(`The key "${key}" was set on the payload "${keyChain}" but was not defined on the initialState for "${keyChain}"`)
    else {
      if (Array.isArray(payloadValue) && Array.isArray(initialStateType))
        typeCheckObjectErrors += typeCheckArray(payloadValue, initialStateType[0], (keyChain.length) ? keyChain : key)
      else if ((typeof initialStateType === "string" && initialStateType.startsWith("[")))
        typeCheckObjectErrors += typeCheckCanBeOneOf(key, payloadValue, initialStateType)
      else if (getValueType(payloadValueType) !== getValueType(initialStateType))
        typeCheckObjectErrors += createTypeError(`The payload key "${key}" was given a value with type "${payloadValueType}" but was initially set with type "${getValueType(initialStateType)}"`)
      else if (payloadValueType === "object")
        typeCheckObjectErrors += typeCheckObject(payloadValue, initialStateType, ((keyChain.length) ? (keyChain + `.${key}`) :  key))
    }
  }

  if (keyChain.length && objectMapKeys.length) {
    typeCheckObjectErrors += createTypeError(`You were missing the following keys on for the payload key "${keyChain}": ${objectMapKeys.join(", ")}`)
  }

  return typeCheckObjectErrors;
}

const getValueType = stateType => (Array.isArray(stateType)
  ? "array"
  : (typeof stateType === "object")
  ? "object"
  : stateType
)

const typeCheckCanBeOneOf = (payloadKey, payloadValue, initialStateType) => {

  const oneOfOptions = JSON.parse(initialStateType);
  for (let i = 0; i < oneOfOptions.length; i++) {
    if (payloadValue === oneOfOptions[i])
      return "";
  }

  return createTypeError(`The key "${payloadKey}" was given "${payloadValue}" but "${payloadKey}" can only be set to one of the following: ${oneOfOptions.join(", ")}`)
}


export const typeCheckArray = (payloadValue, arrayItemStructure, payloadKey) => {

  const arrayItemType = (typeof arrayItemStructure === "object")
    ? "object"
    : arrayItemStructure;

  for (let i = 0; i < payloadValue.length; i++) {

    const payloadItem = payloadValue[i];
    const payloadItemType = typeof payloadItem;
    if (payloadItemType !== arrayItemType)
      return createTypeError(`The array for payload key "${payloadKey}" contains a value of type "${payloadItemType}" set at position ${i}. The array for key "${payloadKey}" only supports values with type "${arrayItemType}"`)

    if (payloadItemType === "object") {
      const typeCheckErrors = typeCheckObject(payloadItem, arrayItemStructure, payloadKey);
      if (typeCheckErrors.length)
        return createTypeError(`The array for payload key "${payloadKey}" supports objects, but the object set at position ${i} has the following errors: ${typeCheckErrors} \n`)
    }
  }

  return "";
}
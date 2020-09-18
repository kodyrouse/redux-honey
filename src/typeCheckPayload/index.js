
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
  const payloadKeysLn = payloadKeys.length;

  for (let i = 0; i < payloadKeysLn; i++) {

    const payloadKey = payloadKeys[i];
    const payloadValue = payloadObject[payloadKey];
    const payloadValueType = typeof payloadValue;
    const initialStateType = objectMap[payloadKey];

    if (keyChain.length) {
      for (let i = 0; i < objectMapKeys.length; i++) {
        if (objectMapKeys[i] === payloadKey) {
          objectMapKeys.splice(i, 1);
        }
      }
    }

    if (!isAnyValue(initialStateType) && (payloadValue === null || payloadValue === undefined))
      typeCheckObjectErrors += createTypeError(`The payload key "${payloadKey}" was given a value of null/undefined but values cannot be set to null/undefined with typeSafe set to on. If you want to be able to be able to do this, use anyValue().`);
    else if (initialStateType === undefined)
      typeCheckObjectErrors += createTypeError(`The key "${payloadKey}" was set on the payload "${keyChain}" but was not defined on the initialState for "${keyChain}"`);
    else if (isArrayOf(initialStateType))
      typeCheckObjectErrors += typeCheckArrayOf(payloadKey, payloadValue, initialStateType);
    else if (isCanBeOneOf(initialStateType))
      typeCheckObjectErrors += typeCheckCanBeOneOf(payloadKey, payloadValue, initialStateType);
    else if (!isAnyValue(initialStateType) && getValueType(payloadValueType) !== getValueType(initialStateType))
      typeCheckObjectErrors += createTypeError(`The payload key "${payloadKey}" was given a value with type "${payloadValueType}" but was initially set with type "${getValueType(initialStateType)}"`)
    else if (!isAnyValue(initialStateType) && payloadValueType === "object")
      typeCheckObjectErrors += typeCheckObject(payloadValue, initialStateType, ((keyChain.length) ? (keyChain + `.${payloadKey}`) :  payloadKey))
  }

  if (keyChain.length && objectMapKeys.length)
    typeCheckObjectErrors += createTypeError(`You were missing the following keys on for the payload key "${keyChain}": ${objectMapKeys.join(", ")}`)

  return typeCheckObjectErrors;
}

const isAnyValue = initialStateType => (
  typeof initialStateType === "object" && initialStateType.__honeyType === "anyValue"
)

const isArrayOf = initialStateType => (
  typeof initialStateType === "object" && initialStateType.__honeyType === "arrayOf"
)

const isCanBeOneOf = initialStateType => (
  typeof initialStateType === "object" &&  initialStateType.__honeyType === "canBeOneOf"
)

const getValueType = stateType => (Array.isArray(stateType)
  ? "array"
  : (typeof stateType === "object")
  ? "object"
  : stateType
)

const typeCheckCanBeOneOf = (payloadKey, payloadValue, canBeOneOfMap) => {
  const { __options: options } = canBeOneOfMap;
  return (!options[payloadValue])
    ? createTypeError(`The key "${payloadKey}" was given "${payloadValue}" but "${payloadKey}" can only be set to one of the following: ${Object.keys(options).join(", ")}`)
    : ""
}


export const typeCheckArrayOf = (payloadKey, payloadValue, arrayOfMap) => {

  const { __itemTypeMap: itemTypeMap } = arrayOfMap;

  const arrayItemType = getArrayItemType(itemTypeMap);
  const payloadValueLn = payloadValue.length;

  for (let i = 0; i < payloadValueLn; i++) {

    const payloadItem = payloadValue[i];
    const payloadItemType = typeof payloadItem;

    if (payloadItemType !== arrayItemType)
      return createTypeError(`The array for payload key "${payloadKey}" contains a value of type "${payloadItemType}" set at position ${i}. The array for key "${payloadKey}" only supports values with type "${arrayItemType}"`)

    if (payloadItemType === "object") {
      const typeCheckErrors = typeCheckObject(payloadItem, itemTypeMap, payloadKey);
      if (typeCheckErrors.length)
        return createTypeError(`The array for payload key "${payloadKey}" supports objects, but the object set at position ${i} has the following errors: ${typeCheckErrors} \n`)
    }
  }

  return "";
}

const getArrayItemType = itemTypeMap => ((typeof itemTypeMap === "string")
  ? itemTypeMap
  : "object"
)

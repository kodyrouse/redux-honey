import log from "../utils/log";

export default (...options) =>  {

  window.isAddHoneyUsingTypeSafeMethods = true;

  return (key, stateKey) => {

    if (options.length === 0)
      log.error(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() but didn't pass any arguments. Please ensure you pass one argument when calling arrayOf() of arrayTypes.String, arrayTypes.Number, arrayTypes.Boolean, or a non-empty object`);

    const returnObj = {
      __honeyType: "arrayOf",
      __initialValue: [],
      __itemType: options[0] // reset in "typeMapAndUpdateInitialStates"
    }

    // This adds the given default value as part of the state map to return
    // This given set array is validated in createTypeMapsForStates
    if (options.length >= 2) {
      if (Array.isArray(options[1]))
        returnObj.__initialValue = options[1];
      else
        log.warn(`The key "${key}" for addHoney("${stateKey}") is using arrayOf() & is passing an initial value, however the value given is not an array.`);
    }

    return returnObj;
  }
}
import log from "../utils/log";

export default (...options) => {

  window.isAddHoneyUsingTypeSafeMethods = true;

  return (key, stateKey) => {

    if (options.length <= 1)
      log.warn(`The key "${key}" for addHoney("${stateKey}") is using canBeOneOf() but at least two arguments. Please ensure you pass at least two options of the same type`);

    const passedOptionTypes = {};

    const returnObj = {
      __honeyType: "canBeOneOf",
      __initialValue: options[0],
      __valueType: null, // set in "typeMapAndUpdateInitialStates"
      __options: {}
    }

    try {

      for (let i = 0; i < options.length; i++) {

        const option = options[i];

        // TODO - I need to eventually check to ensure that no options are strings from arrayTypes.
        const optionType = typeof option;
        if (optionType !== "string" && optionType !== "number")
          throw new Error(`Redux-Honey: \n The key "${key}" for addHoney("${stateKey}") is using canBeOneOf() but is passing options with a typeof "${optionType}". Currently the only supported option types are "string" and "number".`);

        passedOptionTypes[optionType] = true;

        if (returnObj.__options[option])
          log.warn(`The key "${key}" for addHoney("${stateKey}") is using canBeOneOf() but is passing ${option} more than once`);

        returnObj.__options[option] = true;

        if (Object.keys(passedOptionTypes).length > 1)
          throw new Error(`Redux-Honey: \n The key "${key}" for addHoney("${stateKey}") is using canBeOneOf() but is passing arguments of more than one type. Currently canBeOneOf() only supports one type at a time - please ensure all of your arguments are either of type "string" or "number"`);
      };
    } catch(error) {
      log.error(error);
    }

    return returnObj;
  }
}
import log from "../utils/log";

export default (...options) => {

  window.isAddHoneyUsingTypeSafeMethods = true;

  return (key, stateKey) => {

    if (options.length <= 1)
      log.warn(`The key "${key}" for addHoney("${stateKey}") is using canBeOneOf() but is only passing one argument. Please ensure you pass multiple options of the same type`);

    const passedOptionTypes = {};
    const returnOptions = [];

    try {
      options.forEach(option => {

        // TODO - I need to eventually check to ensure that no options are strings from arrayTypes.

        const optionType = typeof option;
        if (optionType !== "string" && optionType !== "number")
          throw new Error(`Redux-Honey: \n The key "${key}" for addHoney("${stateKey}") is using canBeOneOf() but is passing options with a typeof "${optionType}". Currently the only supported option types are "string" and "number".`);

        passedOptionTypes[optionType] = true;
        returnOptions.push(option);

        if (Object.keys(passedOptionTypes).length > 1)
          throw new Error(`Redux-Honey: \n The key "${key}" for addHoney("${stateKey}") is using canBeOneOf() but is passing arguments of more than one type. Currently canBeOneOf() only supports one type at a time - please ensure all of your arguments are either of type "string" or "number"`);
      });
    } catch(error) {
      log.error(error);
    }

    return JSON.stringify(returnOptions);
  }
}
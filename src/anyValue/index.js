import log from "../utils/log";

export default initialValue => {

  window.isAddHoneyUsingTypeSafeMethods = true;

  return (key, stateKey) => {

    if (typeof initialValue === "undefined") {
      log.warn(`The key "${initialValue}" for addHoney("${stateKey}") wasn't given an initialValue. This will default to null.`);
      initialValue = null;
    }

    return {
      __honeyType: "anyValue",
      __initialValue: initialValue,
      __valueType: null // set in "typeMapAndUpdateInitialStates"
    }
  }
}
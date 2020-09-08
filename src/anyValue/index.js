import log from "../utils/log";
import buildHoneyType from "../buildHoneyType";

export default initialValue => {

  window.isAddHoneyUsingTypeSafeMethods = true;

  return (key, stateKey) => {

    if (typeof initialValue === "undefined") {
      log.warn(`The key "${initialValue}" for addHoney("${stateKey}") wasn't given an initialValue. This will default to null.`);
      initialValue = null;
    }

    return buildHoneyType("anyValue", initialValue);
  }
}
import log from "../utils/log";
import buildHoneyType from "../buildHoneyType";

export default initialValue => {

  window.isAddHoneyUsingTypeSafeMethods = true;

  return (key, stateKey) => {

    if (typeof initialValue === "undefined")
      initialValue = null;
    
    return buildHoneyType("anyValue", initialValue);
  }
}

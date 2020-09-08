
const buildHoneyType = (type, initialValue, additionalKeyValues = {}) => ({
  __honeyType: type,
  __initialValue: initialValue,
  ...additionalKeyValues
});

export default buildHoneyType;
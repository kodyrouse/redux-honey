
export default function (input) {
  return (isValueArray(input))
    ? shallowCloneArray(input)
    : (isValueObject(input))
    ? Object.assign({}, input)
    : input
}

function shallowCloneArray(array) {
  const newArray = [];
  const arrayLn = array.length;
  
  for (let i = 0; i < arrayLn; i++) {
    newArray.push(array[i]);
  }

	return newArray;
};

function isValueObject(input) {
	return typeof input === "object"
}

function isValueArray(input) {
	return Array.isArray(input)
}

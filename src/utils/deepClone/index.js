
export default function (input) {

	// Prevents invalid input
	if (validateNull(input) || !validateInputForDeepClone(input))
		return input;

	// Starts deep clone of array || object depending on input
	// I use validateArray first because typeof "object" passes true for an array
	return (validateArray(input)) ? deepCloneArray(input) : deepCloneObject(input);
}

function deepCloneObject(object) {

	const newObject = {};
	const objectKeys = Object.keys(object);

	objectKeys.forEach(function (key) {
		const priorVal = object[key];
		const newValue = copyValue(priorVal);
		newObject[key] = newValue;
	});

	return newObject;
};

function deepCloneArray(array) {

	const newArray = [];

	array.forEach(function (value) {
		const newValue = copyValue(value);
		newArray.push(newValue);
	});

	return newArray;
};

function copyValue(priorVal) {
	return (validateNull(priorVal))
	? priorVal
	:	(validateArray(priorVal))
	? deepCloneArray(priorVal)
	: (validateObject(priorVal))
	? deepCloneObject(priorVal)
	: priorVal
}

function validateNull(input) {
	return input === null
}

function validateObject(input) {
	return typeof input === "object"
}

function validateArray(input) {
	return Array.isArray(input)
}

function validateInputForDeepClone(input) {
	return validateObject(input) || validateArray(input)
};

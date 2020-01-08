
export default input => {

	// Prevents invalid input
	if (validateNull(input) || !validateInputForDeepClone(input))
		return input;

	// Starts deep clone of array || object depending on input
	// I use validateArray first because typeof "object" passes true for an array
	return (validateArray(input)) ? deepCloneArray(input) : deepCloneObject(input);
}


const deepCloneObject = object => {

	const newObject = {};
	const objectKeys = Object.keys(object);

	objectKeys.forEach(key => {

		const priorVal = object[key];

		// Either recursively deep clones nested object / array or copies object value for new key value
		const newValue = copyValue(priorVal);
		newObject[key] = newValue;
	});

	return newObject;
};

const deepCloneArray = array => {

	const newArray = [];

	array.forEach(value => {
		const newValue = copyValue(value);
		newArray.push(newValue);
	});

	return newArray;
};

const copyValue = priorVal => (validateNull(priorVal)
	? priorVal
	:	(validateArray(priorVal))
	? deepCloneArray(priorVal)
	: (validateObject(priorVal))
	? deepCloneObject(priorVal)
	: priorVal
);

const validateNull = input => (
	input === null
)

const validateObject = input => (
	typeof input === "object"
)

const validateArray = input => (
	Array.isArray(input)
)

const validateInputForDeepClone = input => (
	validateObject(input) || validateArray(input)
);

import { createStore, combineReducers } from "redux";
import deepClone from "./src/utils/deepClone";
import wait from "./src/utils/wait";
import createExtract from "./src/createExtract";
import createHoneyProvider from "./src/createHoneyProvider";



let store = null;
let extract = () => {};
let initialStates = {};
let stateKeys = {};
const RESET_STORE = "__rootStore/__RESET_STORE";

const defaultGetStateOptions = {
	getItemIndex: false,
	returnOriginal: false
}

const defaultResetStateOptions = {
	keepKeyValues: []
}






const createHoneyPot = (combinedState) => {

	if (!isCombinedStateValid(combinedState))
		return console.error(`Redux-Honey: \n Could not call createHoneyPot() - the passed combinedState was not built with redux-honey.`);

	store = createStore(getRootReducer(combinedState));
	extract = createExtract(store);
	return createHoneyProvider(store);
}

const addHoney = (stateKey, initialState) => {

	if (!isUniqueAndValidStateKey(stateKey))
		return console.error(`Redux-Honey: \n Unable to call addHoney() - the stateKey must be a unique, non-empty string. The given stateKey was ${stateKey}`);

	addStateKeyToStateKeys(stateKey);
	addInitialStateToInitialStates(stateKey, initialState);

	return {
		set: createSetState(stateKey),
		get: createGetState(stateKey),
		reset: createResetState(stateKey),
		__stateKey: stateKey,
		__reducer: createReducer(stateKey, initialState)
	}
}

const resetStoreToInitialState = () => {

	if (!store)
		return handleStoreNotSetError("resetStoreToInitialState()");

	store.dispatch({ type: RESET_STORE });
}

export {
	createHoneyPot,
	addHoney,
	extract,
	wait,
	resetStoreToInitialState
};



const getRootReducer = (combinedState) => {

	if (Object.keys(combinedState).length === 0)
		console.error(`Redux-Honey: No state pieces were passed into createHoneyPot(). Please ensure you pass in an object of state pieces created with the addHoney() method.`);

	const rootReducer = {};

	Object.keys(combinedState).forEach((stateKey, index) => {

		const state = combinedState[stateKey];

		if (!state.__reducer)
			return console.error(`Redux-Honey: \n Passed state ${stateKey} into createHoneyPot() was not created with addHoney()`);

		rootReducer[stateKey] = state.__reducer;

		delete state.__reducer;
	});

	return combineReducers(rootReducer);
}

const createReducer = (stateKey, initialState) => (
	(state = initialState, { type, payload }) => ((shouldUpdateState(type, stateKey))
		? updateState(state, payload)
		: (type === RESET_STORE)
		? deepClone(initialState)
		: state
	)
)

const updateState = (state, payload) => (
	Object.assign({}, state, payload)
);

const createSetState = stateKey => payload => {

	if (!store)
		return handleStoreNotSetError(`state.set() for ${stateKey}`);

	const invalidKeysInPayload = checkIfPayloadKeysExistInState(stateKey, payload);
	if (invalidKeysInPayload.length)
		return handleGivenInvalidKeysError(invalidKeysInPayload, payload, stateKey);

	store.dispatch({ type: stateKey, payload });
}

const createGetState = stateKey => (string, options) => {

	if (!store)
		return handleStoreNotSetError(`state.get() for ${stateKey}`);

	try {

		options = setGetStateOptions(options, stateKey);
		let state = getRootStateItemByStateKey(stateKey);

		if (!canGetNestedStatePiecesWithString(string))
			return state;

		const keys = string.split(".");

		keys.forEach(key => {
			state = getStatePieceWithKey(state, key, options);
		});

		return (options.returnOriginal)
			? state
			: deepClone(state);
	} catch(error) {
		console.error(`Redux-Honey: \n Could not getState() for the given string "${string}". \n ${error}. Please ensure the string passed is a dot-separated string`);
	}
}

const createResetState = stateKey => (options) => {

	if (!store)
		return handleStoreNotSetError(`state.reset() for ${stateKey}`);

	options = setResetStateOptions(options, stateKey);
	const { keepKeyValues } = options;

	let newState = deepClone(initialStates[stateKey]);

	if (keepKeyValues.length)
		newState = Object.assign({}, newState, getObjectValuesForKeys(stateKey, keepKeyValues));

	store.dispatch({ type: stateKey, payload: newState });
}









const isUniqueAndValidStateKey = stateKey => (
	stateKey && typeof stateKey === "string" && !stateKeys[stateKey] && stateKey.length > 0
)

const addStateKeyToStateKeys = stateKey => {
	stateKeys[stateKey];
}

const addInitialStateToInitialStates = (stateKey, initialState) => {
	initialStates[stateKey] = deepClone(initialState);
}

const canGetNestedStatePiecesWithString = string => (
	string && typeof string === "string" && string.length > 0
)

const shouldUpdateState = (type, stateKey) => (
	type === stateKey
);

const isCombinedStateValid = combinedState => (
	combinedState && typeof combinedState === "object"
)

const handleStoreNotSetError = uncalledMethodName => {
	console.error(`Redux-Honey: \n Unable to call ${uncalledMethodName} - the store was not set`);
}

const getPropertyKeyAndValue = key => {

	const splitKeyAndValue = key.slice(1, -1).split("=");
	if (splitKeyAndValue.length !== 2)
		throw new Error(`Could not get passed property key and value for array item. If you want to use the getState() method to retrieve an item in an array by a given key-value match, it must follow the pattern [key=value]. `)

	return {
		propertyKey: splitKeyAndValue[0],
		propertyValue: (!isNaN(splitKeyAndValue[1]))
			? parseFloat(splitKeyAndValue[1])
			: splitKeyAndValue[1]
	}
}


const getKeyForInitialState = stateKey => `${stateKey}${RESET_STORE}`;

const getObjectValuesForKeys = (stateKey, keepKeyValues) => {

	const state = getRootStateItemByStateKey(stateKey);
	let stateToKeep = {};

	const keepKeyValuesLn = keepKeyValues.length;
	keepKeyValues.forEach(key => {
		if (typeof state[key] !== "undefined")
			stateToKeep[key] = state[key]
		else
			console.warn(`Redux-Honey: \n Given keepKeyValues key -> ${key} for state.reset() does not exist for ${stateKey}. The key -> ${key} is likely misspelled or it needs to be added to the passed initialState when calling addHoney().`);
	});

	return stateToKeep;
}

const checkIfPayloadKeysExistInState = (stateKey, payload) => {

	if (!payload)
		return true;

	const state = store.getState()[stateKey];
	let payloadKeyErrors = [];

	Object.keys(payload).forEach(payloadKey => {
		if (typeof state[payloadKey] === "undefined") {
			payloadKeyErrors.push(payloadKey);
			return;
		}
	});

	return payloadKeyErrors;
}


const getRootStateItemByStateKey = stateKey => (
	store.getState()[stateKey]
)

const getStatePieceWithKey = (state, key, options) => ((keyIsPropertyOnArrayObject(key) && options.getItemIndex)
	? getIndexOfArrayItem(state, key)
	: keyIsPropertyOnArrayObject(key)
	? getArrayItemByPropertyKey(state, key)
	: (keyIsIndexForArrayItem(key))
	? getArrayItemByIndex(state, key)
	: state[key]
);

const keyIsIndexForArrayItem = key => (
	(key.slice(0, 1) === "[") && (key.slice(key.length - 1, key.length) === "]")
);

const keyIsPropertyOnArrayObject = key => (
	keyIsIndexForArrayItem(key) && (isNaN(key.slice(1, -1)))
)

const getIndexOfArrayItem = (state, key) => {

	if (!Array.isArray(state))
		throw new Error("Could not get index of item from array - parent state piece is not an array");

	const { propertyKey, propertyValue } = getPropertyKeyAndValue(key);

	const itemIndex = state.findIndex(stateItem => stateItem[propertyKey] === propertyValue);
	if (itemIndex < 0)
		throw new Error(`No item in the given array was found with ${propertyKey} = ${propertyValue}. Ensure you passed a property key that exists`);

	return itemIndex;
}

const getArrayItemByIndex = (state, key) => {

	if (!Array.isArray(state))
		throw new Error("Could not get item from array - parent state piece is not an array");

	if (isNaN(key.slice(1, -1)))
		throw new Error(`Given index for array is not a number ${key.slice(1, -1)}. To get an item from an array by its index, please ensure you pass a number`);

	const index = parseInt(key.slice(1, -1));
	if (index < 0 || index >= state.length)
		throw new Error(`Given index ${index} is out of range. The array's length is ${state.length}`);

	return state[index];
}

const getArrayItemByPropertyKey = (state, key) => {

	if (!Array.isArray(state))
		throw new Error("Could not get item from array - parent state piece is not an array");

	const { propertyKey, propertyValue } = getPropertyKeyAndValue(key);

	return state.find(stateItem => stateItem[propertyKey] == propertyValue);
}

const setGetStateOptions = (options = {}, stateKey) => {

	if (typeof options !== "object" || Array.isArray(options))
		throw new Error(`Invalid options type for ${stateKey} state.get(). Please ensure the passed options are an object`);

	const getStateOptions = Object.assign({}, defaultGetStateOptions, options);
	confirmGetStateOptionsAreValid(getStateOptions, stateKey);

	return Object.assign({}, defaultGetStateOptions, options);
}

const setResetStateOptions = (options = {}, stateKey) => {

	if (typeof options !== "object" || Array.isArray(options))
		throw new Error(`Invalid options type for ${stateKey} state.reset(). Please ensure the passed options are an object`);

	return Object.assign({}, defaultResetStateOptions, options);
}

const confirmGetStateOptionsAreValid = (options, stateKey) => {

	const { getItemIndex, returnOriginal } = options;

	if (getItemIndex && returnOriginal)
		throwInvalidGetStateOptionsError(stateKey, "you have returnOriginal && getItemIndex set to true, which is not possible");

	Object.keys(options).forEach(option => {
		if (typeof defaultGetStateOptions[option] === "undefined")
			throwInvalidGetStateOptionsError(stateKey, `${option} is not a usable option. Please checkout https://github.com/kodyrouse/redux-honey for available options`);
	});
}

const throwInvalidGetStateOptionsError = (stateKey, message) => {
	throw new Error(`Invalid options for ${stateKey} state.get() - ${message}`);
}

const handleGivenInvalidKeysError = (invalidKeysInPayload, payload, stateKey) => {
	console.warn(`Redux-Honey: \n Could not call state.set() for ${stateKey}. Given payload contains keys [${invalidKeysInPayload}] that do not exist in the initialState for ${stateKey}. Payload keys are either misspelled or keys [${invalidKeysInPayload}] need to be added to the passed initialState when calling addHoney().`);
}
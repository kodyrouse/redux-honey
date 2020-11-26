import { createStore, combineReducers } from "redux";
import deepClone from "./src/utils/deepClone";
import log from "./src/utils/log";
import nap from "./src/utils/nap";




let store = null;
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

	if (store !== null)
		return log.error(`Could not call createHoneyPot() - a redux honeyPot was already created. It's best practice to create one store and add addHoney() state to your store as needed. If your application uses code-splitting techniques, lazy load your components so only one store is loaded & created`);

	if (!isCombinedStateValid(combinedState))
		return log.error(`Could not call createHoneyPot() - the passed combinedState was not built with redux-honey.`);
	
	store = createStore(getRootReducer(combinedState));
	return store;	
}

const addHoney = (stateKey, initialState) => {

	if (!isUniqueAndValidStateKey(stateKey))
		return log.error(`Unable to call addHoney("${stateKey}") - the stateKey must be a unique, non-empty string. The given stateKey was ${stateKey}`);

	if (Array.isArray(initialState) || typeof initialState !== "object")
		return log.error(`Unable to call addHoney("${stateKey}") - the given initialState was not an object`);

	addStateKeyToStateKeys(stateKey);
	addInitialStateToInitialStates(stateKey, initialState);

	return {
		set: createSetState(stateKey),
		get: createGetState(stateKey),
		resetKey: createResetKey(stateKey),
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
	nap,
	resetStoreToInitialState
};



const getRootReducer = (combinedState) => {

	if (Object.keys(combinedState).length === 0)
		log.error(`No state pieces were passed into createHoneyPot(). Please ensure you pass in an object of state pieces created with the addHoney() method.`);

	const rootReducer = {};

	Object.keys(combinedState).forEach((objectKey, index) => {

		const state = combinedState[objectKey];
		
		if (!isReducerOrAddHoney(state)) {
			log.error(`Passed state ${(isAddHoney(state)) ? state.__stateKey : objectKey} into createHoneyPot() was not created with addHoney() nor is a redux reducer`);
		}
		
		if (typeof state === "function") {
			rootReducer[objectKey] = state;
		} else if (isAddHoney(state)) {
			rootReducer[state.__stateKey] = state.__reducer;
			delete state.__reducer;
		}
	});
	
	return combineReducers(rootReducer);
}

const isReducerOrAddHoney = (state) => (
	typeof state === "function" || isAddHoney(state)
)

const isAddHoney = (object) => (
	!Array.isArray(object)
	&& typeof object === "object"
	&& object.__reducer !== undefined
)

const createReducer = (stateKey, initialState) => (
	(state = initialState, { type, payload }) => (type === stateKey)
		? updateState(state, payload)
		: (type === RESET_STORE)
		? deepClone(initialStates[stateKey])
		: state
)

const updateState = (state, payload) => (
	Object.assign({}, state, payload)
)

const createSetState = stateKey => payload => {

	if (!store) return handleStoreNotSetError(`state.set() for ${stateKey}`);

	try {

		const invalidKeysInPayload = checkIfPayloadKeysExistInState(stateKey, payload);
		if (invalidKeysInPayload.length) 
			throw new Error(`Redux-Honey: \n Could not call state.set() for "${stateKey}". Given payload contains keys [${invalidKeysInPayload}] that do not exist in the initialState for ${stateKey}. Payload keys are either misspelled or keys [${invalidKeysInPayload}] need to be added to the passed initialState when calling addHoney().`);

		// if (createHoneyPotOptions.typeSafe) {
		// 	const payloadTypeCheckErrors = typeCheckPayload(payload, statesTypeMap[stateKey]);
		// 	if (payloadTypeCheckErrors.length)
		// 		throw new Error(`Redux-Honey: \n Could not call state.set() for "${stateKey}". Given payload had the following typeSafe errors: \n ${payloadTypeCheckErrors}`);
		// }

		store.dispatch({ type: stateKey, payload });

	} catch(error) {
		console.error(error);
	}
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
		let keychain = "";

		keys.forEach(key => {

			state = getStatePieceWithKey(state, key, options);
			keychain += (keychain.length) ? `.${key}` : key;

			if (typeof state === "undefined")
				throw new Error(`Redux-Honey: \n Could not call state.get() for state "${stateKey}". Please ensure the string passed is a dot-separated string & the requested state ("${keychain}") does not exist on "${stateKey}"`);
		});

		return (options.returnOriginal)
			? state
			: deepClone(state);
	} catch(error) {
		console.error(error);
	}
}

const createResetKey = stateKey => key => {

	if (!store)
		return handleStoreNotSetError(`state.reset() for ${stateKey}`);

	if (!key)
		return log.warn(`Could not call state.resetKey() - No key given`);

	const initialStateForKey = initialStates[stateKey][key];
	if (typeof initialStateForKey === "undefined")
		return log.warn(`Could not call state.resetKey() - The given key "${key}" does not exist for stateKey "${stateKey}"`);


	store.dispatch({ type: stateKey, payload: { [key]: deepClone(initialStateForKey) }});
}

const createResetState = stateKey => options => {

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

const isCombinedStateValid = combinedState => (
	combinedState && typeof combinedState === "object" && Object.keys(combinedState).length
)

const handleStoreNotSetError = uncalledMethodName => {
	log.error(`Unable to call ${uncalledMethodName} - the store was not set`);
	return null
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
			log.warn(`Given keepKeyValues key -> ${key} for state.reset() does not exist for ${stateKey}. The key -> ${key} is likely misspelled or it needs to be added to the passed initialState when calling addHoney().`);
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

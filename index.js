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

function createHoneyPot(combinedState) {

	if (store !== null)
		return log.error(`Could not call createHoneyPot() - a redux honeyPot was already created. It's best practice to create one store and add addHoney() state to your store as needed. If your application uses code-splitting techniques, lazy load your components so only one store is loaded & created`);

	if (!isCombinedStateValid(combinedState))
		return log.error(`Could not call createHoneyPot() - the passed combinedState was not built with redux-honey.`);
	
	store = createStore(getRootReducer(combinedState));
	return store;	
}

function addHoney(stateKey, initialState) {

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

function resetStoreToInitialState() {

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



function getRootReducer(combinedState) {

	if (Object.keys(combinedState).length === 0)
		log.error(`No state pieces were passed into createHoneyPot(). Please ensure you pass in an object of state pieces created with the addHoney() method.`);

	const rootReducer = {};

	Object.keys(combinedState).forEach(function (objectKey) {

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

function isReducerOrAddHoney(state) {
	return typeof state === "function" || isAddHoney(state)
}

function isAddHoney(object) {
	return (
		!Array.isArray(object)
		&& typeof object === "object"
		&& object.__reducer !== undefined
	)
}

function createReducer(stateKey, initialState) {
	return function (state = initialState, { type, payload }) {
		return (type === stateKey)
		? updateState(state, payload)
		: (type === RESET_STORE)
		? deepClone(initialStates[stateKey])
		: state
	}
}

function updateState(state, payload) {
	return Object.assign({}, state, payload)
}

function createSetState(stateKey) {
	return function (payload) {

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
}

function createGetState(stateKey) {
	return function (string, options) {

		if (!store)
			return handleStoreNotSetError(`state.get() for ${stateKey}`);

		try {

			options = setGetStateOptions(options, stateKey);
			let state = getRootStateItemByStateKey(stateKey);

			if (!canGetNestedStatePiecesWithString(string))
				return state;

			const keys = string.split(".");
			let keychain = "";

			keys.forEach(function (key) {

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
}

function createResetKey(stateKey) {
	return function (key) {

		if (!store)
			return handleStoreNotSetError(`state.reset() for ${stateKey}`);

		if (!key)
			return log.warn(`Could not call state.resetKey() - No key given`);

		const initialStateForKey = initialStates[stateKey][key];
		if (typeof initialStateForKey === "undefined")
			return log.warn(`Could not call state.resetKey() - The given key "${key}" does not exist for stateKey "${stateKey}"`);


		store.dispatch({ type: stateKey, payload: { [key]: deepClone(initialStateForKey) }});
	}
}

function createResetState(stateKey) {
	return function (options = {}) {

		if (!store)
			return handleStoreNotSetError(`state.reset() for ${stateKey}`);

		const { keepKeyValues = [] } = options;

		let newState = deepClone(initialStates[stateKey]);

		if (keepKeyValues.length)
			newState = Object.assign({}, newState, getObjectValuesForKeys(stateKey, keepKeyValues));

		store.dispatch({ type: stateKey, payload: newState });
	}
}









function isUniqueAndValidStateKey(stateKey) {
	return (
		stateKey
		&& typeof stateKey === "string"
		&& !stateKeys[stateKey]
		&& stateKey.length > 0
	)
}

function addStateKeyToStateKeys(stateKey) {
	stateKeys[stateKey];
}

function addInitialStateToInitialStates(stateKey, initialState) {
	initialStates[stateKey] = deepClone(initialState);
}

function canGetNestedStatePiecesWithString(string) {
	return (
		string
		&& typeof string === "string"
		&& string.length > 0
	)
}

function isCombinedStateValid(combinedState) {
	return (
		combinedState
		&& typeof combinedState === "object"
		&& Object.keys(combinedState).length
	)
}

function handleStoreNotSetError(uncalledMethodName) {
	log.error(`Unable to call ${uncalledMethodName} - the store was not set`);
	return null
}

function getPropertyKeyAndValue(key) {

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

function getKeyForInitialState(stateKey) {
	return `${stateKey}${RESET_STORE}`;
}

function getObjectValuesForKeys(stateKey, keepKeyValues) {

	const state = getRootStateItemByStateKey(stateKey);
	let stateToKeep = {};

	const keepKeyValuesLn = keepKeyValues.length;
	keepKeyValues.forEach(function (key) {
		if (typeof state[key] !== "undefined")
			stateToKeep[key] = state[key]
		else
			log.warn(`Given keepKeyValues key -> ${key} for state.reset() does not exist for ${stateKey}. The key -> ${key} is likely misspelled or it needs to be added to the passed initialState when calling addHoney().`);
	});

	return stateToKeep;
}

function checkIfPayloadKeysExistInState(stateKey, payload) {

	if (!payload)
		return true;

	const state = store.getState()[stateKey];
	let payloadKeyErrors = [];

	Object.keys(payload).forEach(function (payloadKey) {
		if (typeof state[payloadKey] === "undefined") {
			payloadKeyErrors.push(payloadKey);
			return;
		}
	});

	return payloadKeyErrors;
}


function getRootStateItemByStateKey(stateKey) {
	return store.getState()[stateKey]
}

function getStatePieceWithKey(state, key, options) {
	return (keyIsPropertyOnArrayObject(key) && options.getItemIndex)
	? getIndexOfArrayItem(state, key)
	: keyIsPropertyOnArrayObject(key)
	? getArrayItemByPropertyKey(state, key)
	: (keyIsIndexForArrayItem(key))
	? getArrayItemByIndex(state, key)
	: state[key]
}

function keyIsIndexForArrayItem(key) {
	return (key.slice(0, 1) === "[") && (key.slice(key.length - 1, key.length) === "]")
};

function keyIsPropertyOnArrayObject(key) {
	return keyIsIndexForArrayItem(key) && (isNaN(key.slice(1, -1)))
}

function getIndexOfArrayItem(state, key) {

	if (!Array.isArray(state))
		throw new Error("Could not get index of item from array - parent state piece is not an array");

	const { propertyKey, propertyValue } = getPropertyKeyAndValue(key);

	const itemIndex = state.findIndex(function (stateItem) {
		return stateItem[propertyKey] === propertyValue
	});
	
	if (itemIndex < 0)
		throw new Error(`No item in the given array was found with ${propertyKey} = ${propertyValue}. Ensure you passed a property key that exists`);

	return itemIndex;
}

function getArrayItemByIndex(state, key) {

	if (!Array.isArray(state))
		throw new Error("Could not get item from array - parent state piece is not an array");

	if (isNaN(key.slice(1, -1)))
		throw new Error(`Given index for array is not a number ${key.slice(1, -1)}. To get an item from an array by its index, please ensure you pass a number`);

	const index = parseInt(key.slice(1, -1));
	if (index < 0 || index >= state.length)
		throw new Error(`Given index ${index} is out of range. The array's length is ${state.length}`);

	return state[index];
}

function getArrayItemByPropertyKey(state, key) {

	if (!Array.isArray(state))
		throw new Error("Could not get item from array - parent state piece is not an array");

	const { propertyKey, propertyValue } = getPropertyKeyAndValue(key);

	return state.find(function (stateItem) {
		return stateItem[propertyKey] == propertyValue
	});
}

function setGetStateOptions(options = {}, stateKey) {
	return Object.assign({}, defaultGetStateOptions, options);
}

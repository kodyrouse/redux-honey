import deepClone from "./src/utils/deepClone";



let store = null;
let initialStates = {};
let stateKeys = {};
const RESET_STORE = "__rootStore/__RESET_STORE";

const defaultGetStateOptions = {
	returnOriginal: false,
	getIndexOfItem: false
}





export const sugarcoatStore = injectedStore => {

	if (!canInjectStore(injectedStore))
		return console.warn(`Redux-Sugar: \n Could not call sugarcoatStore() - passed store is not a redux store.`);

	store = injectedStore;
}

export const addSugar = (stateKey, initialState) => {

	if (!isValidStateKey(stateKey))
		return console.warn(`Redux-Sugar: \n Unable to call addSugar() - the stateKey must be a unique, non-empty string. The given stateKey was ${stateKey}`);

	addStateKeyToStateKeys(stateKey);
	addInitialStateToInitialStates(stateKey, initialState);

	return { 
		reducer: createReducer(stateKey, initialState),
		updateState: createUpdateState(stateKey),
		getState: createGetState(stateKey),
		resetState: createResetState(stateKey)
	}
}

export const resetStoreToInitialState = () => {

	if (!store)
		return handleStoreNotSetError("resetStoreToInitialState()");

	store.dispatch({ type: RESET_STORE });
}

export wait from "./src/utils/wait";








const createReducer = (stateKey, initialState) => (
	(state = initialState, { type, payload }) => ((shouldUpdateState(type, stateKey))
		? {...state, ...payload}
		: (type === RESET_STORE)
		? deepClone(initialState)
		: state
	)
)

const createUpdateState = stateKey => payload => {

	if (!store)
		return handleStoreNotSetError(`updateState() for ${stateKey}`);

	const invalidKeysInPayload = checkIfPayloadKeysExistInState(stateKey, payload);
	if (invalidKeysInPayload.length)
		return handleGivenInvalidPayloadKeys(invalidKeysInPayload, payload, stateKey);

	store.dispatch({ type: stateKey, payload });
}

const createGetState = stateKey => (string, options = defaultGetStateOptions) => {

	if (!store)
		return handleStoreNotSetError(`getState() for ${stateKey}`);

	try {

		let state = getRootStateItemByStateKey(stateKey);
		if (!canGetStateWithString(string)) return state;

		const keys = string.split(" ");

		keys.forEach(key => {
			state = getStatePieceWithKey(state, key);
		});

		return (returnOriginal) ? state : cloneState(state);

	} catch(error) {
		console.warn(`Redux-Sugar: \n Could not getState() for the given string "${string}"`);
		console.warn(`Redux-Sugar: \n ${error}`);
	}
}

const createResetState = stateKey => () => {

	if (!store)
		return handleStoreNotSetError(`resetState() for ${stateKey}`);

	const initialState = deepClone(initialStates[stateKey]);
	store.dispatch({ type: stateKey, payload: initialState });
}









const isValidStateKey = stateKey => (
	stateKey && typeof stateKey === "string" && !stateKeys[stateKey] && stateKey.length > 0
)

const addStateKeyToStateKeys = stateKey => {
	stateKeys[stateKey];
}

const addInitialStateToInitialStates = (stateKey, initialState) => {
	initialStates[stateKey] = deepClone(initialState);
}

const canGetStateWithString = string => (
	string && typeof string === "string" && string.length > 0
)

const shouldUpdateState = (type, stateKey) => (
	type === stateKey
);

const canInjectStore = store => (
	store && typeof store === "object" && store.getState && store.dispatch
)

const handleStoreNotSetError = uncalledMethodName => {
	console.warn(`Redux-Sugar: \n Unable to call ${uncalledMethodName} - please ensure you pass your store into sugarcoatStore() correctly when instantiating your store.`);
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

const cloneState = state => (state == null
	? null
	: Array.isArray(state)
	? [...state]
	: (typeof state === "object")
	? {...state}
	: state
);

const getKeyForInitialState = stateKey => `${stateKey}${RESET_STORE}`;

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

const getStatePieceWithKey = (state, key) => (keyIsPropertyOnArrayObject(key)
	? getArrayItemByPropertKey(state, key)
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

const getArrayItemByPropertKey = (state, key) => {

	if (!Array.isArray(state))
		throw new Error("Could not get item from array - parent state piece is not an array");

	const { propertyKey, propertyValue } = getPropertyKeyAndValue(key);

	const arrayItem = state.find(stateItem => stateItem[propertyKey] === propertyValue);
	if (!arrayItem)
		throw new Error(`No item in the given array with a property ${propertyKey} with a value of ${propertyValue}. Ensure you passed a property key that exists `);

	return arrayItem;
}

const handleGivenInvalidPayloadKeys = (invalidKeysInPayload, payload, stateKey) => {
	console.warn(`Redux-Sugar: \n Could not call updateState() for ${stateKey}. Given payload contains keys that do not exist in the initialState for ${stateKey} - [${invalidKeysInPayload}]. Payload keys are either misspelled or keys [${invalidKeysInPayload}] need to be added to the passed initialState when calling addSugar().`);
}
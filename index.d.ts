declare module "redux-honey"

type HoneyState = {
  get: (keyChain: string, options: object) => any
  set: (objectValues: object) => void
  reset: () => void
  resetKey: (key: string) => void
}

export function addHoney(key: string, initialState: object): HoneyState
export function nap(duration: number): promise
export function createHoneyPot(statesObject: object): object
export function extract(extractMethod: function, component: function): function
export function resetStoreToInitialState(): void
export function canBeOneOf(optionOne: any, optionTwo: any): function
export function arrayOf(arrayItem: any): function
export function anyValue(initalState: any): function

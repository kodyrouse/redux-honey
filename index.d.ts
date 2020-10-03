import { Store } from "redux"

declare module "redux-honey"

type ResetStateOptions = {
  keepKeyValues?: string[]
}

type HoneyState = {
  get: (keyChain?: string, options?: object) => any
  set: (objectValues: object) => void
  reset: (options?: ResetStateOptions) => void
  resetKey: (key: string) => void
}

type HoneyPotOptions = {
  typeSafe?: boolean
}

export function addHoney(key: string, initialState: object): HoneyState
export function nap(duration: number): Promise<any>
export function createHoneyPot(statesObject: object, options?: HoneyPotOptions): Store
export function extract(extractMethod: Function, component: Function): Function
export function resetStoreToInitialState(): void
export function canBeOneOf(...args: any[]): Function
export function arrayOf(arrayItem: any): Function
export function anyValue(initalState?: any): Function

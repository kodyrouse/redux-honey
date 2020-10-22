import { Store } from "redux"

declare module "redux-honey"

type ResetStateOptions = {
  keepKeyValues?: string[]
}

type HoneyState<T> = {
  get: (keyChain?: string, options?: object) => any
  set: (objectValues: Partial<T>) => void
  reset: (options?: ResetStateOptions) => void
  resetKey: (key: string) => void
}

export function addHoney<T>(key: string, initialState: T): HoneyState<T>

export function nap(duration: number): Promise<any>
export function createHoneyPot(statesObject: object): Store
export function extract(extractMethod: Function, component: Function): Function
export function resetStoreToInitialState(): void
export function canBeOneOf(...args: any[]): Function
export function arrayOf(arrayItem: any): Function
export function anyValue(initalState?: any): Function

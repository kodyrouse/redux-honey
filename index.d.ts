import { Store } from "redux"

declare module "redux-honey"

type ResetStateOptions = {
  keepKeyValues?: string[]
}

type HoneyState<T> = {
  
  /**
   * Gets key-value pairs for this given piece of state in the store
   */
  get: (keyChain?: string, options?: object) => any
  
  /**
   * Sets key-value pairs for this given piece of state in the store
   */
  set: (objectValues: Partial<T>) => void
  
  /**
   * Resets the data is this state back to what it was originally set to
   */
  reset: (options?: ResetStateOptions) => void
  
  /**
   * Resets a given key's value back to its initial value that was set
   */
  resetKey: (key: string) => void
}

/**
 * 
 * @param key 
 * @param initialState 
 * Creates a piece of state that is then added to createHoneyPot
 */
export function addHoney<T>(key: string, initialState: T): HoneyState<T>

/**
 * 
 * @param duration 
 * Pauses for a given amount of time
 */
export function nap(duration: number): Promise<any>

/**
 * 
 * @param statesObject
 * Used to create your redux-honey store. If using with react and react-redux, pass the returned store
 * into <Provider> component
 */
export function createHoneyPot(statesObject: object): Store

/**
 * 
 * @param extractMethod 
 * @param component 
 * Used to bind state to react components. React-redux's connect() method is recommended over the
 * extract()
 */
export function extract(extractMethod: Function, component: Function): Function

/**
 * Reset's all store values back to their initial state
 */
export function resetStoreToInitialState(): void

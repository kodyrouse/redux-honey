import { addHoney, createHoneyPot } from "../";

describe("getRootReducer properly creates a root reducer", () => {
  
  test("accepts addHoney state", () => {
    const testState = addHoney("testState", {
      name: "Kody",
      age: 28
    });
    
    expect(createHoneyPot({ testState })).toBeInstanceOf(Object);
  });
  
  test("accepts redux state", () => {
    
    const initialState = {
      name: "Kody",
      age: 28
    }
    
    const testReducer = (state = initialState, { type, payload }) => {
      
    }
    
    expect(createHoneyPot({ testState })).toBeInstanceOf(Object);
  });
})

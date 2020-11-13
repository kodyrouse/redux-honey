import { addHoney, createHoneyPot } from "../";

describe("getRootReducer properly creates a root reducer", () => {
  
  test("accepts addHoney state & redux reducer", () => {
    const testState = addHoney("testState", {
      name: "Kody",
      age: 28
    });
    
    const initialState = {
      name: "Kody",
      age: 28
    }
    
    const testReducer = (state = initialState, { type, payload }) => {
      switch(type) {
        case "SET_NAME":
          return { ...state, name: payload.name };
        case "SET_AGE":
          return { ...state, age: payload.age };
        default:
          return state;
      }
    }
    
    expect(createHoneyPot({ testState, testReducer })).toBeInstanceOf(Object);
  });  
})

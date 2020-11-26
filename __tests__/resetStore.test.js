import { addHoney, createHoneyPot, resetStoreToInitialState } from "redux-honey";

describe("resetStoreToInitialState() properly resets all state values", () => {
  
  const testState = addHoney("state", {
    name: "Kody",
    age: 28,
    isFanOfSports: true,
    friends: [],
    aboutMe: {
      isTall: false
    },
    favFoods: ["pizza", "burgers", "steak"]
  });

  createHoneyPot({ testState });
  
  test("properly reset values back to initialState", () => {
    testState.set({ age: 30, name: "Bob" });
    expect(testState.get("name")).toBe("Bob");
    expect(testState.get("age")).toBe(30);
    resetStoreToInitialState();
    expect(testState.get("name")).toBe("Kody");
    expect(testState.get("age")).toBe(28);
  });
});

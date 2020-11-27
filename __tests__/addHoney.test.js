import { addHoney } from "../";

describe("addHoney properly builds expected honey state", () => {
  
  const testState = addHoney("state", {
    name: "Kody",
    age: 27,
    isFanOfSports: true
  });
  
  test("creating state with addHoney", () => {
  
    expect(testState.set).toBeInstanceOf(Function);
    expect(testState.get).toBeInstanceOf(Function);
    expect(testState.resetKey).toBeInstanceOf(Function);
    expect(testState.reset).toBeInstanceOf(Function);
    expect(testState.__stateKey).toBe("state");
    expect(testState.__reducer).toBeInstanceOf(Function);  
  });
});

import { addHoney } from "../";

describe("addHoney() methods properly fail without store being set", () => {
  
  const testState = addHoney("state", {
    name: "Kody",
    age: 27,
    isFanOfSports: true
  });
  
  test("state.get properly logs error when store has not been created", () => {
    const consoleSpy = jest.spyOn(console, "error");
    testState.get();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  
  test("state.set properly logs error when store has not been created", () => {
    const consoleSpy = jest.spyOn(console, "error");
    testState.set({ name: "Bob" });
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });
  
  test("state.reset properly logs error when store has not been created", () => {
    const consoleSpy = jest.spyOn(console, "error");
    testState.reset();
    expect(consoleSpy).toHaveBeenCalledTimes(3);
  });
  
  test("state.resetKey properly logs error when store has not been created", () => {
    const consoleSpy = jest.spyOn(console, "error");
    testState.resetKey("name");
    expect(consoleSpy).toHaveBeenCalledTimes(4);
  });
})

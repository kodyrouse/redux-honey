import { addHoney, createHoneyPot } from "../";

describe("state.reset() & state.resetKey() properly reset state", () => {
  
  const testState = addHoney("state", {
    name: "Kody",
    age: 28,
    isFanOfSports: true,
    friends: [],
    aboutMe: {
      isTall: false
    },
  });

  createHoneyPot({ testState });
  
  test("state.resetKey() resets key back to initial value", () => {
    testState.set({ name: "Bob" });
    expect(testState.get("name")).toBe("Bob");
    testState.resetKey("name");
    expect(testState.get("name")).toBe("Kody");
  });
  
  test("state.resetKey() warns for invalid key", () => {
    const consoleSpy = jest.spyOn(console, "warn");
    testState.resetKey("random");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  
  test("state.resetKey() warns for no key given", () => {
    const consoleSpy = jest.spyOn(console, "warn");
    testState.resetKey();
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });
})

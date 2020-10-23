import { addHoney } from "../";

test("creating state with addHoney", () => {

  const testState = addHoney("testState", {
    name: "Kody",
    age: 27,
    isFanOfSports: true
  });

  expect(testState.set).toBeInstanceOf(Function);
  expect(testState.get).toBeInstanceOf(Function);
  expect(testState.resetKey).toBeInstanceOf(Function);
  expect(testState.reset).toBeInstanceOf(Function);
  expect(testState.__stateKey).toBe("testState");
  expect(testState.__reducer).toBeInstanceOf(Function);
})

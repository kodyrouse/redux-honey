import { addHoney } from "../";

test("creating state with addHoney", () => {

  const testState = addHoney("test", {
    name: "Kody",
    age: 27,
    isFanOfSports: true
  });

  expect(testState.set).toBeInstanceOf(Function);
  expect(testState.get).toBeInstanceOf(Function);
  expect(testState.resetKey).toBeInstanceOf(Function);
  expect(testState.reset).toBeInstanceOf(Function);
  expect(testState.__stateKey).toBe("test");
  expect(testState.__reducer).toBeInstanceOf(Function);
})

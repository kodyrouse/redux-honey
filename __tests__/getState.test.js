import { addHoney, createHoneyPot } from "../";

describe("state.get properly returns values", () => {
  
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
  
  test("state.get properly returns string value", () => {
    expect(testState.get("name")).toBe("Kody");
  });
  
  test("state.get properly returns numeric value", () => {
    expect(testState.get("age")).toBe(28);
  })
  
  test("state.get properly returns boolean value", () => {
    expect(testState.get("isFanOfSports")).toBe(true);
  });
  
  test("state.get properly returns array value", () => {
    expect(testState.get("friends")).toBeInstanceOf(Array);
    expect(testState.get("friends")).toHaveLength(0);
    expect(testState.get("favFoods")[2]).toBe("steak");
  });
  
  test("state.get properly returns object", () => {
    expect(testState.get("aboutMe")).toBeInstanceOf(Object);
    expect(testState.get("aboutMe.isTall")).toBe(false);
  });
});

import { addHoney, createHoneyPot } from "../";

describe("state.get properly returns values", () => {
  
  const state = addHoney("state", {
    name: "Kody",
    age: 28,
    isFanOfSports: true,
    friends: [],
    aboutMe: {
      isTall: false
    },
    favFoods: ["pizza", "burgers", "steak"]
  });

  createHoneyPot({ state });
  
  test("state.get properly returns string value", () => {
    expect(state.get("name")).toBe("Kody");
  });
  
  test("state.get properly returns numeric value", () => {
    expect(state.get("age")).toBe(28);
  })
  
  test("state.get properly returns boolean value", () => {
    expect(state.get("isFanOfSports")).toBe(true);
  });
  
  test("state.get properly returns array value", () => {
    expect(state.get("friends")).toBeInstanceOf(Array);
    expect(state.get("friends")).toHaveLength(0);
    expect(state.get("favFoods")[2]).toBe("steak");
  });
  
  test("state.get properly returns object", () => {
    expect(state.get("aboutMe")).toBeInstanceOf(Object);
    expect(state.get("aboutMe.isTall")).toBe(false);
  });
});

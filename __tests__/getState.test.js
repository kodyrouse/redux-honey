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
    favFoods: ["pizza", "burgers", "steak"],
    friends: [
      { id: 1, name: "Bob" },
      { id: 2, name: "Frank" }
    ]
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
    expect(testState.get("friends")).toHaveLength(2);
    expect(testState.get("favFoods")[2]).toBe("steak");
  });
  
  test("state.get properly returns object", () => {
    expect(testState.get("aboutMe")).toBeInstanceOf(Object);
    expect(testState.get("aboutMe.isTall")).toBe(false);
  });
  
  test("state.get throws error for keys that do not exist", () => {
    const consoleSpy = jest.spyOn(console, "error");
    testState.get("random");
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
  
  test("state.get retrieves item from array", () => {
    expect(testState.get(`friends.[id=1]`)).toEqual({ id: 1, name: "Bob" });
  });
  
  test("state.get retrieves item index from array", () => {
    expect(testState.get(`friends.[id=1]`, { getItemIndex: true })).toEqual(0);
  });
  
  test("state.get throws error for invalid item index from array", () => {
    const consoleSpy = jest.spyOn(console, "error");
    testState.get(`friends.[4]`, { getItemIndex: true });
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });
  
  test("state.get retrieves item by index from array", () => {
    expect(testState.get(`favFoods.[1]`)).toEqual("burgers");
  });
  
  test("state.get returns original value", () => {
    const steve = { id: 3, name: "Steve" };
    const friends = testState.get("friends");
    friends.push(steve);
    testState.set({ friends });
    expect(testState.get(`friends.[id=3]`, { returnOriginal: true })).toBe(steve);
  });
});

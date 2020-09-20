import { addHoney, createHoneyPot } from "../";


test("getting state from addHoney", () => {

  const isTall = false;

  const state = addHoney("test", {
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

  expect(state.get("name")).toBe("Kody");
  expect(state.get("age").toBe(28));
  expect(state.get("isFanOfSports")).toBe(true);
  expect(state.get("friends")).toBeInstanceOf(Array);
  expect(state.get("friends")).toHaveLength(0);
  expect(state.get("aboutMe")).toBeInstanceOf(Object);
  expect(state.get("aboutMe.isTall")).toBe(false);
  expect(() => {
    state.get("aboutMe.doesNotExist")
  }).toThrow();
  expect(state.get(`favFoods`)[2]).toBe("steak");
});

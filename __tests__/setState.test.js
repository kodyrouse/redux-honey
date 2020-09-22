import { addHoney, createHoneyPot } from "../";



test("setting state for addHoney", () => {

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
  state.set({ name: "Sarah" });
  expect(state.get("name")).toBe("Sarah");
  expect(state.get("age")).toBe(28);
  state.set({ age: 30 });
  expect(state.get("age")).toBe(30);
  expect(state.get("isFanOfSports")).toBe(true);
  state.set({ isFanOfSports: false });
  expect(state.get("isFanOfSports")).toBe(false);
  expect(() => {
    state.set({ willFail: true });
  }).toThrow();
  expect(state.get("aboutMe.isTall")).toBe(false);
  const aboutMe = state.get("aboutMe");
  aboutMe.isTall = true;
  state.set({ aboutMe });
  expect(state.get("aboutMe.isTall")).toBe(true);
});

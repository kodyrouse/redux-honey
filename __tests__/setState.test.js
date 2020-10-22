import { addHoney, createHoneyPot } from "../";

describe("state.set properly sets values", () => {
  
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
  
  test("state.set properly sets string values", () => {
    expect(state.get("name")).toBe("Kody");
    state.set({ name: "Sarah" });
    expect(state.get("name")).toBe("Sarah");
  });
  
  test("state.set properly sets numeric values", () => {
    expect(state.get("age")).toBe(28);
    state.set({ age: 30 });
    expect(state.get("age")).toBe(30);
  });
  
  test("state.set properly sets boolean values", () => {
    expect(state.get("isFanOfSports")).toBe(true);
    state.set({ isFanOfSports: false });
    expect(state.get("isFanOfSports")).toBe(false);
  });
  
  test("state.set properly sets object values", () => {
    expect(state.get("aboutMe.isTall")).toBe(false);
    const aboutMe = state.get("aboutMe");
    aboutMe.isTall = true;
    state.set({ aboutMe });
    expect(state.get("aboutMe.isTall")).toBe(true);
  })
})

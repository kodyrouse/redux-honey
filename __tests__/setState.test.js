import { addHoney, createHoneyPot } from "../";

describe("state.set properly sets values", () => {
  
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
  
  test("state.set properly sets string values", () => {
    expect(testState.get("name")).toBe("Kody");
    testState.set({ name: "Sara" });
    expect(testState.get("name")).toBe("Sarah");
  });
  
  test("state.set properly sets numeric values", () => {
    expect(testState.get("age")).toBe(28);
    testState.set({ age: 30 });
    expect(testState.get("age")).toBe(30);
  });
  
  test("state.set properly sets boolean values", () => {
    expect(testState.get("isFanOfSports")).toBe(true);
    testState.set({ isFanOfSports: false });
    expect(testState.get("isFanOfSports")).toBe(false);
  });
  
  test("state.set properly sets object values", () => {
    expect(testState.get("aboutMe.isTall")).toBe(false);
    const aboutMe = testState.get("aboutMe");
    aboutMe.isTall = true;
    testState.set({ aboutMe });
    expect(testState.get("aboutMe.isTall")).toBe(true);
  })
})

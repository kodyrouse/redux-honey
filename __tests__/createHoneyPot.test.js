import { createHoneyPot, addHoney } from "../";

test("creating store honey pot", () => {

  const testState = addHoney("test", {
    name: "Kody",
    age: 28
  });

  expect(createHoneyPot({ testState })).toBe(undefined);
})

import { createHoneyPot, addHoney } from "../";

test("Creates store honey pot", () => {

  const testState = addHoney("state", {
    name: "Kody",
    age: 28
  });

  expect(createHoneyPot({ testState })).toBeInstanceOf(Object);
})

import { createHoneyPot, addHoney, canBeOneOf, arrayOf, anyValue, arrayTypes } from "../";

test("Setting addHoney with null value", () => {

  const test = addHoney("testOne", {
    test: null
  });

  expect(() => {
    createHoneyPot({ test }, { typeSafe: true });
  }).toThrow();
});

test("Setting addHoney with empty object", () => {

  const test = addHoney("testTwo", {
    key: {}
  });

  expect(() => {
    createHoneyPot({ test }, { typeSafe: true });
  }).toThrow();
});

test("Setting addHoney with empty array", () => {

  const test = addHoney("testThree", {
    key: []
  });

  expect(() => {
    createHoneyPot({ test }, { typeSafe: true });
  }).toThrow();
});

test("Setting addHoney to empty canBeOneOf", () => {

  const test = addHoney("testFour", {
    key: canBeOneOf()
  });

  expect(() => {
    createHoneyPot({ test }, { typeSafe: true });
  }).toThrow();
})

test("Setting addHoney with canBeOneOf with multi-type options", () => {

  const test = addHoney("testFive", () => {
    key: canBeOneOf("one", 2)
  });

  expect(() => {
    createHoneyPot({ test }, { typeSafe: true });
  }).toThrow();
})

test("Setting addHoney canBeOneOf to unsupported type", () => {

  const test = addHoney("testSix", {
    key: canBeOneOf([], [])
  })

  expect(() => {
    createHoneyPot({ test }, { typeSafe: true });
  }).toThrow();
})

test("Setting addHoney arrayOf with empty option", () => {

  const test = addHoney("testSeven", {
    key: arrayOf()
  });

  expect(() => {
    createHoneyPot({ test }, { typeSafe: true });
  }).toThrow();
})

test("Setting addHoney arrayOf with integer", () => {

  const test = addHoney("testEight", {
    key: arrayOf(1)
  });

  expect(() => {
    createHoneyPot({ test }, { typeSafe: true });
  }).toThrow();
})


// test("setting add honey state with typeSafe", () => {
// 
// 
//   expect(() => {
//     addHoney("testEight", {
//       key: arrayOf(1)
//     })
//   }).toThrow();
// 
//   expect(() => {
//     addHoney("testNine", {
//       key: arrayOf("one")
//     })
//   }).toThrow();
// 
//   expect(() => {
//     addHoney("testTen", {
//       key: arrayOf(false)
//     })
//   }).toThrow();
//  
//   expect(() => {
//     addHoney("testEleven", {
//       key: arrayOf(arrayTypes.Function)
//     })
//   }).toThrow();
// 
//   const state = addHoney("test", {
//     name: "Kody",
//     age: 28,
//     isFanOfSports: true,
//     days: canBeOneOf("sun", "mon", "tue", "wed", "thu", "fri", "sat"),
//     booleans: arrayOf(arrayTypes.Boolean),
//     strings: arrayOf(arrayTypes.String),
//     numbers: arrayOf(arrayTypes.Number),
//     friends: arrayOf({
//       id: 0,
//       name: ""
//     }),
//     anyValue: anyValue(),
//     aboutMe: {
//       isTall: isTall
//     },
//   });
// 
//   createHoneyPot({ state });
// 
//   expect(() => {
//     state.set({ willFail: true });
//   }).toThrow();
// 
//   expect(() => {
//     state.set({ name: true });
//   }).toThrow();
// 
//   expect(() => {
//     state.set({ age: "29" });
//   }).toThrow();
// 
//   expect(() => {
//     state.set({ isFanOfSports: "true" });
//   }).toThrow();
// 
//   expect(state.get("anyValue")).toBe(null);
//   expect(state.get("booleans")).toHaveLength(0);
//   expect(state.get("strings")).toHaveLength(0);
//   expect(state.get("numbers")).toHaveLength(0);
//   expect(state.get("friends")).toHaveLength(0);
// 
//   state.set({ anyValue: {} });
//   expect(state.get("anyValue")).toMatchObject({});
// 
//   expect(() => {
//     state.set({ friends: "" })
//   }).toThrow();
// });

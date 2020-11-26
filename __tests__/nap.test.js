import { nap } from "../";

describe("nap method properly waits given amount of time before continuing", () => {
  
  test("waits 500ms", async () => {
    const before = new Date().getTime();
    await nap(500);
    const duration = new Date().getTime() - before;
    expect(duration).toBeGreaterThanOrEqual(500);
  });
  
  test("console.error() for non-numeric argument", () => {
    const consoleSpy = jest.spyOn(console, "error");
    nap("hello");
    expect(consoleSpy).toHaveBeenCalled();
  });
})

import { CompilationServiceImpl } from "./compilation-service";
import "reflect-metadata";

describe("CompilationServiceImpl", () => {
  let compilationServiceImpl: CompilationServiceImpl;

  beforeEach(async () => {
    compilationServiceImpl = new CompilationServiceImpl();
  });

  it("should make 2 requests to server", async () => {
    try {
      await compilationServiceImpl.compile(
        "arduino:avr:mega",
        "e8665d51-4221-4d3c-b892-a672a2af37a2",
        "C:/Users/kevin/Documents/Arduino/Light_Project_1"
      );
    } catch (err) {
      console.error(err);
    }
    expect(true).toBe(false);
  }, 20000);
});

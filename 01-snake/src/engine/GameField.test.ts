import { GameField } from "./GameField";

describe("Game Field", () => {
  it("should have five apples present", () => {
    const field = new GameField();

    const apples = field.getApples();

    expect(apples.length).toBe(5);
  });
});

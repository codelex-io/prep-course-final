import { Cell } from "./Cell";

export class GameField {
  /**
   * Called when level completed
   */
  seed(): void {}

  getApples(): Cell[] {
    return [
      new Cell(33, 22),
      new Cell(35, 22),
      new Cell(37, 22),
      new Cell(39, 22)
    ];
  }

  isAppleInside(cell: Cell): boolean {
    return false;
  }

  removeApple(cell: Cell): void {}

  isEmpty(): boolean {
    return false;
  }
}

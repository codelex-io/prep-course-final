import { GameField } from "./engine/GameField";
import { Snake } from "./engine/Snake";
import { Cell } from "./engine/Cell";
import configuration from "./configuration";

export interface RuntimeConfiguration {
  level: number;
  speed: number;
}

export class Game {
  private runtimeConfiguration: RuntimeConfiguration = {
    level: 0,
    speed: configuration.defaultSpeed
  };
  private score: number = 0;
  private running = true;
  private field = new GameField();
  private snake = new Snake();
  private nextTick = 0;

  getSnake(): Snake {
    return this.snake;
  }

  shouldUpdate(time: number): boolean {
    return this.running && time >= this.nextTick;
  }

  update(time: number) {
    this.nextTick = time + configuration.defaultSpeed;

    this.snake.move();

    switch (this.checkState()) {
      case -1:
        this.die();
        break;
      case 1:
        this.snake.grow();
        this.score += 100;
        this.field.removeApple(this.snake.getHead());
        if (this.field.isEmpty()) {
          this.levelUp();
        }
    }
  }

  checkState() {
    const cell = this.snake.getHead();

    // left the play area or ate itself??
    if (this.isOutside(cell) || this.snake.isTakenBySnake(cell)) {
      // dead
      return -1;
    }

    // ate apple?
    if (this.field.isAppleInside(cell)) {
      return 1;
    }

    // nothing special
    return 0;
  }

  levelUp() {
    this.score += 1000;
    this.runtimeConfiguration.level++;
    if (this.runtimeConfiguration.level < configuration.maxLevel) {
      this.runtimeConfiguration.speed -= 7;
      this.field.seed();
    } else {
      this.win();
    }
  }

  win() {
    this.stop();
  }

  die() {
    this.stop();
  }

  isOutside(cell: Cell) {
    const { nbCellsX, nbCellsY } = configuration;
    return cell.x < 0 || cell.x >= nbCellsX || cell.y < 0 || cell.y >= nbCellsY;
  }

  getScore(): number {
    return this.score;
  }

  getField(): GameField {
    return this.field;
  }

  stop() {
    this.running = false;
  }
}

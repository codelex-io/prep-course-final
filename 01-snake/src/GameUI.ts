import configuration from "./configuration";
import { Game } from "./Game";

const COLORS = {
  field: "#00AA3E",
  apples: "#F8333C",
  brand: "#FFFFFF",
  lines: "#E7EBEB",
  snake: {
    eyes: "#FFFFFF",
    body: "#0A2E36"
  }
};

interface CanvasConfiguration {
  cellSize: number;
  scale: number;
}

const createCanvas = (
  canvasConfiguration: CanvasConfiguration
): HTMLCanvasElement => {
  const container = document.getElementById("game")!;
  const canvas = document.createElement("Canvas") as HTMLCanvasElement;
  container.appendChild(canvas);

  const { scale, cellSize } = canvasConfiguration;

  // canvas element size in the page
  canvas.style.width = configuration.nbCellsX * cellSize + "px";
  canvas.style.height = configuration.nbCellsY * cellSize + "px";

  // image buffer size
  canvas.width = configuration.nbCellsX * cellSize * scale;
  canvas.height = configuration.nbCellsY * cellSize * scale;

  return canvas;
};

class GameUI {
  private canvas: HTMLCanvasElement;
  private game: Game;
  private canvasConfiguration: CanvasConfiguration;

  constructor(canvas: HTMLCanvasElement, game: Game) {
    this.canvas = canvas;
    this.game = game;
    this.canvasConfiguration = {
      cellSize: 24,
      scale: 2
    };
    requestAnimationFrame(this.draw.bind(this));

    window.addEventListener("keydown", this.onKeyDown.bind(this), false);
    window.focus();
  }

  draw(time: number) {
    const context = this.canvas.getContext("2d")!;
    if (this.game.shouldUpdate(time)) {
      this.drawBackground(context);
      this.drawGrid(context);
      this.drawBrand(context);
      this.drawApples(context);
      this.drawSnake(context);
      this.drawScore(context);
      this.game.update(time);
    }
    requestAnimationFrame(this.draw.bind(this));
  }

  drawBackground(context: CanvasRenderingContext2D) {
    const { width, height } = this.canvas;

    context.fillStyle = COLORS.field;
    context.fillRect(0, 0, width, height);
  }

  drawBrand(context: CanvasRenderingContext2D) {
    const { width, height } = this.canvas;

    context.font = height / 4 + "px Roboto";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillStyle = COLORS.brand;
    context.fillText("CODELEX", width / 2, height / 2);
  }

  drawScore(context: CanvasRenderingContext2D) {
    const { scale } = this.canvasConfiguration;
    context.font = 35 * scale + "px Arial";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillStyle = COLORS.lines;
    context.fillText(this.game.getScore().toString(), 10 * scale, 10 * scale);
  }

  drawGrid(context: CanvasRenderingContext2D) {
    const { width, height } = this.canvas;
    const { scale, cellSize } = this.canvasConfiguration;
    const lineWidth = 1 * scale;

    context.strokeStyle = COLORS.lines;
    context.lineWidth = lineWidth;

    for (let x = 0; x <= width; x += cellSize * scale) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y <= height; y += cellSize * scale) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  }

  drawApples(context: CanvasRenderingContext2D) {
    const { scale, cellSize } = this.canvasConfiguration;
    const lineWidth = 1 * scale;

    context.fillStyle = COLORS.apples;
    const apples = this.game.getField().getApples();
    apples.forEach(cell =>
      context.fillRect(
        cellSize * scale * cell.x + lineWidth,
        cellSize * scale * cell.y + lineWidth,
        cellSize * scale - lineWidth * 2,
        cellSize * scale - lineWidth * 2
      )
    );
  }

  drawSnake(context: CanvasRenderingContext2D) {
    const snake = this.game.getSnake();
    const { scale, cellSize } = this.canvasConfiguration;
    // head
    const size = (cellSize * scale) / 10;
    const offset = (cellSize * scale) / 3;
    const x = cellSize * scale * snake.getHead().x;
    const y = cellSize * scale * snake.getHead().y;
    context.fillStyle = COLORS.snake.body;
    context.fillRect(x, y, cellSize * scale, cellSize * scale);
    // eyes
    switch (snake.getDirection()) {
      case "Up":
        context.beginPath();
        context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
        context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
        context.fillStyle = COLORS.snake.eyes;
        context.fill();
        break;
      case "Down":
        context.beginPath();
        context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
        context.arc(
          x + 2 * offset,
          y + 2 * offset,
          size,
          0,
          2 * Math.PI,
          false
        );
        context.fillStyle = COLORS.snake.eyes;
        context.fill();
        break;
      case "Right":
        context.beginPath();
        context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
        context.arc(
          x + 2 * offset,
          y + 2 * offset,
          size,
          0,
          2 * Math.PI,
          false
        );
        context.fillStyle = COLORS.snake.eyes;
        context.fill();
        break;
      case "Left":
        context.beginPath();
        context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
        context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
        context.fillStyle = COLORS.snake.eyes;
        context.fill();
        break;
    }
    // tail
    context.fillStyle = COLORS.snake.body;
    const tail = snake.getTail();
    tail.forEach(cell =>
      context.fillRect(
        cellSize * scale * cell.x,
        cellSize * scale * cell.y,
        cellSize * scale,
        cellSize * scale
      )
    );
  }

  onKeyDown(event: KeyboardEvent) {
    const snake = this.game.getSnake();
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        snake.setDirection("Up");
        break;
      case "ArrowDown":
        event.preventDefault();
        snake.setDirection("Down");
        break;
      case "ArrowLeft":
        event.preventDefault();
        snake.setDirection("Left");
        break;
      case "ArrowRight":
        event.preventDefault();
        snake.setDirection("Right");
        break;
    }
  }
}

new GameUI(
  createCanvas({
    cellSize: 24,
    scale: 2
  }),
  new Game()
);

import configuration from "./configuration";
import { Game } from "./engine/Game";

const CELL_SIZE = 20;
const SCALE = 2.0;

interface CanvasConfiguration {
  width: number;
  height: number;
}

class GameUI {
  private canvas: HTMLCanvasElement;
  private game: Game;
  private canvasConfiguration: CanvasConfiguration;

  constructor(canvas: HTMLCanvasElement, game: Game) {
    this.canvas = canvas;
    this.game = game;
    this.canvasConfiguration = {
      width: canvas.width,
      height: canvas.height
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
      this.drawScore(context);
      this.drawSnake(context);
      this.drawApples(context);
      this.game.update(time);
    }
    requestAnimationFrame(this.draw.bind(this));
  }

  drawBackground(context: CanvasRenderingContext2D) {
    const { width, height } = this.canvasConfiguration;

    context.fillStyle = "#4caf50";
    context.fillRect(0, 0, width, height);
  }

  drawBrand(context: CanvasRenderingContext2D) {
    const { width, height } = this.canvasConfiguration;

    context.font = height / 2.5 + "px Roboto";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillStyle = "rgba(255,255,255,0.75)";
    context.fillText("CODELEX", width / 2, height / 2);
  }

  drawScore(context: CanvasRenderingContext2D) {
    context.font = 35 * SCALE + "px Arial";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillStyle = "rgba(255,255,255,0.75)";
    context.fillText(game.getScore().toString(), 10 * SCALE, 10 * SCALE);
  }

  drawGrid(context: CanvasRenderingContext2D) {
    const { width, height } = this.canvasConfiguration;
    const { cellSize } = configuration;
    const lineWidth = 1 * SCALE;

    context.strokeStyle = "rgba(255,255,255,0.95)";
    context.lineWidth = lineWidth;

    for (let x = 0; x <= width; x += cellSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y <= height; y += cellSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  }

  drawApples(context: CanvasRenderingContext2D) {
    const { cellSize } = configuration;
    const lineWidth = 1 * SCALE;

    context.fillStyle = "#e91e63";
    const apples = game.getField().getApples();
    apples.forEach(cell =>
      context.fillRect(
        cellSize * cell.x + lineWidth,
        cellSize * cell.y + lineWidth,
        cellSize - lineWidth * 2,
        cellSize - lineWidth * 2
      )
    );
  }

  drawSnake(context: CanvasRenderingContext2D) {
    const snake = this.game.getSnake();
    const { cellSize } = configuration;
    // head
    const size = (CELL_SIZE * SCALE) / 10;
    const offset = (CELL_SIZE * SCALE) / 3;
    const x = cellSize * snake.getHead().x;
    const y = cellSize * snake.getHead().y;
    context.fillStyle = "#111111";
    context.fillRect(x, y, cellSize, cellSize);
    // eyes
    switch (snake.getDirection()) {
      case "Up":
        context.beginPath();
        context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
        context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
        context.fillStyle = "white";
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
        context.fillStyle = "white";
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
        context.fillStyle = "white";
        context.fill();
        break;
      case "Left":
        context.beginPath();
        context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
        context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
        context.fillStyle = "white";
        context.fill();
        break;
    }
    // tail
    context.fillStyle = "#333333";
    const tail = snake.getTail();
    tail.forEach(cell =>
      context.fillRect(cellSize * cell.x, cellSize * cell.y, cellSize, cellSize)
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

const createCanvas = (): HTMLCanvasElement => {
  const container = document.getElementById("game")!;
  const canvas = document.createElement("Canvas") as HTMLCanvasElement;
  container.appendChild(canvas);

  // canvas element size in the page
  canvas.style.width = configuration.nbCellsX * configuration.cellSize + "px";
  canvas.style.height = configuration.nbCellsY * configuration.cellSize + "px";

  // image buffer size
  canvas.width = configuration.nbCellsX * configuration.cellSize * SCALE;
  canvas.height = configuration.nbCellsY * configuration.cellSize * SCALE;

  return canvas;
};

const canvas = createCanvas();
const game = new Game();

new GameUI(canvas, game);

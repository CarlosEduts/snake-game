import GameCanvas from "../dom/game-canva.js";
import Food from "../model/food.js";
import Snake from "../model/snake.js";
import type { Bounds } from "../types/Bounds.js";
import { elements } from "../dom/elements.js";
import { bindDirectionInput } from "../input/direction-input.js";

type GameConfig = { velocity: number; pixel: number };

export class Game {
  private snake: Snake;
  private food: Food;
  private canvas: GameCanvas;
  private intervalId: number | null = null;

  constructor(
    private readonly bounds: Bounds,
    private readonly config: GameConfig,
  ) {
    this.snake = new Snake();
    this.food = new Food(bounds);
    this.canvas = new GameCanvas(elements.canvas, config.pixel);

    bindDirectionInput(() => this.snake, elements.gameControlButtons);
    elements.restartButton.addEventListener("click", () => this.restart());
  }

  public start(): void {
    this.intervalId = window.setInterval(
      () => this.tick(),
      this.config.velocity,
    );
  }

  public restart(): void {
    if (this.intervalId !== null) clearInterval(this.intervalId);

    this.snake = new Snake();
    this.food = new Food(this.bounds);
    elements.score.textContent = "0";
    elements.gameOverPage.style.visibility = "hidden";
    elements.inGamePage.style.visibility = "visible";

    this.canvas.render([...this.snake.getBody()], this.food);
    this.start();
  }

  private tick(): void {
    const nextHead = this.snake.peekNextHead(this.config.pixel);
    if (!nextHead) return; // "stopped": nada a fazer ainda

    if (this.snake.isCollidingWithWall(this.bounds)) {
      return this.endGame("A cobra encontrou uma parede.");
    }
    if (this.snake.isCollidingWithSelf()) {
      return this.endGame("A cobra encontrou a si mesma.");
    }

    const ateFood =
      nextHead.x === this.food.coordinates.x &&
      nextHead.y === this.food.coordinates.y;

    this.snake.advance(this.config.pixel, ateFood);

    if (ateFood) {
      this.food.respawn(this.bounds, [...this.snake.getBody()]);
      elements.score.textContent = this.snake.bodyLength().toString();
    }

    this.canvas.render([...this.snake.getBody()], this.food);
  }

  private endGame(message: string): void {
    if (this.intervalId !== null) clearInterval(this.intervalId);
    this.snake.setDirection("stopped");
    elements.inGamePage.style.visibility = "hidden";
    elements.gameOverPage.style.visibility = "visible";
    elements.gameOverMessage.textContent = message;
    elements.finalScore.textContent = this.snake.bodyLength().toString();
  }
}

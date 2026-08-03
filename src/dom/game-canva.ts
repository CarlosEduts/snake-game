interface Coordinates {
  x: number;
  y: number;
}

interface Food {
  coordinates: Coordinates;
}

const colors = {
  ink: "#0F1A12",
  line: "#1E2E20",
  fern: "#5FA463",
  fernBright: "#8FD08F",
  fernDark: "#3F7A45",
  amber: "#D99A3D",
  amberBright: "#F0C878",
} as const;

export default class GameCanvas {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly width: number;
  private readonly height: number;
  private readonly pixel: number;
  private static readonly SCALE_GAP = 2;
  private static readonly EYE_RADIUS = 1.6;

  constructor(canvas: HTMLCanvasElement, pixel: number) {
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("2D context not supported by this canvas.");
    }

    this.ctx = context;
    this.width = canvas.width;
    this.height = canvas.height;
    this.pixel = pixel;
  }

  public render(snakeBody: Coordinates[], food: Food): void {
    this.drawBackground();
    this.drawSnake(snakeBody);
    this.drawFood(food);
  }

  private drawBackground(): void {
    this.ctx.fillStyle = colors.ink;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.strokeStyle = colors.line;
    this.ctx.lineWidth = 1;

    for (let x = this.pixel; x < this.width; x += this.pixel) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + 0.5, 0);
      this.ctx.lineTo(x + 0.5, this.height);
      this.ctx.stroke();
    }

    for (let y = this.pixel; y < this.height; y += this.pixel) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y + 0.5);
      this.ctx.lineTo(this.width, y + 0.5);
      this.ctx.stroke();
    }
  }

  private drawSnake(body: Coordinates[]): void {
    const gap = GameCanvas.SCALE_GAP;
    const inset = gap / 2;

    body.forEach((node, index) => {
      const isHead = index === body.length - 1;
      const isEven = index % 2 === 0;

      this.ctx.fillStyle = isHead
        ? colors.fernBright
        : isEven
          ? colors.fern
          : colors.fernDark;

      this.ctx.beginPath();
      this.ctx.roundRect(
        node.x + inset,
        node.y + inset,
        this.pixel - gap,
        this.pixel - gap,
        isHead ? 6 : 4,
      );
      this.ctx.fill();

      if (isHead) {
        this.drawEyes(node);
      }
    });
  }

  private drawEyes(head: Coordinates): void {
    const size = this.pixel;

    this.ctx.fillStyle = colors.ink;
    this.ctx.beginPath();
    this.ctx.arc(
      head.x + size * 0.3,
      head.y + size * 0.35,
      GameCanvas.EYE_RADIUS,
      0,
      Math.PI * 2,
    );
    this.ctx.arc(
      head.x + size * 0.7,
      head.y + size * 0.35,
      GameCanvas.EYE_RADIUS,
      0,
      Math.PI * 2,
    );
    this.ctx.fill();
  }

  private drawFood(food: Food): void {
    const size = this.pixel;
    const radius = size / 2 - 2;
    const cx = food.coordinates.x + size / 2;
    const cy = food.coordinates.y + size / 2;

    this.ctx.fillStyle = colors.amber;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = colors.amberBright;
    this.ctx.beginPath();
    this.ctx.arc(
      cx - radius * 0.35,
      cy - radius * 0.35,
      radius * 0.3,
      0,
      Math.PI * 2,
    );
    this.ctx.fill();
  }
}

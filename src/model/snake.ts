type Direction = "up" | "down" | "left" | "right" | "stopped";

type Node = { x: number; y: number };

type Bounds = {
  width: number;
  height: number;
  pixelSize: number;
};

type Delta = { dx: number; dy: number };

const MIN_LENGTH_FOR_SELF_COLLISION = 5;

const OPPOSITE_DIRECTION: Partial<Record<Direction, Direction>> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const DIRECTION_DELTA: Partial<Record<Direction, Delta>> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

// Cabeça: Último nó
// Cauda: Primeiro nó
export class Snake {
  private direction: Direction;
  private body: Array<Node>;

  constructor() {
    this.direction = "stopped";
    this.body = [{ x: 0, y: 0 }];
  }

  public getDirection(): Direction {
    return this.direction;
  }

  public setDirection(direction: Direction): void {
    if (this.isReversal(direction) && !this.canReverse()) {
      return; // Reversão inválida com corpo >= 2
    }

    this.direction = direction;
  }

  /** Retorna uma cópia do corpo, para evitar vazar a referência interna. */
  public getBody(): ReadonlyArray<Node> {
    return [...this.body];
  }

  public bodyLength(): number {
    return this.body.length;
  }

  /**
   * Avança a cobra uma célula na direção atual.
   * Se `stopped`, não faz nada (não há delta definido).
   * Se `ateFood`, a cauda não é removida (a cobra cresce).
   */
  public advance(pixelSize: number, ateFood = false): void {
    const delta = DIRECTION_DELTA[this.direction];
    if (!delta) {
      return; // "stopped": não se move
    }

    const head = this.getHead();
    const newHead: Node = {
      x: head.x + delta.dx * pixelSize,
      y: head.y + delta.dy * pixelSize,
    };

    this.addHead(newHead);
    if (!ateFood) {
      this.removeTail();
    }
  }

  public checkWallCollision(bounds: Bounds): boolean {
    const head = this.getHead();

    return (
      head.x < 0 ||
      head.y < 0 ||
      head.x > bounds.width - bounds.pixelSize ||
      head.y > bounds.height - bounds.pixelSize
    );
  }

  public checkSnakesOwnCollision(): boolean {
    if (this.bodyLength() < MIN_LENGTH_FOR_SELF_COLLISION) {
      return false;
    }

    const head = this.getHead();
    const bodyWithoutHead = this.body.slice(0, -1);

    return bodyWithoutHead.some(
      (node) => node.x === head.x && node.y === head.y,
    );
  }

  private addHead(node: Node): void {
    this.body.push(node);
  }

  private removeTail(): void {
    this.body.shift();
  }

  private isReversal(direction: Direction): boolean {
    return OPPOSITE_DIRECTION[this.direction] === direction;
  }

  private canReverse(): boolean {
    return this.bodyLength() < 2;
  }

  private getHead(): Node {
    const head = this.body[this.bodyLength() - 1];
    if (!head) {
      throw new Error("[Error] There is no head node.");
    }
    return head;
  }
}

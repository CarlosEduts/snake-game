import { type Bounds } from "../types/Bounds.js";

export type Coordinates = {
  x: number;
  y: number;
};

export default class Food {
  private position: Coordinates;

  constructor(bounds: Bounds, occupied: Coordinates[] = []) {
    this.position = this.randomizePosition(bounds, occupied);
  }

  public get coordinates(): Coordinates {
    return { ...this.position };
  }

  public respawn(bounds: Bounds, occupied: Coordinates[] = []): void {
    this.position = this.randomizePosition(bounds, occupied);
  }

  private randomizePosition(
    bounds: Bounds,
    occupied: Coordinates[],
  ): Coordinates {
    const columns = Math.floor(bounds.width / bounds.pixelSize);
    const rows = Math.floor(bounds.height / bounds.pixelSize);

    let candidate: Coordinates;
    do {
      candidate = {
        x: Math.floor(Math.random() * columns) * bounds.pixelSize,
        y: Math.floor(Math.random() * rows) * bounds.pixelSize,
      };
    } while (this.isOccupied(candidate, occupied));

    return candidate;
  }

  private isOccupied(position: Coordinates, occupied: Coordinates[]): boolean {
    return occupied.some((c) => c.x === position.x && c.y === position.y);
  }
}

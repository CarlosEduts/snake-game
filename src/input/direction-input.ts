import type Snake from "../model/snake.js";

const KEY_TO_DIRECTION: Record<string, "up" | "down" | "left" | "right"> = {
  a: "left",
  ArrowLeft: "left",
  w: "up",
  ArrowUp: "up",
  s: "down",
  ArrowDown: "down",
  d: "right",
  ArrowRight: "right",
};

export function bindDirectionInput(
  getSnake: () => Snake,
  gameControlButtons: NodeListOf<HTMLButtonElement>,
): void {
  document.addEventListener("keydown", (event) => {
    const direction = KEY_TO_DIRECTION[event.key];
    if (!direction) return;

    event.preventDefault();
    getSnake().setDirection(direction);
  });

  gameControlButtons.forEach((button) => {
    const direction = button.dataset.direction as
      | "up"
      | "down"
      | "left"
      | "right"
      | undefined;
    if (!direction) return;

    button.addEventListener("click", () => getSnake().setDirection(direction));
  });
}

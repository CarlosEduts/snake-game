function required<T extends Element>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`[Error] Element not found: ${selector}`);
  return el;
}

export const elements = {
  inGamePage: required<HTMLDivElement>(".in-game"),
  gameOverPage: required<HTMLDivElement>(".game-over"),
  gameOverMessage: required<HTMLDivElement>(".game-over__message"),
  finalScore: required<HTMLDivElement>("#finalScore"),
  restartButton: required<HTMLButtonElement>("#restartButton"),
  score: required<HTMLParagraphElement>(".game-status_points"),
  canvas: required<HTMLCanvasElement>("#canvas"),

  // Botões de direção pro modo mobile (data-direction="up" | "down" | "left" | "right")
  gameControlButtons:
    document.querySelectorAll<HTMLButtonElement>(".game-controls_btn"),
};

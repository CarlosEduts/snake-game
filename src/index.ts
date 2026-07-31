import { Snake } from "./model/snake.js";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement | null;
if (!canvas) throw new Error("[Error] Canvas not found");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[Error] Not is possible get 2D context");

const score = document.querySelector(
  ".game-status_points",
) as HTMLParagraphElement | null;
if (!score) throw new Error("[Error] Score not found");

const snake = new Snake();

const gameConfigs = {
  velocity: 150,
  pixel: 20,
  width: 400,
  height: 400,
};

const food: {
  x: number;
  y: number;
} = {
  x: 0,
  y: 0,
};

const genFood = () => {
  const max = gameConfigs.width / gameConfigs.pixel;
  food.x = Math.floor(Math.random() * (max + 1)) * gameConfigs.pixel;
  food.y = Math.floor(Math.random() * (max + 1)) * gameConfigs.pixel;

  console.log(food);
};
genFood();

document.addEventListener("keydown", (key) => {
  switch (key.key) {
    case "a":
    case "ArrowLeft":
      snake.setDirection("left");
      break;

    case "w":
    case "ArrowUp":
      snake.setDirection("up");
      break;

    case "s":
    case "ArrowDown":
      snake.setDirection("down");
      break;

    case "d":
    case "ArrowRight":
      snake.setDirection("right");
      break;

    default:
      break;
  }
});

setInterval(() => {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const lastHeadNode = snake.getBody()[snake.bodyLength() - 1]!; // Ultimo nó | Cabeça

  // Verificar se o alimento foi capturado
  if (lastHeadNode.x == food.x && lastHeadNode.y == food.y) {
    const firsNode = snake.getBody()[0]!; // Primeiro nó | Cauda
    snake.advance(gameConfigs.pixel, true);
    console.log("Food: ");

    genFood();

    ctx.fillStyle = "#e21010";
    ctx.fillRect(food.x, food.y, gameConfigs.pixel, gameConfigs.pixel);
    score.textContent = snake.bodyLength().toString();
  }

  if (
    snake.checkWallCollision({
      width: gameConfigs.width,
      height: gameConfigs.height,
      pixelSize: gameConfigs.pixel,
    }) ||
    snake.checkSnakesOwnCollision()
  ) {
    console.error("Game Over");
    snake.setDirection("stopped");
  }

  snake.advance(gameConfigs.pixel);

  ctx.fillStyle = "#e21010";
  ctx.fillRect(food.x, food.y, gameConfigs.pixel, gameConfigs.pixel);

  for (const node of snake.getBody()) {
    ctx.fillStyle = "#5910e2";
    ctx.strokeRect(node.x, node.y, gameConfigs.pixel, gameConfigs.pixel);
    ctx.fillRect(node.x, node.y, gameConfigs.pixel, gameConfigs.pixel);
  }

  // console.log(snake.nodes);
}, gameConfigs.velocity);

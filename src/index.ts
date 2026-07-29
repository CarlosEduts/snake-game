const canvas = document.querySelector("#canvas") as HTMLCanvasElement | null;
if (!canvas) throw new Error("[Error] Canvas not found");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[Error] Not is possible get 2D context");

const score = document.querySelector(
  ".game-status_points",
) as HTMLParagraphElement | null;
if (!score) throw new Error("[Error] Score not found");

const gameConfigs = {
  velocity: 150,
  pixel: 20,
  width: 400,
  height: 400,
};

type SnakeNode = {
  x: number;
  y: number;
};

type Snake = {
  direction: "up" | "down" | "left" | "right" | "stopped";
  nodes: Array<SnakeNode>;
};

const snake: Snake = {
  direction: "stopped",
  nodes: [{ x: 0, y: 0 }],
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
      if (snake.direction != "right" || snake.nodes.length < 2) {
        snake.direction = "left";
      }
      break;

    case "w":
    case "ArrowUp":
      if (snake.direction != "down" || snake.nodes.length < 2) {
        snake.direction = "up";
      }
      break;

    case "s":
    case "ArrowDown":
      if (snake.direction != "up" || snake.nodes.length < 2) {
        snake.direction = "down";
      }
      break;

    case "d":
    case "ArrowRight":
      if (snake.direction != "left" || snake.nodes.length < 2) {
        snake.direction = "right";
      }
      break;

    case "p":
      const firsNode = snake.nodes[0]!; // Primeiro nó | Cauda
      snake.nodes.unshift({ x: firsNode.x - gameConfigs.pixel, y: firsNode.y });

    default:
      break;
  }
});

setInterval(() => {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const lastHeadNode = snake.nodes[snake.nodes.length - 1]!; // Ultimo nó | Cabeça

  // Verificar se o alimento foi capturado
  if (lastHeadNode.x == food.x && lastHeadNode.y == food.y) {
    const firsNode = snake.nodes[0]!; // Primeiro nó | Cauda
    snake.nodes.unshift({ x: firsNode.x - gameConfigs.pixel, y: firsNode.y });
    console.log("Food: ");

    genFood();

    ctx.fillStyle = "#e21010";
    ctx.fillRect(food.x, food.y, gameConfigs.pixel, gameConfigs.pixel);
    score.textContent = snake.nodes.length.toString();
  }

  // Verificar colisão entre as paredes do jogo
  if (
    lastHeadNode.x < 0 ||
    lastHeadNode.y < 0 ||
    lastHeadNode.x > gameConfigs.width - gameConfigs.pixel ||
    lastHeadNode.y > gameConfigs.width - gameConfigs.pixel
  ) {
    console.error("Game Over");
    snake.direction = "stopped";
  }

  // Verificar colisão entre a própria cobra
  const newArr = [...snake.nodes];
  newArr.pop();
  if (snake.nodes.length != 4) {
    for (const node of newArr) {
      if (node.x == lastHeadNode.x && node.y == lastHeadNode.y) {
        console.error("Game Over");
        snake.direction = "stopped";
      }
    }
  }

  switch (snake.direction) {
    case "up":
      snake.nodes.push({
        x: lastHeadNode.x,
        y: lastHeadNode.y - gameConfigs.pixel,
      });

      snake.nodes.shift();
      break;

    case "down":
      snake.nodes.push({
        x: lastHeadNode.x,
        y: lastHeadNode.y + gameConfigs.pixel,
      });

      snake.nodes.shift();
      break;

    case "left":
      snake.nodes.push({
        x: lastHeadNode.x - gameConfigs.pixel,
        y: lastHeadNode.y,
      });

      snake.nodes.shift();
      break;

    case "right":
      snake.nodes.push({
        x: lastHeadNode.x + gameConfigs.pixel,
        y: lastHeadNode.y,
      });

      snake.nodes.shift();
      break;
  }

  ctx.fillStyle = "#e21010";
  ctx.fillRect(food.x, food.y, gameConfigs.pixel, gameConfigs.pixel);

  for (const node of snake.nodes) {
    ctx.fillStyle = "#5910e2";
    ctx.strokeRect(node.x, node.y, gameConfigs.pixel, gameConfigs.pixel);
    ctx.fillRect(node.x, node.y, gameConfigs.pixel, gameConfigs.pixel);
  }

  // console.log(snake.nodes);
}, gameConfigs.velocity);

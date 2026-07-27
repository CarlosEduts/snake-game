const canvas = document.querySelector("#canvas") as HTMLCanvasElement | null;
if (!canvas) throw new Error("[Error] Canvas not found");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[Error] Not is possible get 2D context");

const gameConfigs = {
  velocity: 500,
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
      snake.direction = "left";
      break;

    case "w":
      snake.direction = "up";
      break;

    case "s":
      snake.direction = "down";
      break;

    case "d":
      snake.direction = "right";
      break;

    case "p":
      const firsNode = snake.nodes[0]!; // Primeiro nó | Cauda
      snake.nodes.unshift({ x: firsNode.x - gameConfigs.pixel, y: firsNode.y });

    default:
      break;
  }
});

setInterval(() => {
  const lastHeadNode = snake.nodes[snake.nodes.length - 1]!; // Ultimo nó | Cabeça

  if (lastHeadNode.x == food.x && lastHeadNode.y == food.y) {
    const firsNode = snake.nodes[0]!; // Primeiro nó | Cauda
    snake.nodes.unshift({ x: firsNode.x - gameConfigs.pixel, y: firsNode.y });
    genFood();
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

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#e21010";
  ctx.fillRect(food.x, food.y, gameConfigs.pixel, gameConfigs.pixel);

  for (const node of snake.nodes) {
    ctx.fillStyle = "#5910e2";
    ctx.fillRect(node.x, node.y, gameConfigs.pixel, gameConfigs.pixel);
  }

  console.log(snake.nodes);
}, gameConfigs.velocity);

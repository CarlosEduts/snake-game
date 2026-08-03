import { bounds, gameConfigs } from "./config/game-config.js";
import { Game } from "./game/game.js";

const game = new Game(bounds, gameConfigs);
game.start();
